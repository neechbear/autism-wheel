import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Configuration Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display numbers configuration button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Numbers/ })).toBeVisible();
  });

  test('should display theme configuration button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Theme/ })).toBeVisible();
  });
});
