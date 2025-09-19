import { test, expect } from '@playwright/test';

// Expected initial slice labels for verification
const EXPECTED_INITIAL_LABELS = [
  'Social Interaction & Relationships',
  'Communication Differences', 
  'Sensory Experiences',
  'Stimming & Self-Regulation',
  'Passionate Interests',
  'Executive Functioning',
  'Emotional Experiences & Regulation',
  'Need for Predictability & Routine',
  'Cognitive Profile & Learning Style',
  'Motor Skills & Coordination'
];

test.describe('Autism Wheel - Basic App Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the main heading to ensure the app has loaded
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should load the application with correct title and heading', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Autism Wheel');
    
    // Check main heading is visible
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should display the circular diagram SVG', async ({ page }) => {
    // Check that the main SVG element is present
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    
    // Verify SVG has the expected dimensions (750x750 based on code)
    await expect(svg).toHaveAttribute('width', '750');
    await expect(svg).toHaveAttribute('height', '750');
  });

  test('should display all initial category labels', async ({ page }) => {
    // Wait for labels to be rendered
    await page.waitForTimeout(1000);
    
    // Check that all expected labels are present in the page content
    for (const label of EXPECTED_INITIAL_LABELS) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test('should show the detailed breakdown table', async ({ page }) => {
    // Check that the detailed breakdown section is present
    await expect(page.getByText('Detailed Breakdown')).toBeVisible();
    
    // Check that the table exists
    const table = page.locator('table').last(); // Get the breakdown table (not the edit table)
    await expect(table).toBeVisible();
    
    // Check for expected table headers
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Typical Impact')).toBeVisible();
    await expect(page.getByText('During Stress')).toBeVisible();
  });

  test('should display action buttons in default state', async ({ page }) => {
    // Check for main action buttons
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit labels' })).toBeVisible();
    
    // Check for dropdown button with save options
    await expect(page.getByRole('button', { name: 'Save diagram' })).toBeVisible();
  });

  test('should display configuration dropdowns', async ({ page }) => {
    // Check for settings dropdowns
    await expect(page.getByRole('button', { name: /Numbers/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Labels/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Boundaries/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Theme/ })).toBeVisible();
  });

  test('should not show edit interface by default', async ({ page }) => {
    // Default labels button should not be visible initially
    await expect(page.getByRole('button', { name: 'Default labels' })).not.toBeVisible();
    
    // Save labels button should not be visible initially  
    await expect(page.getByRole('button', { name: 'Save labels' })).not.toBeVisible();
    
    // Edit labels table should not be visible
    await expect(page.getByText('Edit Labels')).not.toBeVisible();
  });

  test('should have proper page structure and layout', async ({ page }) => {
    // Check for main container structure
    const mainContainer = page.locator('div.flex.flex-col.items-center.gap-8.p-8');
    await expect(mainContainer).toBeVisible();
    
    // Check for introductory text about the wheel
    await expect(page.getByText(/Hello! Thank you for using/)).toBeVisible();
    await expect(page.getByText(/YouTube channel/)).toBeVisible();
  });
});