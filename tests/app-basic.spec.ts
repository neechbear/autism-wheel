import { test, expect } from '@playwright/test';

test.describe('Application Loading & Core UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should load the application with correct title and heading', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('My Autism Wheel');

    // Check main heading is visible
    await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible();
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

  test('should navigate to help view when help button is clicked', async ({ page }) => {
    // Click the Help button (use exact match to avoid conflict with "the help button" text)
    await page.getByRole('button', { name: 'Help', exact: true }).click();

    // Wait for help view to load and check for the help heading
    await expect(page.getByRole('heading', { name: 'How to Use This Tool' })).toBeVisible();

    // Check for some expected help content
    await expect(page.getByText('To get started, watch this short video guide')).toBeVisible();

    // Verify we can return to main view using the Return to app button
    await page.getByRole('button', { name: 'Return to app' }).first().click();
    await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible();
  });
});
