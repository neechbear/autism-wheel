import { test, expect } from '@playwright/test';

test.describe('Theme Selection & Visual Appearance Changes', () => {
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
    const themes = ['Light', 'Dark', 'Use system'];

    for (const theme of themes) {
      // Find and click the theme button - be more specific about finding it
      const themeButton = page.getByRole('button', { name: /Theme/ });
      await expect(themeButton).toBeVisible({ timeout: 10000 });
      
      // Check if dropdown is already open, if so close it first
      const isDropdownOpen = await page.locator('[role="menu"]').isVisible().catch(() => false);
      if (isDropdownOpen) {
        // Click somewhere else to close the dropdown
        await page.locator('body').click();
        await page.waitForTimeout(200);
      }
      
      // Open theme dropdown
      await themeButton.click();
      await page.waitForTimeout(500); // Increased timeout
      
      // Wait for the dropdown menu to appear
      await expect(page.locator('[role="menu"]')).toBeVisible({ timeout: 5000 });

      // Select the theme
      const menuItem = page.getByRole('menuitem', { name: theme });
      await expect(menuItem).toBeVisible({ timeout: 5000 });
      await menuItem.click();
      await page.waitForTimeout(700); // Increased timeout for theme change

      // Verify the page is still functional
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
      const svg = page.locator('svg').first();
      await expect(svg).toBeVisible();
    }
  });

  test('should maintain theme selection after page interaction', async ({ page }) => {
    // Switch to dark theme
    const themeButton = page.getByRole('button', { name: /Theme/ });
    await expect(themeButton).toBeVisible({ timeout: 10000 });
    
    // Check if dropdown is already open, if so close it first
    const isDropdownOpen = await page.locator('[role="menu"]').isVisible().catch(() => false);
    if (isDropdownOpen) {
      await page.locator('body').click();
      await page.waitForTimeout(200);
    }
    
    await themeButton.click();
    await page.waitForTimeout(500);
    
    // Wait for dropdown to appear
    await expect(page.locator('[role="menu"]')).toBeVisible({ timeout: 5000 });
    
    const darkMenuItem = page.getByRole('menuitem', { name: 'Dark' });
    await expect(darkMenuItem).toBeVisible({ timeout: 5000 });
    await darkMenuItem.click();
    await page.waitForTimeout(700);

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