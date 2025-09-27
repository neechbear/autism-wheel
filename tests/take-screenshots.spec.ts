import { test, expect } from '@playwright/test';

test.describe('Application Screenshots (Before Refactor)', () => {
  // Increase the timeout for this test suite as the initial server start can be slow.
  test.setTimeout(120000); // 2 minutes

  test('takes screenshots of the main views', async ({ page }) => {
    // Navigate to the application. Playwright will automatically start the server.
    await page.goto('/');

    // 1. Normal View Screenshot
    // Wait for the main SVG diagram to be visible and stable.
    const diagram = page.locator('svg[width="750"]');
    await expect(diagram).toBeVisible({ timeout: 60000 }); // Wait up to 60 seconds
    await page.waitForTimeout(2000); // Wait an extra 2 seconds for animations to settle
    await page.screenshot({ path: 'screenshot-before-normal.png', fullPage: true });

    // 2. Help View Screenshot
    await page.getByRole('button', { name: 'Help' }).click();
    const helpHeading = page.getByRole('heading', { name: 'How to Use This Tool' });
    await expect(helpHeading).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-before-help.png', fullPage: true });

    // Return to the main view
    await page.getByRole('button', { name: 'Return to app' }).click();
    await expect(diagram).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);


    // 3. Edit Categories View Screenshot
    await page.getByRole('button', { name: 'Edit categories' }).click();
    const editHeading = page.getByRole('heading', { name: 'Edit Categories' });
    await expect(editHeading).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-before-edit.png', fullPage: true });
  });
});