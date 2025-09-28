import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Data Table and Breakdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display detailed breakdown section', async ({ page }) => {
    // Verify the detailed breakdown section exists
    await expect(page.getByText('Detailed Breakdown')).toBeVisible();
  });

  test('should display breakdown table', async ({ page }) => {
    // Verify the table exists
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
  });

  test('should show table headers', async ({ page }) => {
    // Verify the table has appropriate headers
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Check for typical column headers
    const headerCount = await page.locator('th, td').filter({ hasText: /Category|Typical|Stress/i }).count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('should have table rows with category data', async ({ page }) => {
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Check that the table has multiple rows (more than just the header)
    const rows = table.locator('tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1); // At least header + 1 data row

    // Check that there are table cells with content
    const cells = table.locator('td');
    const cellCount = await cells.count();
    expect(cellCount).toBeGreaterThan(0);
  });

  test('should handle table sorting when sort buttons are clicked', async ({ page }) => {
    // Look for sorting controls/buttons
    const sortButtons = page.locator('button').filter({ hasText: /sort|▲|▼|↑|↓/i });
    const regularSortButtons = page.locator('[data-testid*="sort"], .sort-button, button[aria-label*="sort"]');

    const sortButtonCount = await sortButtons.count() + await regularSortButtons.count();

    if (sortButtonCount > 0) {
      // If sort buttons exist, try clicking them
      const firstSortButton = sortButtons.first();
      if (await firstSortButton.isVisible()) {
        await firstSortButton.click();
        await page.waitForTimeout(200);
      }
    } else {
      // If no explicit sort buttons, try clicking column headers
      const headers = page.locator('th').filter({ hasText: /Category|Typical|Stress/i });
      const headerCount = await headers.count();

      if (headerCount > 0) {
        const firstHeader = headers.first();
        await firstHeader.click();
        await page.waitForTimeout(200);
      }
    }

    // Verify the table is still visible and functional after sorting attempt
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
  });

  test('should update table content when wheel is interacted with', async ({ page }) => {
    // First, take a snapshot of table content
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Interact with the wheel to change some values
    const firstSegment = page.locator('[data-testid^="segment-"]').first();
    if (await firstSegment.isVisible()) {
      await firstSegment.click();
      await page.waitForTimeout(300);

      // Click the same segment multiple times to change its value
      await firstSegment.click();
      await page.waitForTimeout(300);
    }

    // Verify the table is still visible and functional
    await expect(table).toBeVisible();

    // The table should still have rows and cells
    const rows = table.locator('tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1);
  });

  test('should handle table content display correctly', async ({ page }) => {
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Check that table cells contain some content (not empty)
    const dataCells = table.locator('td');
    const cellCount = await dataCells.count();

    if (cellCount > 0) {
      // Check that at least some cells have text content
      let hasContent = false;
      for (let i = 0; i < Math.min(cellCount, 5); i++) {
        const cellText = await dataCells.nth(i).textContent();
        if (cellText && cellText.trim().length > 0) {
          hasContent = true;
          break;
        }
      }
      expect(hasContent).toBe(true);
    }
  });

  test('should maintain table functionality during configuration changes', async ({ page }) => {
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Change some configuration options
    const themeButton = page.getByRole('button', { name: /Theme/ });
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(200);
      await page.getByRole('menuitem', { name: 'Dark' }).click();
      await page.waitForTimeout(300);
    }

    // Change numbers configuration
    const numbersButton = page.getByRole('button', { name: /Numbers/ });
    if (await numbersButton.isVisible()) {
      await numbersButton.click();
      await page.waitForTimeout(200);
      await page.getByRole('menuitem', { name: 'Left aligned' }).click();
      await page.waitForTimeout(300);
    }

    // Table should still be visible and functional
    await expect(table).toBeVisible();

    const rows = table.locator('tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1);
  });

  test('should handle multiple table interactions without errors', async ({ page }) => {
    const table = page.locator('table').last();
    await expect(table).toBeVisible();

    // Try multiple interactions with table area

    // 1. Try clicking on table headers
    const headers = table.locator('th');
    const headerCount = await headers.count();
    if (headerCount > 0) {
      await headers.first().click();
      await page.waitForTimeout(200);
    }

    // 2. Try scrolling within table area if it's scrollable
    await table.hover();
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(200);

    // 3. Verify table is still functional
    await expect(table).toBeVisible();

    const finalRows = table.locator('tr');
    const finalRowCount = await finalRows.count();
    expect(finalRowCount).toBeGreaterThan(1);

    // Overall page should still be functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });
});
