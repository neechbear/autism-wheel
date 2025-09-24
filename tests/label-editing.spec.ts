import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Label Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display edit categories button', async ({ page }) => {
    // Check that the Edit categories button is visible
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();
  });

  test('should enter edit mode when clicking "Edit categories"', async ({ page }) => {
    // Click the Edit categories button
    await page.getByRole('button', { name: 'Edit categories' }).click();
    // Should now show the editing interface
    await expect(page.getByText('Edit Categories')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save categories' })).toBeVisible();
  });
});
