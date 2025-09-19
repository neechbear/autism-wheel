import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Export and Share Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display save diagram button', async ({ page }) => {
    // Check that the Save diagram button is visible
    await expect(page.getByRole('button', { name: 'Save diagram' })).toBeVisible();
  });

  test('should display copy link button', async ({ page }) => {
    // Check that the Copy link button is visible
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
  });

  test('should display print button', async ({ page }) => {
    // Check that the Print button is visible
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
  });
});