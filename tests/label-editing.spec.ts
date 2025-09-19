import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Label Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display edit labels button', async ({ page }) => {
    // Check that the Edit labels button is visible
    await expect(page.getByRole('button', { name: 'Edit labels' })).toBeVisible();
  });

  test('should enter edit mode when clicking "Edit labels"', async ({ page }) => {
    // Click the Edit labels button
    await page.getByRole('button', { name: 'Edit labels' }).click();
    // Should now show the editing interface
    await expect(page.getByText('Edit Labels')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save labels' })).toBeVisible();
  });
});
