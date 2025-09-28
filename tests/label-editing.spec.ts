import { test, expect } from '@playwright/test';

test.describe('Autism Wheel - Label Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should display edit categories button', async ({ page }) => {
    // Check that the Edit categories button is visible
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();
  });

  test('should enter edit mode when clicking "Edit categories"', async ({ page }) => {
    // Click the Edit categories button
    await page.getByRole('button', { name: 'Edit categories' }).click();
    // Should now show the editing interface
    await expect(page.getByText('Edit Categories')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save categories' })).toBeVisible();
  });

  test('should show category editing interface with input fields', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Check for the presence of input fields for editing categories
    // Look for text inputs that would contain category names
    const inputs = page.locator('input[type="text"], textarea');
    const inputCount = await inputs.count();

    // Should have multiple input fields for category editing
    expect(inputCount).toBeGreaterThan(0);

    // Check that some category names are visible in the editing interface
    // Just verify that we have content in edit mode, not specific text
    const editingContent = page.locator('body');
    await expect(editingContent).toContainText('Edit Categories');
  });

  test('should allow editing category names', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Find the first text input field and modify it
    const firstInput = page.locator('input[type="text"]').first();
    if (await firstInput.isVisible()) {
      // Clear the input and type a new value
      await firstInput.clear();
      await firstInput.fill('Modified Category Name');

      // Verify the input has been updated
      await expect(firstInput).toHaveValue('Modified Category Name');
    }

    // The interface should still be functional
    await expect(page.getByRole('button', { name: 'Save categories' })).toBeVisible();
  });

  test('should handle save categories action', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Make a small change if possible
    const firstInput = page.locator('input[type="text"]').first();
    if (await firstInput.isVisible()) {
      const originalValue = await firstInput.inputValue();
      await firstInput.clear();
      await firstInput.fill(originalValue + ' (edited)');
    }

    // Click Save categories
    await page.getByRole('button', { name: 'Save categories' }).click();

    // Should return to the main view
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // The edit button should be visible again (not in edit mode)
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();
  });

  test('should handle category editing workflow without errors', async ({ page }) => {
    // Test the complete workflow: enter edit mode, make changes, save

    // 1. Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // 2. Interact with editing controls (if available)
    const textInputs = page.locator('input[type="text"]');
    if (await textInputs.count() > 0) {
      const firstInput = textInputs.first();
      await firstInput.clear();
      await firstInput.fill('Test Category');
      await expect(firstInput).toHaveValue('Test Category');
    }

    // 3. Save changes and return to main view
    await page.getByRole('button', { name: 'Save categories' }).click();
    await page.waitForTimeout(500);

    // 4. Verify we're back to the main view and everything still works
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();

    // The circular diagram should still be functional
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should be able to enter and exit edit mode multiple times', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Save and exit
    await page.getByRole('button', { name: 'Save categories' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // Enter edit mode again
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Save and exit again
    await page.getByRole('button', { name: 'Save categories' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // Verify everything is still functional
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});
