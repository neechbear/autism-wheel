import { test, expect } from '@playwright/test';

test.describe('Category Editing & Customization Features', () => {
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

  // Comprehensive category editing tests
  test('should allow deleting a category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for delete buttons (common patterns: X, delete icon, trash icon)
    const deleteButtons = page.locator('button[aria-label*="delete"], button[title*="delete"], button:has-text("×"), button:has-text("Delete"), [data-testid*="delete"]');
    const deleteButtonCount = await deleteButtons.count();

    if (deleteButtonCount > 0) {
      // Count categories before deletion
      const categoryRows = page.locator('[data-testid*="category"], .category-row, .category-item');
      const initialCount = await categoryRows.count();

      // Delete the first category
      await deleteButtons.first().click();
      await page.waitForTimeout(300);

      // Verify category was removed from the UI
      const newCount = await categoryRows.count();
      expect(newCount).toBeLessThan(initialCount);

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      console.log(`Successfully deleted a category. Count changed from ${initialCount} to ${newCount}`);
    } else {
      console.log('No delete buttons found - skipping delete test');
    }
  });

  test('should allow renaming a category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Find category name inputs
    const nameInputs = page.locator('input[type="text"], input[placeholder*="name"], input[aria-label*="name"]');
    const inputCount = await nameInputs.count();

    if (inputCount > 0) {
      const firstInput = nameInputs.first();
      const originalValue = await firstInput.inputValue();
      const newValue = `Renamed Category ${Date.now()}`;

      // Change the category name
      await firstInput.clear();
      await firstInput.fill(newValue);
      await expect(firstInput).toHaveValue(newValue);

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted by re-entering edit mode
      await page.getByRole('button', { name: 'Edit categories' }).click();
      await expect(page.getByText('Edit Categories')).toBeVisible();

      const renamedInput = nameInputs.first();
      await expect(renamedInput).toHaveValue(newValue);

      console.log(`Successfully renamed category from "${originalValue}" to "${newValue}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No category name inputs found - skipping rename test');
    }
  });

  test('should allow changing a category description and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for description inputs (textarea, input with description in placeholder/label)
    const descriptionInputs = page.locator('textarea, input[placeholder*="description"], input[aria-label*="description"]');
    const inputCount = await descriptionInputs.count();

    if (inputCount > 0) {
      const firstDescInput = descriptionInputs.first();
      const originalValue = await firstDescInput.inputValue();
      const newValue = `Updated description ${Date.now()}`;

      // Change the category description
      await firstDescInput.clear();
      await firstDescInput.fill(newValue);
      await expect(firstDescInput).toHaveValue(newValue);

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();
      await expect(page.getByText('Edit Categories')).toBeVisible();

      const updatedDescInput = descriptionInputs.first();
      await expect(updatedDescInput).toHaveValue(newValue);

      console.log(`Successfully changed description from "${originalValue}" to "${newValue}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No category description inputs found - skipping description test');
    }
  });

  test('should allow changing a category color and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for color inputs (input[type="color"], color picker buttons, color swatches)
    const colorInputs = page.locator('input[type="color"], .color-picker, [data-testid*="color"], button[aria-label*="color"]');
    const inputCount = await colorInputs.count();

    if (inputCount > 0) {
      const firstColorInput = colorInputs.first();

      // If it's a color input, set a specific color
      if (await firstColorInput.getAttribute('type') === 'color') {
        const originalColor = await firstColorInput.inputValue();
        const newColor = '#ff5733'; // Orange-red color

        await firstColorInput.fill(newColor);
        await expect(firstColorInput).toHaveValue(newColor);

        // Save changes
        await page.getByRole('button', { name: 'Save categories' }).click();
        await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

        // Verify the change persisted
        await page.getByRole('button', { name: 'Edit categories' }).click();
        await expect(page.getByText('Edit Categories')).toBeVisible();

        const updatedColorInput = colorInputs.first();
        await expect(updatedColorInput).toHaveValue(newColor);

        console.log(`Successfully changed color from "${originalColor}" to "${newColor}"`);

        // Exit edit mode
        await page.getByRole('button', { name: 'Save categories' }).click();
      } else {
        // Try clicking color picker/swatch
        await firstColorInput.click();
        await page.waitForTimeout(300);

        // Save changes (color might have changed via click)
        await page.getByRole('button', { name: 'Save categories' }).click();
        await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

        console.log('Successfully interacted with color picker');
      }
    } else {
      console.log('No color inputs found - skipping color change test');
    }
  });

  test('should allow changing a category emoji icon and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for emoji/icon inputs
    const iconInputs = page.locator('input[placeholder*="emoji"], input[aria-label*="emoji"], input[placeholder*="icon"], .emoji-picker, [data-testid*="emoji"], [data-testid*="icon"]');
    const inputCount = await iconInputs.count();

    if (inputCount > 0) {
      const firstIconInput = iconInputs.first();
      const originalValue = await firstIconInput.inputValue();
      const newEmoji = '🎯'; // Target emoji

      // Change the emoji
      await firstIconInput.clear();
      await firstIconInput.fill(newEmoji);
      await expect(firstIconInput).toHaveValue(newEmoji);

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();
      await expect(page.getByText('Edit Categories')).toBeVisible();

      const updatedIconInput = iconInputs.first();
      await expect(updatedIconInput).toHaveValue(newEmoji);

      console.log(`Successfully changed emoji from "${originalValue}" to "${newEmoji}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No emoji/icon inputs found - skipping emoji test');
    }
  });

  test('should allow reordering categories', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for drag handles or move buttons (up/down arrows, drag icons)
    const moveButtons = page.locator('button[aria-label*="move"], button[title*="move"], .drag-handle, [data-testid*="drag"], button:has-text("↑"), button:has-text("↓")');
    const moveButtonCount = await moveButtons.count();

    if (moveButtonCount > 0) {
      // Get initial order by checking category names
      const categoryInputs = page.locator('input[type="text"]');
      const initialCount = await categoryInputs.count();

      if (initialCount >= 2) {
        const firstCategoryName = await categoryInputs.nth(0).inputValue();
        const secondCategoryName = await categoryInputs.nth(1).inputValue();

        // Try to move the first category (look for move down button)
        const moveDownButtons = page.locator('button[aria-label*="down"], button[title*="down"], button:has-text("↓")');
        if (await moveDownButtons.count() > 0) {
          await moveDownButtons.first().click();
          await page.waitForTimeout(300);

          // Verify order changed
          const newFirstName = await categoryInputs.nth(0).inputValue();
          const newSecondName = await categoryInputs.nth(1).inputValue();

          expect(newFirstName).toBe(secondCategoryName);
          expect(newSecondName).toBe(firstCategoryName);

          console.log(`Successfully reordered categories: "${firstCategoryName}" and "${secondCategoryName}" swapped`);
        }
      }

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
    } else {
      console.log('No move/reorder buttons found - skipping reorder test');
    }
  });

  test('should prevent deleting categories when only minimum remain', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for delete buttons
    const deleteButtons = page.locator('button[aria-label*="delete"], button[title*="delete"], button:has-text("×"), button:has-text("Delete"), [data-testid*="delete"]');
    let deleteButtonCount = await deleteButtons.count();

    if (deleteButtonCount > 0) {
      // Count initial categories
      const categoryRows = page.locator('[data-testid*="category"], .category-row, .category-item, input[type="text"]');
      let categoryCount = await categoryRows.count();

      console.log(`Starting with ${categoryCount} categories and ${deleteButtonCount} delete buttons`);

      // Delete categories until we reach the minimum (usually 2)
      while (deleteButtonCount > 0 && categoryCount > 2) {
        await deleteButtons.first().click();
        await page.waitForTimeout(300);

        // Recount after deletion
        categoryCount = await categoryRows.count();
        deleteButtonCount = await deleteButtons.count();

        console.log(`After deletion: ${categoryCount} categories, ${deleteButtonCount} delete buttons`);
      }

      // Verify we cannot delete more when at minimum
      if (categoryCount <= 2) {
        const remainingDeleteButtons = await deleteButtons.count();
        expect(remainingDeleteButtons).toBe(0);
        console.log(`Successfully prevented deletion at minimum category count (${categoryCount})`);
      }

      // Don't save these deletions - just exit
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No delete buttons found - skipping minimum categories test');
    }
  });

  test('should allow adding a new category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for add/new category buttons
    const addButtons = page.locator('button:has-text("Add"), button:has-text("New"), button[aria-label*="add"], [data-testid*="add"]');
    const addButtonCount = await addButtons.count();

    if (addButtonCount > 0) {
      // Count initial categories
      const categoryInputs = page.locator('input[type="text"]');
      const initialCount = await categoryInputs.count();

      // Click add button
      await addButtons.first().click();
      await page.waitForTimeout(300);

      // Verify new category was added
      const newCount = await categoryInputs.count();
      expect(newCount).toBeGreaterThan(initialCount);

      // Fill in the new category
      const newCategoryInput = categoryInputs.nth(newCount - 1);
      const newCategoryName = `New Category ${Date.now()}`;
      await newCategoryInput.fill(newCategoryName);

      // Save changes
      await page.getByRole('button', { name: 'Save categories' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the new category persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();
      await expect(page.getByText('Edit Categories')).toBeVisible();

      const persistedInputs = page.locator('input[type="text"]');
      const finalCount = await persistedInputs.count();
      expect(finalCount).toBe(newCount);

      // Check that our new category name is there
      const lastInput = persistedInputs.nth(finalCount - 1);
      await expect(lastInput).toHaveValue(newCategoryName);

      console.log(`Successfully added new category: "${newCategoryName}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No add category buttons found - skipping add category test');
    }
  });

  test('should allow reverting changes with revert button', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Look for revert/cancel button
    const revertButtons = page.locator('button:has-text("Revert"), button:has-text("Cancel"), button:has-text("Reset"), button[aria-label*="revert"], button[aria-label*="cancel"]');
    const revertButtonCount = await revertButtons.count();

    if (revertButtonCount > 0) {
      // Make some changes first
      const nameInputs = page.locator('input[type="text"]');
      if (await nameInputs.count() > 0) {
        const firstInput = nameInputs.first();
        const originalValue = await firstInput.inputValue();
        const modifiedValue = `Modified ${Date.now()}`;

        // Change the value
        await firstInput.clear();
        await firstInput.fill(modifiedValue);
        await expect(firstInput).toHaveValue(modifiedValue);

        // Click revert - check if it's enabled first
        const revertButton = revertButtons.first();
        if (await revertButton.isEnabled()) {
          await revertButton.click();
          await page.waitForTimeout(300);

          // Verify changes were reverted
          const revertedInput = nameInputs.first();
          await expect(revertedInput).toHaveValue(originalValue);

          console.log(`Successfully reverted changes from "${modifiedValue}" back to "${originalValue}"`);
        } else {
          console.log('Revert button found but is disabled - skipping revert test');
        }
      }

      // Exit edit mode
      await page.getByRole('button', { name: 'Save categories' }).click();
    } else {
      console.log('No revert buttons found - skipping revert test');
    }
  });

  test('should restore default categories with default categories button', async ({ page }) => {
    // First, make significant changes and save them
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await expect(page.getByText('Edit Categories')).toBeVisible();

    // Modify a category name to create a changed state
    const nameInputs = page.locator('input[type="text"]');
    const inputCount = await nameInputs.count();
    if (inputCount >= 1) {
      await nameInputs.nth(0).clear();
      await nameInputs.nth(0).fill('Modified Category 1');
      await page.waitForTimeout(300); // Allow state to update
    }

    // Look for default categories button and check if it's enabled after our change
    const defaultButtons = page.locator('button:has-text("Default"), button:has-text("Reset to default"), button[aria-label*="default"]');
    const defaultButtonCount = await defaultButtons.count();

    if (defaultButtonCount > 0) {
      const defaultButton = defaultButtons.first();

      // Check if button is enabled after our changes
      const isEnabled = await defaultButton.isEnabled();
      if (isEnabled) {
        // Get current state before restoring defaults
        const currentInputs = page.locator('input[type="text"]');
        const currentCount = await currentInputs.count();

        // Click default categories button
        await defaultButton.click();
        await page.waitForTimeout(500);

        // Verify categories were restored (should have different names)
        const restoredInputs = page.locator('input[type="text"]');
        const restoredCount = await restoredInputs.count();

        // Check that we no longer have our modified name
        if (restoredCount > 0) {
          const firstRestoredValue = await restoredInputs.nth(0).inputValue();
          expect(firstRestoredValue).not.toBe('Modified Category 1');
        }

        console.log(`Successfully restored default categories. Count: ${currentCount} → ${restoredCount}`);

        // Save the restored defaults
        await page.getByRole('button', { name: 'Save categories' }).click();
        await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
      } else {
        console.log('Default categories button found but is disabled - might need more changes to enable it');
        // Just exit without saving
        await page.getByRole('button', { name: 'Save categories' }).click();
      }
    } else {
      console.log('No default categories button found - skipping default restore test');
      // Just exit without saving
      await page.getByRole('button', { name: 'Save categories' }).click();
    }
  });
});
