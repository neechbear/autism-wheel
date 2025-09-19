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
});
