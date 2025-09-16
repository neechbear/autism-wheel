import { test, expect } from '@playwright/test';

test.describe('Guided Tour', () => {
  test.beforeEach(async ({ page }) => {
    // The test server serves the app at the root, so we navigate to the root.
    await page.goto('http://localhost:3000/');
    // Wait for the main heading to be visible before running any test.
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should start the tour when the "Help" button is clicked', async ({ page }) => {
    // The tour should not be visible by default (on first load it will be, so we close it)
    if (await page.locator('.shepherd-modal-overlay-container').isVisible()) {
        await page.locator('.shepherd-cancel-icon').click();
    }
    await expect(page.locator('.shepherd-modal-overlay-container')).not.toBeVisible();

    // Click the "Help" button.
    await page.getByRole('button', { name: 'Help' }).click();

    // The tour should now be visible.
    await expect(page.locator('.shepherd-modal-overlay-container')).toBeVisible();
    await expect(page.getByText('Welcome to the Autism Wheel!')).toBeVisible();
  });

  test('should not start the tour automatically if it has been completed before', async ({ page }) => {
    // Set localStorage to indicate that the tour has been completed.
    await page.addInitScript(() => {
      window.localStorage.setItem('autismWheelTourCompleted', 'true');
    });

    // Reload the page
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });

    // The tour should not be visible.
    // The tour should not be visible.
    await expect(page.locator('.shepherd-modal-overlay-container')).not.toBeVisible();
  });

  test('should start automatically on first visit', async ({ page }) => {
    // Ensure localStorage is clear for this test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });

    // The tour should be visible automatically.
    await expect(page.locator('.shepherd-modal-overlay-container')).toBeVisible();
    await expect(page.getByText('Welcome to the Autism Wheel!')).toBeVisible();
  });
});
