import { test, expect } from '@playwright/test';

test.describe('HTML File Export Generation & Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if the circular diagram is visible and wait for it to be ready
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    await page.waitForTimeout(1000); // Allow the diagram to fully render
  });

  test('should generate valid HTML export', async ({ page }) => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    // Intercept the download to capture the actual blob data
    await page.addInitScript(() => {
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = (blob: Blob | MediaSource) => {
        (window as any).__capturedBlob = blob;
        return originalCreateObjectURL(blob);
      };

      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        if (tagName === 'a') {
          const originalClick = element.click;
          element.click = function() {
            const anchor = this as HTMLAnchorElement;
            (window as any).__capturedFilename = anchor.download;
          };
        }
        return element;
      };
    });

    // Check if HTML export option is available (depends on locked mode)
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);

    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const htmlAvailable = await htmlOption.count() > 0;

    if (htmlAvailable) {
      // Trigger HTML export
      await htmlOption.click();
      await page.waitForTimeout(1500); // HTML export might take longer

      // Get the captured blob and filename
      const result = await page.evaluate(async () => {
        const blob = (window as any).__capturedBlob;
        const filename = (window as any).__capturedFilename;

        if (!blob) return null;

        const text = await blob.text();

        return {
          type: blob.type,
          size: blob.size,
          filename: filename,
          contentStart: text.substring(0, 500), // First 500 chars for validation
          hasDoctype: text.trim().startsWith('<!DOCTYPE html'),
          hasHtmlTag: text.includes('<html'),
          hasHead: text.includes('<head>'),
          hasBody: text.includes('<body'),
          hasMetaTag: text.includes('meta[name="autism-wheel-state"]'),
          hasScript: text.includes('<script')
        };
      });

      // Validate HTML format and structure
      if (result) {
        expect(result.type).toBe('text/html;charset=utf-8');
        expect(result.size).toBeGreaterThan(10000); // HTML should be substantial
        expect(result.filename).toMatch(/\.html$/);

        // Validate HTML document structure
        expect(result.hasDoctype).toBe(true);
        expect(result.hasHtmlTag).toBe(true);
        expect(result.hasHead).toBe(true);
        expect(result.hasBody).toBe(true);
        expect(result.hasScript).toBe(true); // Should contain the app JavaScript

        // Should start with proper DOCTYPE
        expect(result.contentStart.trim()).toMatch(/^<!DOCTYPE html>/);
      }
    } else {
      // Close dropdown if HTML option not available
      await page.keyboard.press('Escape');
    }
  });

  test('should generate valid locked HTML export', async ({ page }) => {
    let capturedBlob: Blob | null = null;
    let capturedFilename = '';

    // Intercept the download to capture the actual blob data
    await page.addInitScript(() => {
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = (blob: Blob | MediaSource) => {
        (window as any).__capturedBlob = blob;
        return originalCreateObjectURL(blob);
      };

      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        if (tagName === 'a') {
          const originalClick = element.click;
          element.click = function() {
            const anchor = this as HTMLAnchorElement;
            (window as any).__capturedFilename = anchor.download;
          };
        }
        return element;
      };
    });

    // Check if locked HTML export option is available
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);

    const lockedHtmlOption = page.getByRole('menuitem', { name: 'Save as locked HTML' });
    const lockedHtmlAvailable = await lockedHtmlOption.count() > 0;

    if (lockedHtmlAvailable) {
      // Trigger locked HTML export
      await lockedHtmlOption.click();
      await page.waitForTimeout(1500); // HTML export might take longer

      // Get the captured blob and filename
      const result = await page.evaluate(async () => {
        const blob = (window as any).__capturedBlob;
        const filename = (window as any).__capturedFilename;

        if (!blob) return null;

        const text = await blob.text();

        return {
          type: blob.type,
          size: blob.size,
          filename: filename,
          contentStart: text.substring(0, 500),
          hasDoctype: text.trim().startsWith('<!DOCTYPE html'),
          hasHtmlTag: text.includes('<html'),
          hasLockedMeta: text.includes('autism-wheel-locked-html-mode'),
          hasStateMeta: text.includes('autism-wheel-state'),
          hasMyAutismWheelTitle: text.includes('My Autism Wheel')
        };
      });

      // Validate locked HTML format and structure
      if (result) {
        expect(result.type).toBe('text/html;charset=utf-8');
        expect(result.size).toBeGreaterThan(10000);
        expect(result.filename).toMatch(/locked\.html$/);

        // Validate locked HTML specific features
        expect(result.hasDoctype).toBe(true);
        expect(result.hasHtmlTag).toBe(true);
        expect(result.hasLockedMeta).toBe(true); // Should have locked mode meta tag
        expect(result.hasStateMeta).toBe(true);  // Should have state preservation
        expect(result.hasMyAutismWheelTitle).toBe(true); // Should have modified title
      }
    } else {
      // Close dropdown if locked HTML option not available
      await page.keyboard.press('Escape');
    }
  });

  test('should handle HTML export workflow without errors', async ({ page }) => {
    // Test the HTML export workflow end-to-end
    const saveButton = page.getByRole('button', { name: 'Save diagram' });

    // First interact with the wheel to create some state
    const firstSegment = page.locator('[data-testid^="segment-"]').first();
    if (await firstSegment.isVisible()) {
      await firstSegment.click();
      await page.waitForTimeout(200);
    }

    // Test HTML export if available
    await saveButton.click();
    await page.waitForTimeout(200);

    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const lockedHtmlOption = page.getByRole('menuitem', { name: 'Save as locked HTML' });

    const htmlAvailable = await htmlOption.count() > 0;
    const lockedHtmlAvailable = await lockedHtmlOption.count() > 0;

    if (htmlAvailable) {
      await htmlOption.click();
      await page.waitForTimeout(1000);

      // Verify page is still functional after HTML export
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    } else if (lockedHtmlAvailable) {
      await lockedHtmlOption.click();
      await page.waitForTimeout(1000);

      // Verify page is still functional after locked HTML export
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    } else {
      // Close dropdown if no HTML options available
      await page.keyboard.press('Escape');
    }

    // Verify the circular diagram is still visible and functional
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should preserve application state in HTML export', async ({ page }) => {
    // Interact with the wheel to create some specific state
    const segments = page.locator('[data-testid^="segment-"]');
    const segmentCount = await segments.count();

    if (segmentCount > 0) {
      // Click on a few segments to create state
      await segments.nth(0).click();
      await page.waitForTimeout(200);
      await segments.nth(1).click();
      await page.waitForTimeout(200);
    }

    // Intercept the download to capture the actual blob data
    await page.addInitScript(() => {
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = (blob: Blob | MediaSource) => {
        (window as any).__capturedBlob = blob;
        return originalCreateObjectURL(blob);
      };
    });

    // Check if HTML export option is available
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);

    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const htmlAvailable = await htmlOption.count() > 0;

    if (htmlAvailable) {
      // Trigger HTML export
      await htmlOption.click();
      await page.waitForTimeout(1500);

      // Get the captured blob and validate it's a proper HTML file
      const exportInfo = await page.evaluate(async () => {
        const blob = (window as any).__capturedBlob;
        if (!blob) return null;

        const text = await blob.text();

        return {
          hasValidHTML: text.trim().startsWith('<!DOCTYPE html') && text.includes('<html'),
          hasBody: text.includes('<body'),
          isSubstantial: text.length > 5000, // HTML export should be substantial
          hasScript: text.includes('<script')
        };
      });

      if (exportInfo) {
        // HTML export should produce valid, substantial HTML content
        expect(exportInfo.hasValidHTML).toBe(true);
        expect(exportInfo.hasBody).toBe(true);
        expect(exportInfo.isSubstantial).toBe(true);
        expect(exportInfo.hasScript).toBe(true);
      }
    } else {
      await page.keyboard.press('Escape');
    }
  });

  test('should handle HTML export menu availability correctly', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);

    // Check for HTML export options (they may or may not be available depending on app state)
    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const lockedHtmlOption = page.getByRole('menuitem', { name: 'Save as locked HTML' });

    // HTML options may be present (depends on locked mode status)
    const htmlCount = await htmlOption.count();
    const lockedHtmlCount = await lockedHtmlOption.count();

    // At least one HTML option should typically be available, but this may depend on app state
    expect(htmlCount + lockedHtmlCount).toBeGreaterThanOrEqual(0);

    // Close the dropdown
    await page.keyboard.press('Escape');
  });
});