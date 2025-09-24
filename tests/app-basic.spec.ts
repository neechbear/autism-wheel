import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Basic App Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should load the application with correct title and heading', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Autism Wheel');
    
    // Check main heading is visible
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should display basic UI elements', async ({ page }) => {
    // Check for presence of key UI elements
    await expect(page.getByText('Detailed Breakdown')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save diagram' })).toBeVisible();
  });

  test('should display the circular diagram', async ({ page }) => {
    // Check that the SVG diagram is present
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});
