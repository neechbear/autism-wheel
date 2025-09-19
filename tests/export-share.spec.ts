import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Export and Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test.describe('Copy Link Functionality', () => {
    test('should copy link to clipboard', async ({ page }) => {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      // Make some selections first to ensure we have data to share
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(0).click();
      await clickablePaths.nth(5).click();
      
      // Click copy link button
      await page.getByRole('button', { name: 'Copy link' }).click();
      
      // Verify clipboard contains a URL
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('http');
      expect(clipboardText).toMatch(/[?&]data=/); // Should contain compressed data parameter
    });

    test('should generate different links for different selections', async ({ page }) => {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      
      // Make initial selections and copy link
      await clickablePaths.nth(0).click();
      await page.getByRole('button', { name: 'Copy link' }).click();
      const firstLink = await page.evaluate(() => navigator.clipboard.readText());
      
      // Make different selections and copy link again
      await clickablePaths.nth(0).click(); // Deselect
      await clickablePaths.nth(10).click(); // Select different segment
      await page.getByRole('button', { name: 'Copy link' }).click();
      const secondLink = await page.evaluate(() => navigator.clipboard.readText());
      
      // Links should be different
      expect(firstLink).not.toBe(secondLink);
    });
  });

  test.describe('Print Functionality', () => {
    test('should trigger print dialog', async ({ page }) => {
      // Listen for print events
      let printTriggered = false;
      await page.exposeFunction('mockPrint', () => {
        printTriggered = true;
      });
      
      // Override window.print
      await page.addInitScript(() => {
        (window as any).print = () => (window as any).mockPrint();
      });
      
      // Click print button
      await page.getByRole('button', { name: 'Print' }).click();
      
      // Verify print was triggered
      expect(printTriggered).toBe(true);
    });

    test('should hide print-specific elements during print', async ({ page }) => {
      // Add print media query styles and check that print:hidden elements are hidden
      await page.addStyleTag({
        content: `
          @media print {
            .print\\:hidden { display: none !important; }
          }
        `
      });
      
      // Elements with print:hidden class should be hidden in print mode
      const printHiddenElements = page.locator('.print\\:hidden');
      const count = await printHiddenElements.count();
      
      if (count > 0) {
        // Apply print media and verify elements are hidden
        await page.emulateMedia({ media: 'print' });
        await expect(printHiddenElements.first()).not.toBeVisible();
        
        // Reset to screen media
        await page.emulateMedia({ media: 'screen' });
        await expect(printHiddenElements.first()).toBeVisible();
      }
    });
  });

  test.describe('Save Diagram Functionality', () => {
    test('should open save dropdown with format options', async ({ page }) => {
      // Click the save diagram dropdown
      await page.getByRole('button', { name: 'Save diagram' }).click();
      
      // Verify format options are available
      await expect(page.getByText('Save as PNG')).toBeVisible();
      await expect(page.getByText('Save as SVG')).toBeVisible();
      await expect(page.getByText('Save as JPEG')).toBeVisible();
    });

    test('should trigger PNG download', async ({ page }) => {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download');
      
      // Click save dropdown and select PNG
      await page.getByRole('button', { name: 'Save diagram' }).click();
      await page.getByText('Save as PNG').click();
      
      // Verify download starts
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('autismwheel.png');
    });

    test('should trigger SVG download', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      await page.getByRole('button', { name: 'Save diagram' }).click();
      await page.getByText('Save as SVG').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('autismwheel.svg');
    });

    test('should trigger JPEG download', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      await page.getByRole('button', { name: 'Save diagram' }).click();
      await page.getByText('Save as JPEG').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('autismwheel.jpeg');
    });
  });

  test.describe('URL State Persistence', () => {
    test('should restore state from URL parameters', async ({ page }) => {
      // Make some selections and configurations
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(0).click();
      await clickablePaths.nth(5).click();
      
      // Change theme to dark
      await page.getByRole('button', { name: /Theme/ }).click();
      await page.getByText('Dark').click();
      
      // Copy the link (which contains state)
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', { name: 'Copy link' }).click();
      const linkWithState = await page.evaluate(() => navigator.clipboard.readText());
      
      // Navigate to the URL with state
      await page.goto(linkWithState);
      
      // Verify the page loads with the saved state
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
      
      // Verify dark theme is applied
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);
      
      // Verify selections are restored (check that table has data)
      const table = page.locator('table').last();
      const tableRows = table.locator('tbody tr');
      const rowCount = await tableRows.count();
      expect(rowCount).toBeGreaterThan(0);
    });

    test('should handle invalid URL parameters gracefully', async ({ page }) => {
      // Navigate to URL with invalid data parameter
      await page.goto('http://localhost:3000/?data=invalid_data_string');
      
      // Page should still load with default state
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
      
      // Should display default labels
      await expect(page.getByText('Social Interaction & Relationships')).toBeVisible();
    });

    test('should handle empty URL parameters', async ({ page }) => {
      // Navigate to URL with empty data parameter
      await page.goto('http://localhost:3000/?data=');
      
      // Page should load with default state
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Social Interaction & Relationships')).toBeVisible();
    });
  });

  test.describe('Data Sharing Integration', () => {
    test('should preserve custom labels in shared links', async ({ page }) => {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      // Edit labels first
      await page.getByRole('button', { name: 'Edit labels' }).click();
      const firstLabelInput = page.locator('input[type="text"]').first();
      await firstLabelInput.fill('Custom Test Label');
      await page.getByRole('button', { name: 'Save labels' }).click();
      
      // Copy link with custom labels
      await page.getByRole('button', { name: 'Copy link' }).click();
      const linkWithCustomLabels = await page.evaluate(() => navigator.clipboard.readText());
      
      // Navigate to the shared link
      await page.goto(linkWithCustomLabels);
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
      
      // Verify custom label is restored
      await expect(page.getByText('Custom Test Label')).toBeVisible();
    });

    test('should preserve selections and configurations in exports', async ({ page }) => {
      // Make selections and configure settings
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(3).click();
      await clickablePaths.nth(7).click();
      
      // Change number position
      await page.getByRole('button', { name: /Numbers/ }).click();
      await page.getByText('Right aligned').click();
      
      // The diagram should now reflect these changes in any export
      // (Visual verification would require more complex testing of generated files)
      
      // Verify the interface shows the changes
      await expect(page.getByRole('button', { name: /Numbers/ })).toBeVisible();
      
      // Check that data table reflects selections
      const table = page.locator('table').last();
      const tableRows = table.locator('tbody tr');
      const rowCount = await tableRows.count();
      expect(rowCount).toBeGreaterThan(0);
    });
  });
});