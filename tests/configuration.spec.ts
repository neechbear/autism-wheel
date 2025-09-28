import { test, expect } from '@playwright/test';

test.describe('Display Configuration Controls (Numbers & Theme)', () => {
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

  test('should open numbers dropdown menu when clicked', async ({ page }) => {
    // Find and click the numbers button to open dropdown
    const numbersButton = page.getByRole('button', { name: /Numbers/ });
    await expect(numbersButton).toBeVisible();
    await numbersButton.click();

    // Wait for dropdown menu to appear
    await page.waitForTimeout(200);

    // Check that the dropdown menu items are visible
    await expect(page.getByRole('menuitem', { name: 'Left aligned' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Center aligned' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Right aligned' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Hide segment numbers', exact: true })).toBeVisible();

    // Click one of the options to test functionality
    await page.getByRole('menuitem', { name: 'Left aligned' }).click();

    // Verify the dropdown closed and page is still functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should open theme dropdown menu when clicked', async ({ page }) => {
    // Find and click the theme button to open dropdown
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await expect(themeButton).toBeVisible();
    await themeButton.click();

    // Wait for dropdown menu to appear
    await page.waitForTimeout(200);

    // Check that the dropdown menu items are visible
    await expect(page.getByRole('menuitem', { name: 'Use system' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Light' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Dark' })).toBeVisible();

    // Click one of the options to test functionality
    await page.getByRole('menuitem', { name: 'Light' }).click();

    // Verify the dropdown closed and page is still functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should change theme when selecting different theme options', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /Theme/ });

    // Test switching to dark theme
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await page.waitForTimeout(500); // Wait for theme change

    // Test switching to light theme
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Light' }).click();
    await page.waitForTimeout(500); // Wait for theme change

    // Verify the page is still functional after theme changes
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should handle multiple configuration changes without errors', async ({ page }) => {
    // Test numbers configuration changes
    const numbersButton = page.getByRole('button', { name: /Numbers/ });
    await numbersButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Center aligned' }).click();
    await page.waitForTimeout(200);

    // Test theme configuration changes
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await page.waitForTimeout(200);

    // Test more numbers configuration changes
    await numbersButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Hide segment numbers', exact: true }).click();
    await page.waitForTimeout(200);

    // Verify the page is still functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});
