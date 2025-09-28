import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Tests', () => {
  // Use a higher timeout for all tests in this suite
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Start from the home page for each test
    await page.goto('/');
    // Wait for the main diagram to be visible before each test
    await expect(page.locator('svg[width="750"]')).toBeVisible({ timeout: 60000 });
  });

  test('should render the main view correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    await expect(page.locator('svg[width="750"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Detailed Breakdown' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit Categories' })).toBeVisible();
  });

  test('should allow navigating between views', async ({ page }) => {
    // Go to Help view
    await page.getByRole('button', { name: 'Help' }).click();
    await expect(page.getByRole('heading', { name: 'How to Use This Tool' })).toBeVisible();

    // Return to Main view
    await page.getByRole('button', { name: 'Return to app' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // Go to Edit Categories view
    await page.getByRole('button', { name: 'Edit Categories' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Categories' })).toBeVisible();

    // Return to Main view by saving
    await page.getByRole('button', { name: 'Save and Return' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should update the diagram and table when a segment is clicked', async ({ page }) => {
    // Get the first segment of the first slice
    const firstSegment = page.locator('path.segment').first();
    await firstSegment.click();

    // Check that the table has updated
    // We expect the first row's "Typical Impact" cell to now have content
    const typicalImpactCell = page.locator('tbody tr').first().locator('td').nth(1);
    await expect(typicalImpactCell.getByText('1')).toBeVisible();
    await expect(typicalImpactCell.getByText('Occasional Support Needs')).toBeVisible();
  });

  test('should allow editing a category', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Categories' }).click();

    const firstCategoryInput = page.locator('input[placeholder="Label name..."]').first();
    await firstCategoryInput.fill('Test Category Name');
    await expect(firstCategoryInput).toHaveValue('Test Category Name');

    await page.getByRole('button', { name: 'Save and Return' }).click();

    // Verify the change is reflected in the main view table
    await expect(page.getByText('Test Category Name')).toBeVisible();
  });

  test('should load state from a URL parameter', async ({ page }) => {
    const state = {
      "version": 1,
      "currentView": "main",
      "profile": {
        "selections": {
          "social": { "categoryId": "social", "typicalImpact": 5, "stressedImpact": 8 }
        }
      },
      "categories": [
        { "id": "social", "name": "Test Social", "description": "Desc", "icon": "A", "color": "#ff0000" }
      ],
      "settings": { "showNumbers": true, "showLabels": true, "showIcons": true, "theme": "light" }
    };
    const lzstring = await import('lz-string');
    const encodedState = lzstring.compressToBase64(JSON.stringify(state));

    await page.goto(`/?state=${encodedState}`);

    // Wait for the diagram to be ready
    await expect(page.locator('svg[width="750"]')).toBeVisible({ timeout: 60000 });

    // Check if the custom category name is visible
    await expect(page.getByText('Test Social')).toBeVisible();

    // Check if the selection from the state is visible in the table
    const typicalImpactCell = page.locator('tbody tr').first().locator('td').nth(1);
    await expect(typicalImpactCell.getByText('5')).toBeVisible();
  });
});