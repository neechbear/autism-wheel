import { test, expect, Page } from '@playwright/test';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Test utilities for HTML export validation
export class HTMLExportTestRunner {
  private static exportedFiles: Map<string, string> = new Map();
  private static tempDir = join(process.cwd(), 'test-results', 'html-exports');

  /**
   * Set up custom application state for testing state preservation
   */
  static async setupCustomState(page: Page): Promise<void> {
    console.log('Setting up custom application state...');

    // Wait for the application to be fully loaded
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    await page.waitForTimeout(1000);

    // 1. Interact with diagram segments to create selections
    const segments = page.locator('[data-testid^="segment-"]');
    const segmentCount = await segments.count();

    if (segmentCount >= 3) {
      // Click on several segments to create varied selections
      await segments.nth(0).click();
      await page.waitForTimeout(300);
      await segments.nth(1).click();
      await page.waitForTimeout(300);
      await segments.nth(2).click();
      await page.waitForTimeout(300);
      console.log('Set diagram selections on segments 0, 1, and 2');
    }

    // 2. Try to access and modify view options/settings if available
    const settingsControls = page.locator('[data-testid*="option"], .view-options, [aria-label*="show"], input[type="checkbox"], .toggle');
    const settingsCount = await settingsControls.count();

    if (settingsCount > 0) {
      // Toggle some settings
      const firstSetting = settingsControls.first();
      if (await firstSetting.isVisible()) {
        await firstSetting.click();
        await page.waitForTimeout(200);
        console.log('Modified view options/settings');
      }
    }

    // 3. Try to modify categories if edit functionality is available
    const editCategoriesButton = page.getByRole('button', { name: 'Edit categories' });
    if (await editCategoriesButton.count() > 0 && await editCategoriesButton.isVisible()) {
      await editCategoriesButton.click();
      await page.waitForTimeout(500);

      // Look for category editing interface
      const categoryInputs = page.locator('input[type="text"], textarea').first();
      if (await categoryInputs.count() > 0) {
        // Modify a category name/description
        await categoryInputs.fill('Custom Test Category');
        await page.waitForTimeout(200);

        // Save changes if there's a save button
        const saveButton = page.getByRole('button', { name: 'Save categories' });
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(300);
        }
        console.log('Modified category information');
      }

      // Return to main view
      const backButton = page.getByRole('button', { name: /back|main|cancel/i });
      if (await backButton.count() > 0) {
        await backButton.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(500);
    }

    console.log('Custom application state setup complete');
  }

  /**
   * Extract current application state for comparison
   */
  static async extractCurrentState(page: Page): Promise<any> {
    return await page.evaluate(() => {
      // Try to extract state from localStorage, DOM, or global variables
      const state = {
        localStorage: { ...localStorage },
        title: document.title,
        segments: Array.from(document.querySelectorAll('[data-testid^="segment-"]')).map(el => ({
          testId: el.getAttribute('data-testid'),
          classes: el.className,
          style: (el as HTMLElement).style.cssText
        })),
        checkboxes: Array.from(document.querySelectorAll('input[type="checkbox"]')).map(el => ({
          checked: (el as HTMLInputElement).checked,
          name: (el as HTMLInputElement).name || el.getAttribute('data-testid')
        })),
        customCategories: document.querySelector('[data-testid*="category"], .category')?.textContent?.includes('Custom Test Category'),
        metaTags: Array.from(document.querySelectorAll('meta')).map(el => ({
          name: el.getAttribute('name'),
          content: el.getAttribute('content')
        }))
      };
      return state;
    });
  }

  /**
   * Export HTML files and prepare them for testing
   * NOTE: The page should already have blob interception set up via addInitScript before page load
   */
  static async exportAndPrepareHTML(page: Page): Promise<{ regular: string | null, locked: string | null }> {
    // Ensure temp directory exists
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }

    const results = { regular: null as string | null, locked: null as string | null };

    // Try to export regular HTML
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);

    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const lockedHtmlOption = page.getByRole('menuitem', { name: 'Save as locked HTML' });

    // Export regular HTML if available
    if (await htmlOption.count() > 0) {
      console.log('Attempting regular HTML export...');
      await htmlOption.click();
      await page.waitForTimeout(1500);

      const htmlContent = await page.evaluate(async () => {
        const blob = (window as any).__capturedBlob;
        return blob ? await blob.text() : null;
      });

      console.log('HTML content length:', htmlContent ? htmlContent.length : 'null');

      if (htmlContent) {
        const regularPath = join(this.tempDir, 'regular-export.html');
        writeFileSync(regularPath, htmlContent, 'utf-8');
        results.regular = regularPath;
        this.exportedFiles.set('regular', regularPath);
        console.log('Regular HTML export saved to:', regularPath);
      }

      // Reset for next export
      await page.evaluate(() => {
        (window as any).__capturedBlob = null;
      });
    }

    // Export locked HTML if available
    await saveButton.click();
    await page.waitForTimeout(200);

    if (await lockedHtmlOption.count() > 0) {
      console.log('Attempting locked HTML export...');
      await lockedHtmlOption.click();
      await page.waitForTimeout(1500);

      const lockedHtmlContent = await page.evaluate(async () => {
        const blob = (window as any).__capturedBlob;
        return blob ? await blob.text() : null;
      });

      console.log('Locked HTML content length:', lockedHtmlContent ? lockedHtmlContent.length : 'null');

      if (lockedHtmlContent) {
        const lockedPath = join(this.tempDir, 'locked-export.html');
        writeFileSync(lockedPath, lockedHtmlContent, 'utf-8');
        results.locked = lockedPath;
        this.exportedFiles.set('locked', lockedPath);
        console.log('Locked HTML export saved to:', lockedPath);
      }
    } else {
      await page.keyboard.press('Escape');
    }

    return results;
  }

  /**
   * Get the file path for a specific export type
   */
  static getExportPath(type: 'regular' | 'locked'): string | null {
    return this.exportedFiles.get(type) || null;
  }

  /**
   * Check if we're currently testing an exported HTML file
   */
  static isTestingExport(page: Page): Promise<boolean> {
    return page.evaluate(() => {
      return window.location.protocol === 'file:' ||
             document.querySelector('meta[name="autism-wheel-locked-html-mode"]') !== null ||
             document.title.includes('My Autism Wheel');
    });
  }

  /**
   * Check if we're testing a locked HTML export
   */
  static isTestingLockedExport(page: Page): Promise<boolean> {
    return page.evaluate(() => {
      return document.querySelector('meta[name="autism-wheel-locked-html-mode"]') !== null;
    });
  }

  /**
   * Tests that should be skipped for locked HTML exports
   */
  static shouldSkipForLockedHTML(testName: string): boolean {
    const skipPatterns = [
      'html export', // Avoid recursion
      'save as html', // Export functionality disabled in locked mode
      'copy link', // URL sharing may be limited
      'edit categories', // Editing typically disabled in locked mode
      'should allow editing', // General editing restrictions
    ];

    return skipPatterns.some(pattern =>
      testName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Tests that should be skipped entirely for HTML exports
   */
  static shouldSkipForHTMLExports(testName: string): boolean {
    const skipPatterns = [
      'html export', // Original export tests - avoid recursion
      'html-export.spec.ts', // Don't run the HTML export test file against exports
    ];

    return skipPatterns.some(pattern =>
      testName.toLowerCase().includes(pattern.toLowerCase())
    );
  }
}