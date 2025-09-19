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
});
