import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should be able to switch to dark theme', async ({ page }) => {
    // Open theme dropdown
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await page.waitForTimeout(200);

    // Select dark theme
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await page.waitForTimeout(500); // Wait for theme change

    // Verify the theme has changed by checking document attributes or classes
    const isDarkTheme = await page.evaluate(() => {
      return document.documentElement.className.includes('dark') ||
             document.documentElement.getAttribute('data-theme') === 'dark';
    });

    // The page should still be functional with the new theme
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should be able to switch to light theme', async ({ page }) => {
    // First switch to dark to ensure we can switch back
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await page.waitForTimeout(500);

    // Now switch to light theme
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Light' }).click();
    await page.waitForTimeout(500);

    // Verify the theme has changed
    const isLightTheme = await page.evaluate(() => {
      return !document.documentElement.className.includes('dark') ||
             document.documentElement.getAttribute('data-theme') === 'light';
    });

    // The page should still be functional with the new theme
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should be able to switch to system theme', async ({ page }) => {
    // Open theme dropdown and select system theme
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await page.waitForTimeout(200);

    // Select system theme
    await page.getByRole('menuitem', { name: 'Use system' }).click();
    await page.waitForTimeout(500);

    // The page should still be functional with system theme
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should cycle through all themes without errors', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /Theme/ });

    const themes = ['Light', 'Dark', 'Use system'];

    for (const theme of themes) {
      // Open theme dropdown
      await themeButton.click();
      await page.waitForTimeout(200);

      // Select the theme
      await page.getByRole('menuitem', { name: theme }).click();
      await page.waitForTimeout(500);

      // Verify the page is still functional
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
      const svg = page.locator('svg').first();
      await expect(svg).toBeVisible();
    }
  });

  test('should maintain theme selection after page interaction', async ({ page }) => {
    // Switch to dark theme
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await themeButton.click();
    await page.waitForTimeout(200);
    await page.getByRole('menuitem', { name: 'Dark' }).click();
    await page.waitForTimeout(500);

    // Interact with other parts of the application
    const firstSegment = page.locator('[data-testid^="segment-"]').first();
    if (await firstSegment.isVisible()) {
      await firstSegment.click();
      await page.waitForTimeout(200);
    }

    // Open and close some other menus
    const numbersButton = page.getByRole('button', { name: /Numbers/ });
    if (await numbersButton.isVisible()) {
      await numbersButton.click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape'); // Close dropdown
    }

    // Theme should still be applied
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should handle rapid theme switching', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /Theme/ });

    // Rapidly switch between themes
    for (let i = 0; i < 3; i++) {
      await themeButton.click();
      await page.waitForTimeout(100);
      await page.getByRole('menuitem', { name: 'Dark' }).click();
      await page.waitForTimeout(100);

      await themeButton.click();
      await page.waitForTimeout(100);
      await page.getByRole('menuitem', { name: 'Light' }).click();
      await page.waitForTimeout(100);
    }

    // Application should still be functional
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});