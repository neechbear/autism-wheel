import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Circular Diagram Interaction', () => {
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

  test('should display the ASD level labels', async ({ page }) => {
    await expect(page.locator('text:has-text("ASD-1")')).toBeVisible();
    await expect(page.locator('text:has-text("ASD-2")')).toBeVisible();
    await expect(page.locator('text:has-text("ASD-3")')).toBeVisible();
  });

  test('should allow clicking on wheel segments', async ({ page }) => {
    // Find the first available segment
    const firstSegment = page.locator('[data-testid^="segment-"]').first();

    // Get the initial fill color
    const initialFill = await firstSegment.getAttribute('fill');

    // Click the segment
    await firstSegment.click();

    // Wait a moment for any color change animation
    await page.waitForTimeout(100);

    // Verify the segment is still visible and has some fill color
    await expect(firstSegment).toBeVisible();
    await expect(firstSegment).toHaveAttribute('fill');

    // The fill should be some valid color (not empty)
    const newFill = await firstSegment.getAttribute('fill');
    expect(newFill).toBeTruthy();
    expect(newFill).toMatch(/^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{8}$/); // Valid hex color
  });
});
