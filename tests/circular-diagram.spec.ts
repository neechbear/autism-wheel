import { test, expect } from '@playwright/test';

test.describe.skip('Autism Wheel - Circular Diagram Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display the circular diagram', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should display path elements in the diagram', async ({ page }) => {
    const svg = page.locator('svg').first();
    const paths = svg.locator('path');
    const pathCount = await paths.count();
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should update the second selection when clicking a third segment', async ({ page }) => {
    const sliceIndex = 0;
    const firstSegment = 2; // ring index 2 (value 3)
    const secondSegment = 5; // ring index 5 (value 6)
    const thirdSegment = 8; // ring index 8 (value 9)

    // 1. Click first segment to establish the "normal" selection.
    await page.locator(`[data-testid="segment-${sliceIndex}-${firstSegment}"]`).click();
    await expect(page.locator(`[data-testid="segment-${sliceIndex}-${firstSegment}"]`)).toHaveAttribute('fill', '#3B82F6');

    // 2. Click second segment to establish the "stress" selection.
    await page.locator(`[data-testid="segment-${sliceIndex}-${secondSegment}"]`).click();
    await expect(page.locator(`[data-testid="segment-${sliceIndex}-${secondSegment}"]`)).toHaveAttribute('fill', '#3B82F680');

    // 3. Click a third, unselected segment further out.
    await page.locator(`[data-testid="segment-${sliceIndex}-${thirdSegment}"]`).click();

    // 4. Verify the selections are updated correctly.
    // The first selection should remain unchanged.
    await expect(page.locator(`[data-testid="segment-${sliceIndex}-${firstSegment}"]`)).toHaveAttribute('fill', '#3B82F6');
    // The original second selection point should still be part of the "stress" range.
    await expect(page.locator(`[data-testid="segment-${sliceIndex}-${secondSegment}"]`)).toHaveAttribute('fill', '#3B82F680');
    // The new third segment should now be the outer boundary of the "stress" selection.
    await expect(page.locator(`[data-testid="segment-${sliceIndex}-${thirdSegment}"]`)).toHaveAttribute('fill', '#3B82F680');
  });
});
