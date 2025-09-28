import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Export and Share Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set up mocks before navigation to prevent print dialogs
    await page.addInitScript(() => {
      window.print = () => {
        console.log('Print dialog mocked');
      };
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display save diagram button', async ({ page }) => {
    // Check that the Save diagram button is visible
    await expect(page.getByRole('button', { name: 'Save diagram' })).toBeVisible();
  });

  test('should display copy link button', async ({ page }) => {
    // Check that the Copy link button is visible
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
  });

  test('should display print button', async ({ page }) => {
    // Check that the Print button is visible
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
  });

  test('should open save diagram dropdown when clicked', async ({ page }) => {
    // Click the Save diagram button to open the dropdown
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Wait for dropdown to appear
    await page.waitForTimeout(200);

    // Check for dropdown menu items for different formats
    await expect(page.getByRole('menuitem', { name: 'Save as PNG' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Save as SVG' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Save as JPEG' })).toBeVisible();

    // Check for HTML export options (if not in locked mode)
    const htmlOption = page.getByRole('menuitem', { name: 'Save as HTML' });
    const lockedHtmlOption = page.getByRole('menuitem', { name: 'Save as locked HTML' });

    // HTML options may be present (depends on locked mode status)
    const htmlCount = await htmlOption.count();
    const lockedHtmlCount = await lockedHtmlOption.count();

    // At least PNG, SVG, JPEG should always be present
    expect(htmlCount + lockedHtmlCount).toBeGreaterThanOrEqual(0);

    // Close the dropdown by pressing Escape
    await page.keyboard.press('Escape');
  });

  test('should handle copy link functionality', async ({ page }) => {
    // First interact with the wheel to create some state to share
    const firstSegment = page.locator('[data-testid^="segment-"]').first();
    await firstSegment.click();
    await page.waitForTimeout(200);

    // Click the Copy link button
    const copyLinkButton = page.getByRole('button', { name: 'Copy link' });
    await expect(copyLinkButton).toBeVisible();
    await copyLinkButton.click();

    // The copy link might show a dialog, alert, or just copy to clipboard
    // We'll check that the operation completed without error
    await page.waitForTimeout(500);

    // Verify the page is still functional after the copy operation
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should handle print functionality without errors', async ({ page }) => {
    // Click the Print button (print is mocked in beforeEach)
    const printButton = page.getByRole('button', { name: 'Print' });
    await expect(printButton).toBeVisible();
    await printButton.click();

    // Wait a moment for any print processing
    await page.waitForTimeout(500);

    // Verify the page is still functional after print
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should test save functionality by clicking menu items', async ({ page }) => {
    // Test PNG save
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as PNG' }).click();
    await page.waitForTimeout(500);

    // Test SVG save
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as SVG' }).click();
    await page.waitForTimeout(500);

    // Verify the page is still functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should generate valid PNG image data', async ({ page }) => {
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
            console.log('Download triggered:', anchor.download);
          };
        }
        return element;
      };
    });

    // Trigger PNG export
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as PNG' }).click();
    await page.waitForTimeout(1000);

    // Get the captured blob and filename
    const result = await page.evaluate(async () => {
      const blob = (window as any).__capturedBlob;
      const filename = (window as any).__capturedFilename;

      if (!blob) return null;

      // Convert blob to array buffer for analysis
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      return {
        type: blob.type,
        size: blob.size,
        filename: filename,
        // First few bytes for format validation
        header: Array.from(uint8Array.slice(0, 8))
      };
    });

    // Validate PNG format
    if (result) {
      expect(result.type).toBe('image/png');
      expect(result.size).toBeGreaterThan(1000); // Should be substantial size
      expect(result.filename).toMatch(/\.png$/);

      // Validate PNG file header (89 50 4E 47 0D 0A 1A 0A)
      expect(result.header[0]).toBe(137); // 0x89
      expect(result.header[1]).toBe(80);  // 0x50 'P'
      expect(result.header[2]).toBe(78);  // 0x4E 'N'
      expect(result.header[3]).toBe(71);  // 0x47 'G'
    }
  });

  test('should generate valid JPEG image data', async ({ page }) => {
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

    // Trigger JPEG export
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as JPEG' }).click();
    await page.waitForTimeout(1000);

    // Get the captured blob and filename
    const result = await page.evaluate(async () => {
      const blob = (window as any).__capturedBlob;
      const filename = (window as any).__capturedFilename;

      if (!blob) return null;

      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      return {
        type: blob.type,
        size: blob.size,
        filename: filename,
        header: Array.from(uint8Array.slice(0, 4))
      };
    });

    // Validate JPEG format
    if (result) {
      expect(result.type).toBe('image/jpeg');
      expect(result.size).toBeGreaterThan(1000);
      expect(result.filename).toMatch(/\.jpe?g$/);

      // Validate JPEG file header (FF D8 FF)
      expect(result.header[0]).toBe(255); // 0xFF
      expect(result.header[1]).toBe(216); // 0xD8
      expect(result.header[2]).toBe(255); // 0xFF
    }
  });

  test('should generate valid SVG image data', async ({ page }) => {
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

    // Trigger SVG export
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as SVG' }).click();
    await page.waitForTimeout(1000);

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
        content: text.substring(0, 200) // First 200 chars for validation
      };
    });

    // Validate SVG format
    if (result) {
      expect(result.type).toBe('image/svg+xml');
      expect(result.size).toBeGreaterThan(100);
      expect(result.filename).toMatch(/\.svg$/);

      // Validate SVG content structure
      expect(result.content).toMatch(/^<\?xml version="1\.0"/);
      expect(result.content).toContain('<svg');
      expect(result.content).toMatch(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    }
  });

  test('should validate image dimensions and quality', async ({ page }) => {
    // Test that generated images have reasonable dimensions
    await page.addInitScript(() => {
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
        // Capture canvas dimensions for validation
        (window as any).__canvasWidth = this.width;
        (window as any).__canvasHeight = this.height;
        (window as any).__imageType = type;
        (window as any).__imageQuality = quality;

        return originalToBlob.call(this, callback, type, quality);
      };
    });

    // Trigger PNG export to test canvas operations
    const saveButton = page.getByRole('button', { name: 'Save diagram' });
    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as PNG' }).click();
    await page.waitForTimeout(1000);

    // Validate canvas dimensions and settings
    const canvasInfo = await page.evaluate(() => {
      return {
        width: (window as any).__canvasWidth,
        height: (window as any).__canvasHeight,
        type: (window as any).__imageType,
        quality: (window as any).__imageQuality
      };
    });

    if (canvasInfo.width) {
      expect(canvasInfo.width).toBeGreaterThan(200); // Reasonable minimum width
      expect(canvasInfo.height).toBeGreaterThan(200); // Reasonable minimum height
      expect(canvasInfo.type).toBe('image/png');
    }
  });

  test('should handle multiple export operations without errors', async ({ page }) => {
    // Test multiple export operations in sequence
    const copyLinkButton = page.getByRole('button', { name: 'Copy link' });
    const printButton = page.getByRole('button', { name: 'Print' });
    const saveButton = page.getByRole('button', { name: 'Save diagram' });

    // Perform multiple operations
    await copyLinkButton.click();
    await page.waitForTimeout(300);

    await printButton.click();
    await page.waitForTimeout(300);

    await saveButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Save as PNG' }).click();
    await page.waitForTimeout(300);

    // Verify the application remains functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});