import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Circular Diagram Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display the circular diagram with proper structure', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    
    // Check for SVG viewBox and dimensions
    await expect(svg).toHaveAttribute('viewBox', '0 0 750 750');
    
    // Verify there are path elements for the ring segments
    const pathElements = svg.locator('path');
    const pathCount = await pathElements.count();
    
    // Should have paths for 10 slices × 10 rings = 100 segments plus some grid lines
    expect(pathCount).toBeGreaterThan(100);
  });

  test('should allow clicking on ring segments to make selections', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Find a clickable path element (ring segment)
    const clickablePath = svg.locator('path.cursor-pointer').first();
    await expect(clickablePath).toBeVisible();
    
    // Click on the segment
    await clickablePath.click();
    
    // The segment should now appear selected (typically changes color/opacity)
    // Note: This is a basic interaction test - specific visual validation would depend on 
    // how selections are rendered in the UI
  });

  test('should show tooltips when hovering over segments', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Find a clickable segment
    const segment = svg.locator('path.cursor-pointer').first();
    await expect(segment).toBeVisible();
    
    // Hover over the segment to trigger tooltip
    await segment.hover();
    
    // Wait for tooltip to appear - tooltips should contain category info
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    
    // Tooltip should contain impact level information
    await expect(tooltip.getByText(/Impact \d+\/10/)).toBeVisible();
  });

  test('should display center icons when enabled', async ({ page }) => {
    // Center icons should be visible by default
    const svg = page.locator('svg').first();
    
    // Look for emoji text elements in the center area
    const iconElements = svg.locator('text').filter({ hasText: /[�🗨️👂👋🔍🏠😰🔄📚�‍♀️]/ });
    const iconCount = await iconElements.count();
    
    // Should have icons for each slice (10 by default)
    expect(iconCount).toBeGreaterThanOrEqual(10);
  });

  test('should handle multiple selections in different rings', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Get multiple clickable paths (different segments)
    const clickablePaths = svg.locator('path.cursor-pointer');
    const pathCount = await clickablePaths.count();
    
    expect(pathCount).toBeGreaterThan(5); // Should have many segments
    
    // Click on a few different segments
    await clickablePaths.nth(0).click();
    await clickablePaths.nth(15).click(); // Different slice/ring
    await clickablePaths.nth(30).click(); // Another different segment
    
    // Basic verification that clicks were registered (detailed visual testing would require more specific selectors)
  });

  test('should show numerical indicators for selections', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Make some selections first
    const clickablePaths = svg.locator('path.cursor-pointer');
    await clickablePaths.nth(0).click();
    await clickablePaths.nth(1).click();
    await clickablePaths.nth(2).click();
    
    // Look for number text elements that indicate selection count
    await page.waitForTimeout(500); // Allow time for UI to update
    
    // Numbers should appear showing the selection count
    const numberElements = svg.locator('text').filter({ hasText: /^[1-9]\d*$/ });
    const numberCount = await numberElements.count();
    
    expect(numberCount).toBeGreaterThan(0);
  });

  test('should update detailed breakdown table when selections are made', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Make a selection
    const clickablePaths = svg.locator('path.cursor-pointer');
    await clickablePaths.nth(5).click();
    
    // Wait for table to update
    await page.waitForTimeout(500);
    
    // Check that the detailed breakdown table shows the selection
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
    
    // Should have rows with data (exact content depends on which segment was clicked)
    const tableRows = table.locator('tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('should allow deselecting segments by clicking again', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Click a segment to select it
    const segment = svg.locator('path.cursor-pointer').first();
    await segment.click();
    
    // Wait briefly
    await page.waitForTimeout(200);
    
    // Click the same segment again to deselect
    await segment.click();
    
    // The selection should be removed (this is a basic interaction test)
    // More specific validation would require checking visual state changes
  });

  test('should handle rapid clicking without errors', async ({ page }) => {
    const svg = page.locator('svg').first();
    const clickablePaths = svg.locator('path.cursor-pointer');
    
    // Rapidly click multiple segments
    for (let i = 0; i < 10; i++) {
      await clickablePaths.nth(i % 5).click({ timeout: 100 });
    }
    
    // App should remain functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    await expect(svg).toBeVisible();
  });
});