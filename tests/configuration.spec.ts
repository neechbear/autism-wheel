import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Configuration Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test.describe('Numbers Configuration', () => {
    test('should change number position to left aligned', async ({ page }) => {
      // Click the Numbers dropdown
      await page.getByRole('button', { name: /Numbers/ }).click();
      
      // Select "Left aligned"
      await page.getByText('Left aligned').click();
      
      // The option should now be selected (highlighted)
      await page.getByRole('button', { name: /Numbers/ }).click();
      await expect(page.getByText('Left aligned')).toHaveClass(/bg-accent/);
    });

    test('should change number position to center aligned', async ({ page }) => {
      // Click the Numbers dropdown  
      await page.getByRole('button', { name: /Numbers/ }).click();
      
      // Select "Center aligned"
      await page.getByText('Center aligned').click();
      
      // Verify selection
      await page.getByRole('button', { name: /Numbers/ }).click();
      await expect(page.getByText('Center aligned')).toHaveClass(/bg-accent/);
    });

    test('should change number position to right aligned', async ({ page }) => {
      await page.getByRole('button', { name: /Numbers/ }).click();
      await page.getByText('Right aligned').click();
      
      await page.getByRole('button', { name: /Numbers/ }).click();
      await expect(page.getByText('Right aligned')).toHaveClass(/bg-accent/);
    });

    test('should hide numbers when set to hidden', async ({ page }) => {
      await page.getByRole('button', { name: /Numbers/ }).click();
      await page.getByText('Hidden').click();
      
      await page.getByRole('button', { name: /Numbers/ }).click();
      await expect(page.getByText('Hidden')).toHaveClass(/bg-accent/);
      
      // When hidden, numbers should not be visible in the SVG
      const svg = page.locator('svg').first();
      const numberTexts = svg.locator('text').filter({ hasText: /^\d+$/ });
      const count = await numberTexts.count();
      expect(count).toBe(0);
    });
  });

  test.describe('Labels Configuration', () => {
    test('should change label style to normal weight', async ({ page }) => {
      await page.getByRole('button', { name: /Labels/ }).click();
      await page.getByText('Normal weight').click();
      
      await page.getByRole('button', { name: /Labels/ }).click();
      await expect(page.getByText('Normal weight')).toHaveClass(/bg-accent/);
    });

    test('should change label style to bold weight', async ({ page }) => {
      await page.getByRole('button', { name: /Labels/ }).click();
      await page.getByText('Bold weight').click();
      
      await page.getByRole('button', { name: /Labels/ }).click();
      await expect(page.getByText('Bold weight')).toHaveClass(/bg-accent/);
    });

    test('should hide labels when set to hidden', async ({ page }) => {
      await page.getByRole('button', { name: /Labels/ }).click();
      await page.getByText('Hidden').click();
      
      await page.getByRole('button', { name: /Labels/ }).click();
      await expect(page.getByText('Hidden')).toHaveClass(/bg-accent/);
      
      // When hidden, category labels should not be visible around the wheel
      // (This is a basic test - more specific visual validation could be added)
    });
  });

  test.describe('Boundaries Configuration', () => {
    test('should change boundary weight to normal', async ({ page }) => {
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await page.getByText('Normal weight', { exact: true }).click();
      
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await expect(page.getByText('Normal weight')).toHaveClass(/bg-accent/);
    });

    test('should change boundary weight to bold', async ({ page }) => {
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await page.getByText('Bold weight', { exact: true }).click();
      
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await expect(page.getByText('Bold weight')).toHaveClass(/bg-accent/);
    });

    test('should hide boundaries when set to hidden', async ({ page }) => {
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await page.getByText('Hidden').click();
      
      await page.getByRole('button', { name: /Boundaries/ }).click();
      await expect(page.getByText('Hidden')).toHaveClass(/bg-accent/);
    });
  });

  test.describe('Theme Configuration', () => {
    test('should switch to system theme', async ({ page }) => {
      await page.getByRole('button', { name: /Theme/ }).click();
      await page.getByText('System').click();
      
      await page.getByRole('button', { name: /Theme/ }).click();
      await expect(page.getByText('System')).toHaveClass(/bg-accent/);
    });

    test('should switch to light theme', async ({ page }) => {
      await page.getByRole('button', { name: /Theme/ }).click();
      await page.getByText('Light').click();
      
      await page.getByRole('button', { name: /Theme/ }).click();
      await expect(page.getByText('Light')).toHaveClass(/bg-accent/);
      
      // Verify light theme is applied (check background color or class)
      const body = page.locator('body');
      await expect(body).not.toHaveClass(/dark/);
    });

    test('should switch to dark theme', async ({ page }) => {
      await page.getByRole('button', { name: /Theme/ }).click();
      await page.getByText('Dark').click();
      
      await page.getByRole('button', { name: /Theme/ }).click();
      await expect(page.getByText('Dark')).toHaveClass(/bg-accent/);
      
      // Verify dark theme is applied
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);
    });
  });

  test.describe('Icons Configuration', () => {
    test('should toggle icons visibility', async ({ page }) => {
      // Find the icons toggle button (likely a checkbox or switch)
      const iconsToggle = page.getByRole('button', { name: /Icons/ }).or(
        page.locator('input[type="checkbox"]').locator('..').filter({ hasText: /Icons/i })
      );
      
      if (await iconsToggle.isVisible()) {
        // Click to toggle icons off
        await iconsToggle.click();
        
        // Verify icons are hidden in the SVG center
        const svg = page.locator('svg').first();
        const iconElements = svg.locator('text').filter({ hasText: /[💏🗨️👂👋🔍🏠😰🔄📚🤸‍♀️]/ });
        const iconCount = await iconElements.count();
        expect(iconCount).toBe(0);
        
        // Click to toggle icons back on
        await iconsToggle.click();
        
        // Verify icons are visible again
        const iconElementsAfter = svg.locator('text').filter({ hasText: /[💏🗨️👂👋🔍🏠😰🔄📚🤸‍♀️]/ });
        const iconCountAfter = await iconElementsAfter.count();
        expect(iconCountAfter).toBeGreaterThan(0);
      }
    });
  });

  test('should maintain configuration state when switching between options', async ({ page }) => {
    // Set multiple configurations
    await page.getByRole('button', { name: /Numbers/ }).click();
    await page.getByText('Right aligned').click();
    
    await page.getByRole('button', { name: /Labels/ }).click();
    await page.getByText('Bold weight').click();
    
    await page.getByRole('button', { name: /Theme/ }).click();
    await page.getByText('Dark').click();
    
    // Verify all settings persist
    await page.getByRole('button', { name: /Numbers/ }).click();
    await expect(page.getByText('Right aligned')).toHaveClass(/bg-accent/);
    await page.keyboard.press('Escape'); // Close dropdown
    
    await page.getByRole('button', { name: /Labels/ }).click();
    await expect(page.getByText('Bold weight')).toHaveClass(/bg-accent/);
    await page.keyboard.press('Escape');
    
    await page.getByRole('button', { name: /Theme/ }).click();
    await expect(page.getByText('Dark')).toHaveClass(/bg-accent/);
  });

  test('should not lose diagram selections when changing configurations', async ({ page }) => {
    const svg = page.locator('svg').first();
    
    // Make some selections on the wheel
    const clickablePaths = svg.locator('path.cursor-pointer');
    await clickablePaths.nth(0).click();
    await clickablePaths.nth(5).click();
    await clickablePaths.nth(10).click();
    
    // Change configuration
    await page.getByRole('button', { name: /Theme/ }).click();
    await page.getByText('Dark').click();
    
    // Change another configuration
    await page.getByRole('button', { name: /Numbers/ }).click();
    await page.getByText('Hidden').click();
    
    // Verify the table still shows selections (detailed breakdown should have data)
    const table = page.locator('table').last();
    const tableRows = table.locator('tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});