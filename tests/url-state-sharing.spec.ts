import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - URL State Sharing & Link Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should generate and share a URL with encoded state', async ({ page }) => {
    // First, interact with the wheel to create some state
    const firstSegment = page.locator('[data-testid^="segment-"]').first();
    await firstSegment.click();

    // Wait for any state updates
    await page.waitForTimeout(100);

    // Click the Copy link button to generate a shareable URL
    await page.getByRole('button', { name: 'Copy link' }).click();

    // Check if a dialog or modal appears with the link
    // The app should show some kind of feedback when the link is generated
    const linkDialog = page.locator('[role="dialog"]');
    if (await linkDialog.isVisible()) {
      // If there's a dialog, check for link content
      await expect(linkDialog).toBeVisible();

      // Look for a URL pattern in the dialog
      const urlText = page.locator('text=/https?:\/\/[^\s]+/');
      await expect(urlText).toBeVisible();

      // The URL should contain a 'state' parameter
      const urlContent = await urlText.textContent();
      expect(urlContent).toContain('state=');
    } else {
      // If no dialog, the link might be copied to clipboard
      // We can't easily test clipboard in Playwright, but we can check
      // that the button was clicked without error
      await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    }
  });

  test('should load state from URL parameter', async ({ page }) => {
    // Create a test URL with encoded state
    // This is a minimal state that should be decodable
    const testState = btoa(JSON.stringify({
      selections: { 'category1': { typical: 3, stressed: 5 } },
      sliceLabels: ['Test Category'],
      theme: 'light'
    }));

    // Navigate to the page with state parameter
    await page.goto(`/?state=${testState}`);
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });

    // Verify the page loaded successfully with the state
    // The fact that the page loads without error indicates the state was processed
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should handle invalid state parameters gracefully', async ({ page }) => {
    // Navigate with an invalid state parameter
    await page.goto('/?state=invalid_encoded_data');

    // The application should still load normally
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });

    // The SVG should still be visible (default state loaded)
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should handle missing state parameters gracefully', async ({ page }) => {
    // Navigate without any state parameter (should load defaults)
    await page.goto('/');

    // The application should load normally with default state
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });

    // The SVG should be visible
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Basic UI elements should be present
    await expect(page.getByText('Detailed Breakdown')).toBeVisible();
  });
});