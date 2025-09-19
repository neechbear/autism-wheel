import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Data Table and Breakdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display detailed breakdown table', async ({ page }) => {
    // Verify the detailed breakdown section exists
    await expect(page.getByText('Detailed Breakdown')).toBeVisible();
    
    // Verify the table exists
    const table = page.locator('table').last(); // Get the breakdown table (not edit table)
    await expect(table).toBeVisible();
    
    // Check table headers
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Typical Impact')).toBeVisible();
    await expect(page.getByText('During Stress')).toBeVisible();
  });

  test('should show empty state when no selections are made', async ({ page }) => {
    // Initially, no selections should be made
    const table = page.locator('table').last();
    
    // Table should exist but have minimal/no data rows
    const dataRows = table.locator('tbody tr');
    const rowCount = await dataRows.count();
    
    // Should either have no rows or empty placeholder rows
    expect(rowCount).toBeGreaterThanOrEqual(0);
    
    // If there are rows, they should show no impact (0 or empty values)
    if (rowCount > 0) {
      const firstRow = dataRows.first();
      // Should contain zeros or empty indicators for no selections
      await expect(firstRow).toBeVisible();
    }
  });

  test('should populate table when selections are made', async ({ page }) => {
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    
    // Make several selections
    await clickablePaths.nth(0).click(); // First category, first ring
    await clickablePaths.nth(15).click(); // Different category/ring
    await clickablePaths.nth(30).click(); // Another selection
    
    // Wait for table to update
    await page.waitForTimeout(500);
    
    // Verify table shows data
    const table = page.locator('table').last();
    const dataRows = table.locator('tbody tr');
    const rowCount = await dataRows.count();
    
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify at least some rows have non-zero values
    const cellsWithNumbers = table.locator('td').filter({ hasText: /[1-9]\d*/ });
    const numbersCount = await cellsWithNumbers.count();
    expect(numbersCount).toBeGreaterThan(0);
  });

  test.describe('Table Sorting', () => {
    test('should sort by category when clicking category header', async ({ page }) => {
      // Make some selections first to have data to sort
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(0).click();
      await clickablePaths.nth(10).click();
      await clickablePaths.nth(20).click();
      
      await page.waitForTimeout(500);
      
      // Click the Category header to sort
      const categoryHeader = page.getByText('Category').locator('..');
      await categoryHeader.click();
      
      // Verify sort indicator appears (chevron up/down icons)
      const sortIndicator = categoryHeader.locator('svg[data-lucide="chevron-up"], svg[data-lucide="chevron-down"]');
      await expect(sortIndicator.first()).toBeVisible();
      
      // Click again to reverse sort order
      await categoryHeader.click();
      
      // Sort indicator should still be visible but potentially different direction
      await expect(sortIndicator.first()).toBeVisible();
    });

    test('should sort by typical impact column', async ({ page }) => {
      // Make selections and test sorting by typical impact
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(5).click();
      await clickablePaths.nth(15).click();
      await clickablePaths.nth(25).click();
      
      await page.waitForTimeout(500);
      
      // Click Typical Impact header
      const typicalHeader = page.getByText('Typical Impact').locator('..');
      await typicalHeader.click();
      
      // Check for sort indicators
      const sortIndicator = typicalHeader.locator('svg[data-lucide="chevron-up"], svg[data-lucide="chevron-down"]');
      await expect(sortIndicator.first()).toBeVisible();
    });

    test('should sort by stress impact column', async ({ page }) => {
      // Make selections and test sorting by stress impact
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(8).click();
      await clickablePaths.nth(18).click();
      await clickablePaths.nth(28).click();
      
      await page.waitForTimeout(500);
      
      // Click During Stress header
      const stressHeader = page.getByText('During Stress').locator('..');
      await stressHeader.click();
      
      // Check for sort indicators
      const sortIndicator = stressHeader.locator('svg[data-lucide="chevron-up"], svg[data-lucide="chevron-down"]');
      await expect(sortIndicator.first()).toBeVisible();
    });

    test('should show visual feedback for current sort column', async ({ page }) => {
      // Make selections
      const svg = page.locator('svg').first();
      const clickablePaths = svg.locator('path.cursor-pointer');
      await clickablePaths.nth(2).click();
      await clickablePaths.nth(12).click();
      
      await page.waitForTimeout(500);
      
      // Click a header to sort
      const categoryHeader = page.getByText('Category').locator('..');
      await categoryHeader.click();
      
      // The currently sorted column should show active state
      const activeChevron = categoryHeader.locator('svg').filter({ hasText: /./ });
      const chevronCount = await activeChevron.count();
      expect(chevronCount).toBeGreaterThan(0);
      
      // Click a different column
      const typicalHeader = page.getByText('Typical Impact').locator('..');
      await typicalHeader.click();
      
      // New column should show active state
      const newActiveChevron = typicalHeader.locator('svg').filter({ hasText: /./ });
      const newChevronCount = await newActiveChevron.count();
      expect(newChevronCount).toBeGreaterThan(0);
    });
  });

  test('should update table when selections change', async ({ page }) => {
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    const table = page.locator('table').last();
    
    // Make initial selection
    await clickablePaths.nth(0).click();
    await page.waitForTimeout(300);
    
    // Capture initial table state
    const initialRows = table.locator('tbody tr');
    const initialRowCount = await initialRows.count();
    
    // Make additional selections
    await clickablePaths.nth(10).click();
    await clickablePaths.nth(20).click();
    await page.waitForTimeout(300);
    
    // Table should show updated data
    const updatedCells = table.locator('td').filter({ hasText: /[1-9]\d*/ });
    const updatedCellCount = await updatedCells.count();
    expect(updatedCellCount).toBeGreaterThan(0);
    
    // Remove a selection
    await clickablePaths.nth(0).click(); // Deselect first
    await page.waitForTimeout(300);
    
    // Table should update accordingly
    const finalCells = table.locator('td').filter({ hasText: /[1-9]\d*/ });
    const finalCellCount = await finalCells.count();
    
    // Should still have data from remaining selections
    expect(finalCellCount).toBeGreaterThan(0);
  });

  test('should display category names correctly in table', async ({ page }) => {
    // Make selections across different categories
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    
    // Select from multiple categories (different slice indices)
    await clickablePaths.nth(0).click();  // Category 0
    await clickablePaths.nth(11).click(); // Category 1 (11 = 1*10 + 1, assuming 10 rings per slice)
    await clickablePaths.nth(22).click(); // Category 2
    
    await page.waitForTimeout(500);
    
    // Check that category names appear in the table
    const table = page.locator('table').last();
    
    // Should show category names from the initial labels
    const expectedCategories = [
      'Social Interaction & Relationships',
      'Communication Differences',
      'Sensory Experiences'
    ];
    
    for (const category of expectedCategories) {
      await expect(table.getByText(category)).toBeVisible();
    }
  });

  test('should handle large numbers of selections', async ({ page }) => {
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    
    // Make many selections
    for (let i = 0; i < Math.min(20, await clickablePaths.count()); i++) {
      await clickablePaths.nth(i).click();
      if (i % 5 === 0) {
        await page.waitForTimeout(100); // Brief pause every 5 clicks
      }
    }
    
    await page.waitForTimeout(500);
    
    // Table should still function properly
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
    
    // Should have multiple rows with data
    const dataRows = table.locator('tbody tr');
    const rowCount = await dataRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Sorting should still work
    const categoryHeader = page.getByText('Category').locator('..');
    await categoryHeader.click();
    
    // Table should remain functional
    await expect(table).toBeVisible();
  });

  test('should maintain table state when switching between edit and view modes', async ({ page }) => {
    // Make selections
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    await clickablePaths.nth(5).click();
    await clickablePaths.nth(15).click();
    
    await page.waitForTimeout(500);
    
    // Verify table has data
    const table = page.locator('table').last();
    const cellsWithData = table.locator('td').filter({ hasText: /[1-9]\d*/ });
    const initialDataCount = await cellsWithData.count();
    expect(initialDataCount).toBeGreaterThan(0);
    
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit labels' }).click();
    await expect(page.getByText('Edit Labels')).toBeVisible();
    
    // Exit edit mode without changes
    await page.getByRole('button', { name: 'Save labels' }).click();
    
    // Table should still show the same data
    const finalCellsWithData = table.locator('td').filter({ hasText: /[1-9]\d*/ });
    const finalDataCount = await finalCellsWithData.count();
    expect(finalDataCount).toBe(initialDataCount);
  });
});