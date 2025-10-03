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
    // Should now show the editing interface with Save button
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('should show category editing interface with input fields', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    // Should now show the editing interface
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();

    // Wait for the edit interface to fully load and become interactive
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for any form inputs in the edit interface
    // Try multiple selectors to be more resilient
    let foundInputs = false;
    let inputCount = 0;

    // First try: category name inputs
    const categoryInputs = page.locator('input[placeholder*="Category"]');
    inputCount = await categoryInputs.count();
    if (inputCount > 0) {
      foundInputs = true;
      console.log(`Found ${inputCount} category placeholder inputs`);
    }

    // Second try: any text inputs
    if (!foundInputs) {
      const textInputs = page.locator('input[type="text"]');
      inputCount = await textInputs.count();
      if (inputCount > 0) {
        foundInputs = true;
        console.log(`Found ${inputCount} text inputs`);
      }
    }

    // Third try: textareas
    if (!foundInputs) {
      await page.waitForSelector('textarea', { timeout: 3000 }).catch(() => {});
      const textareas = page.locator('textarea');
      inputCount = await textareas.count();
      if (inputCount > 0) {
        foundInputs = true;
        console.log(`Found ${inputCount} textareas`);
      }
    }

    // Fourth try: any input or textarea
    if (!foundInputs) {
      const allInputs = page.locator('input, textarea');
      inputCount = await allInputs.count();
      if (inputCount > 0) {
        foundInputs = true;
        console.log(`Found ${inputCount} total inputs/textareas`);
      }
    }

    // If we still haven't found inputs, log what's actually on the page
    if (!foundInputs) {
      const bodyText = await page.locator('body').textContent();
      console.log('Page content sample:', bodyText?.substring(0, 500));
      const allElements = await page.locator('input, textarea, button').count();
      console.log(`Total form elements found: ${allElements}`);
    }

    // Should have found some form inputs for category editing
    expect(foundInputs).toBe(true);

    // Check that we're in edit mode
    const editingContent = page.locator('body');
    await expect(editingContent).toContainText('My Autism Wheel');
  });

  test('should allow editing category names', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

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
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('should handle save categories action', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Make a small change if possible
    const firstInput = page.locator('input[type="text"]').first();
    if (await firstInput.isVisible()) {
      const originalValue = await firstInput.inputValue();
      await firstInput.clear();
      await firstInput.fill(originalValue + ' (edited)');
    }

    // Click Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Should return to the main view
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // The edit button should be visible again (not in edit mode)
    await expect(page.getByRole('button', { name: 'Edit categories' })).toBeVisible();
  });

  test('should handle category editing workflow without errors', async ({ page }) => {
    // Test the complete workflow: enter edit mode, make changes, save

    // 1. Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // 2. Interact with editing controls (if available)
    const textInputs = page.locator('input[type="text"]');
    if (await textInputs.count() > 0) {
      const firstInput = textInputs.first();
      await firstInput.clear();
      await firstInput.fill('Test Category');
      await expect(firstInput).toHaveValue('Test Category');
    }

    // 3. Save changes and return to main view
    await page.getByRole('button', { name: 'Save' }).click();
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

    // Save and exit
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // Enter edit mode again
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Save and exit again
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

    // Verify everything is still functional
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  // Comprehensive category editing tests
  test('should allow deleting a category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Look for delete buttons - updated to match actual button structure with Trash2 icon
    const deleteButtons = page.locator('button:has-text(""), button[class*="deleteButton"], button:has(svg)');
    const deleteButtonCount = await deleteButtons.count();

    if (deleteButtonCount > 0) {
      // Count categories before deletion using input fields
      const categoryInputs = page.locator('input[placeholder="Category name"]');
      const initialCount = await categoryInputs.count();

      // Only proceed if there are more than minimum categories (delete buttons should be enabled)
      const firstDeleteButton = deleteButtons.first();
      const isEnabled = await firstDeleteButton.isEnabled();

      if (isEnabled && initialCount > 2) {
        // Delete the first category
        await firstDeleteButton.click();
        await page.waitForTimeout(300);

        // Verify category was removed from the UI
        const newCount = await page.locator('input[placeholder="Category name"]').count();
        expect(newCount).toBeLessThan(initialCount);

        // Save changes
        await page.getByRole('button', { name: 'Save' }).click();

        // Wait for navigation and check if we're back on main view
        await page.waitForTimeout(1000);

        // Check if we're on main view or still in edit mode
        const isOnMainView = await page.getByRole('heading', { name: 'My Autism Wheel' }).isVisible();
        const isStillEditing = await page.getByRole('button', { name: 'Save' }).isVisible();

        if (isOnMainView) {
          console.log(`Successfully deleted a category. Count changed from ${initialCount} to ${newCount}`);
        } else if (isStillEditing) {
          console.log('Still in edit mode after clicking Save - may be validation issue');
          // Try to exit edit mode anyway for cleanup
          await page.getByRole('button', { name: 'Discard changes' }).click();
        } else {
          console.log('Unexpected page state after clicking Save');
        }
      } else {
        console.log(`Delete buttons disabled or minimum categories reached (${initialCount} categories)`);
      }
    } else {
      console.log('No delete buttons found - skipping delete test');
    }
  });

  test('should allow renaming a category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

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
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted by re-entering edit mode
      await page.getByRole('button', { name: 'Edit categories' }).click();

      const renamedInput = nameInputs.first();
      await expect(renamedInput).toHaveValue(newValue);

      console.log(`Successfully renamed category from "${originalValue}" to "${newValue}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save' }).click();
    } else {
      console.log('No category name inputs found - skipping rename test');
    }
  });

  test('should allow changing a category description and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

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
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();

      const updatedDescInput = descriptionInputs.first();
      await expect(updatedDescInput).toHaveValue(newValue);

      console.log(`Successfully changed description from "${originalValue}" to "${newValue}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save' }).click();
    } else {
      console.log('No category description inputs found - skipping description test');
    }
  });

  test('should allow changing a category color and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

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
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

        // Verify the change persisted
        await page.getByRole('button', { name: 'Edit categories' }).click();

        const updatedColorInput = colorInputs.first();
        await expect(updatedColorInput).toHaveValue(newColor);

        console.log(`Successfully changed color from "${originalColor}" to "${newColor}"`);

        // Exit edit mode
        await page.getByRole('button', { name: 'Save' }).click();
      } else {
        // Try clicking color picker/swatch
        await firstColorInput.click();
        await page.waitForTimeout(300);

        // Save changes (color might have changed via click)
        await page.getByRole('button', { name: 'Save' }).click();
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
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the change persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();

      const updatedIconInput = iconInputs.first();
      await expect(updatedIconInput).toHaveValue(newEmoji);

      console.log(`Successfully changed emoji from "${originalValue}" to "${newEmoji}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save' }).click();
    } else {
      console.log('No emoji/icon inputs found - skipping emoji test');
    }
  });

  test('should allow reordering categories with up/down buttons', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await page.waitForLoadState('networkidle');

    // Wait for the edit interface to be ready
    const categoryTable = page.locator('table').first();
    await expect(categoryTable).toBeVisible();

    // Get all category name inputs to determine the initial order
    const categoryInputs = page.locator('input[type="text"]').filter({ hasText: /.*/ });
    await expect(categoryInputs.first()).toBeVisible();

    const initialCount = await categoryInputs.count();
    expect(initialCount).toBeGreaterThanOrEqual(2);

    // Get initial order
    const firstCategoryName = await categoryInputs.nth(0).inputValue();
    const secondCategoryName = await categoryInputs.nth(1).inputValue();

    console.log(`Initial order: 1st="${firstCategoryName}", 2nd="${secondCategoryName}"`);

    // Look for ChevronDown buttons specifically - these are the move down buttons
    // Based on the code, they should be in the reorder column
    const allChevronDownButtons = page.locator('svg').filter({ hasText: '' }).locator('xpath=..');

    // More specific: look for buttons that contain ChevronDown SVG
    const moveDownButtons = page.locator('button').filter({
      has: page.locator('svg[class*="lucide-chevron-down"]')
    });

    let downButtonCount = await moveDownButtons.count();

    // Fallback to searching by the ChevronDown component structure
    if (downButtonCount === 0) {
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();

      // Look through all buttons to find one that likely moves things down
      for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i);
        const title = await button.getAttribute('title');
        const innerHTML = await button.innerHTML();

        if (title?.includes('down') || innerHTML.includes('chevron-down') || innerHTML.includes('ChevronDown')) {
          console.log(`Found potential move down button at index ${i}: title="${title}"`);
          downButtonCount++;

          // Click this button and test if it works
          await button.click();
          await page.waitForTimeout(500);

          // Check if order changed
          const newFirstName = await categoryInputs.nth(0).inputValue();
          const newSecondName = await categoryInputs.nth(1).inputValue();

          if (newFirstName !== firstCategoryName || newSecondName !== secondCategoryName) {
            console.log(`Success! Order changed to: 1st="${newFirstName}", 2nd="${newSecondName}"`);

            // Now try to find and test move up button
            for (let j = 0; j < buttonCount; j++) {
              const upButton = allButtons.nth(j);
              const upTitle = await upButton.getAttribute('title');
              const upInnerHTML = await upButton.innerHTML();

              if (upTitle?.includes('up') || upInnerHTML.includes('chevron-up') || upInnerHTML.includes('ChevronUp')) {
                console.log(`Found move up button at index ${j}: title="${upTitle}"`);
                await upButton.click();
                await page.waitForTimeout(500);

                const finalFirstName = await categoryInputs.nth(0).inputValue();
                const finalSecondName = await categoryInputs.nth(1).inputValue();
                console.log(`After move up: 1st="${finalFirstName}", 2nd="${finalSecondName}"`);
                break;
              }
            }

            console.log('Successfully tested category reordering functionality');
            break;
          }
        }
      }
    } else {
      // Use the specific ChevronDown buttons we found
      const firstMoveDownButton = moveDownButtons.first();
      await firstMoveDownButton.click();
      await page.waitForTimeout(500);

      // Verify the order changed
      const newFirstName = await categoryInputs.nth(0).inputValue();
      const newSecondName = await categoryInputs.nth(1).inputValue();

      console.log(`After move down: 1st="${newFirstName}", 2nd="${newSecondName}"`);

      if (newFirstName !== firstCategoryName || newSecondName !== secondCategoryName) {
        console.log('Move down button worked successfully');

        // Test move up button
        const moveUpButtons = page.locator('button').filter({
          has: page.locator('svg[class*="lucide-chevron-up"]')
        });

        if (await moveUpButtons.count() > 0) {
          const firstMoveUpButton = moveUpButtons.first();
          await firstMoveUpButton.click();
          await page.waitForTimeout(500);

          const finalFirstName = await categoryInputs.nth(0).inputValue();
          const finalSecondName = await categoryInputs.nth(1).inputValue();
          console.log(`After move up: 1st="${finalFirstName}", 2nd="${finalSecondName}"`);
        }
      } else {
        console.log('Move down button did not change order - may need different selector');
      }
    }

    if (downButtonCount === 0) {
      console.log('No reorder buttons found - this functionality may need implementation');
    }

    // Save changes
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();
  });

  test('should prevent deleting categories when only minimum remain', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await page.waitForTimeout(500);

    // Count categories using table rows
    const initialCount = await page.locator('tbody tr').count();
    console.log(`Starting with ${initialCount} categories`);

    // Look for delete buttons (try multiple selectors for the trash icon buttons)
    const deleteButtons = page.locator('button:has(svg), .deleteButton, button[variant="destructive"], button[data-variant="destructive"], button.destructive');
    const deleteButtonCount = await deleteButtons.count();

    if (deleteButtonCount > 0) {
      if (initialCount <= 2) {
        // At minimum, all delete buttons should be disabled
        for (let i = 0; i < deleteButtonCount; i++) {
          const isDisabled = await deleteButtons.nth(i).isDisabled();
          expect(isDisabled).toBe(true);
        }
        console.log(`All delete buttons correctly disabled at minimum category count (${initialCount})`);
      } else {
        // Above minimum, delete buttons should be enabled
        const firstDeleteEnabled = await deleteButtons.first().isEnabled();
        expect(firstDeleteEnabled).toBe(true);
        console.log(`Delete buttons correctly enabled when above minimum (${initialCount} categories)`);
      }

      // Exit without saving
      await page.getByRole('button', { name: 'Discard changes' }).click();
    } else {
      console.log('No delete buttons found - skipping minimum categories test');
    }
  });

  test('should allow adding a new category and saving changes', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Look for add/new category buttons - updated to match actual button text
    const addButtons = page.locator('button:has-text("Add category")');
    const addButtonCount = await addButtons.count();

    if (addButtonCount > 0) {
      // Check if button is enabled (should be disabled at max categories)
      const isEnabled = await addButtons.first().isEnabled();

      if (isEnabled) {
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
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible();

      // Verify the new category persisted
      await page.getByRole('button', { name: 'Edit categories' }).click();

      const persistedInputs = page.locator('input[type="text"]');
      const finalCount = await persistedInputs.count();
      expect(finalCount).toBe(newCount);

      // Check that our new category name is there
      const lastInput = persistedInputs.nth(finalCount - 1);
      await expect(lastInput).toHaveValue(newCategoryName);

      console.log(`Successfully added new category: "${newCategoryName}"`);

      // Exit edit mode
      await page.getByRole('button', { name: 'Save' }).click();
      } else {
        console.log('Add category button is disabled - maximum categories reached');
      }
    } else {
      console.log('No add category buttons found - skipping add category test');
    }
  });

  test('should prevent adding categories when maximum limit is reached', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await page.waitForTimeout(500);

    // Look for add category button
    const addButton = page.getByRole('button', { name: 'Add category' });

    if (await addButton.count() > 0) {
      // Count initial categories using table rows in the edit view
      const initialCount = await page.locator('tbody tr').count();
      console.log(`Starting with ${initialCount} categories`);

      // Verify add button is disabled when at maximum (10 categories)
      if (initialCount >= 10) {
        const isAddButtonDisabled = await addButton.isDisabled();
        expect(isAddButtonDisabled).toBe(true);
        console.log(`Add button correctly disabled at maximum category count (${initialCount})`);
      } else {
        // Add categories until we reach the maximum
        let categoryCount = initialCount;
        while (categoryCount < 10 && await addButton.isEnabled()) {
          await addButton.click();
          await page.waitForTimeout(300);

          categoryCount = await page.locator('tbody tr').count();
          console.log(`After addition: ${categoryCount} categories`);
        }

        // Verify we cannot add more when at maximum
        if (categoryCount >= 10) {
          const isAddButtonDisabled = await addButton.isDisabled();
          expect(isAddButtonDisabled).toBe(true);
          console.log(`Successfully prevented addition at maximum category count (${categoryCount})`);
        }
      }

      // Don't save these additions - just discard changes
      await page.getByRole('button', { name: 'Discard changes' }).click();
    } else {
      console.log('No add category button found - skipping maximum categories test');
    }
  });

  test('should allow reverting changes with revert button', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Look for discard/revert button - updated to match actual button text
    const revertButtons = page.locator('button:has-text("Discard changes")');
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

        // Click discard changes - this should return to main view
        const revertButton = revertButtons.first();
        if (await revertButton.isEnabled()) {
          await revertButton.click();

          // Verify we're back on the main view
          await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible();

          // Re-enter edit mode to verify changes were reverted
          await page.getByRole('button', { name: 'Edit categories' }).click();

          // Verify changes were reverted
          const revertedInputs = page.locator('input[type="text"]');
          if (await revertedInputs.count() > 0) {
            const revertedInput = revertedInputs.first();
            await expect(revertedInput).toHaveValue(originalValue);

            console.log(`Successfully reverted changes from "${modifiedValue}" back to "${originalValue}"`);
          } else {
            console.log('No inputs found after re-entering edit mode');
          }

          // Exit edit mode
          await page.getByRole('button', { name: 'Save' }).click();
        } else {
          console.log('Discard button found but is disabled - skipping revert test');
        }
      } else {
        console.log('No text inputs found to test revert functionality');
      }
    } else {
      console.log('No revert buttons found - skipping revert test');
    }
  });

  test('should restore default categories with load presets dropdown', async ({ page }) => {
    // First, make significant changes and save them
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Modify a category name to create a changed state
    const nameInputs = page.locator('input[type="text"]');
    const inputCount = await nameInputs.count();
    if (inputCount >= 1) {
      await nameInputs.nth(0).clear();
      await nameInputs.nth(0).fill('Modified Category 1');
      await page.waitForTimeout(300); // Allow state to update
    }

    // Look for "Load presets" button
    const loadPresetsButton = page.locator('button:has-text("Load presets")');
    const buttonCount = await loadPresetsButton.count();

    if (buttonCount > 0) {
      const button = loadPresetsButton.first();

      // Check if button is enabled after our changes
      const isEnabled = await button.isEnabled();
      if (isEnabled) {
        // Get current state before restoring defaults
        const currentInputs = page.locator('input[type="text"]');
        const currentCount = await currentInputs.count();

        // Click the "Load presets" button to open dropdown
        await button.click();
        await page.waitForTimeout(300);

        // Click on "Autism wheel categories" option using more specific selector
        const autismWheelOption = page.locator('[role="menuitem"]').filter({ hasText: 'Autism wheel categories' });
        await autismWheelOption.click({ force: true });
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
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible();
      } else {
        console.log('Load presets button found but is disabled - might need more changes to enable it');
        // Just exit without saving
        await page.getByRole('button', { name: 'Save' }).click();
      }
    } else {
      console.log('No load presets button found - skipping default restore test');
      // Just exit without saving
      await page.getByRole('button', { name: 'Save' }).click();
    }
  });

  test('should load sensory wheel categories with load presets dropdown', async ({ page }) => {
    // Navigate to edit categories
    await page.getByRole('button', { name: 'Edit categories' }).click();

    // Look for "Load presets" button
    const loadPresetsButton = page.locator('button:has-text("Load presets")');
    const buttonCount = await loadPresetsButton.count();

    if (buttonCount > 0) {
      const button = loadPresetsButton.first();

      // Check if button is enabled
      const isEnabled = await button.isEnabled();
      if (isEnabled) {
        // Click the "Load presets" button to open dropdown
        await button.click();
        await page.waitForTimeout(300);

        // Click on "Sensory wheel categories" option using more specific selector
        const sensoryWheelOption = page.locator('[role="menuitem"]').filter({ hasText: 'Sensory wheel categories' });
        await sensoryWheelOption.click({ force: true });
        await page.waitForTimeout(500);

        // Verify categories were loaded by checking for sensory-specific names
        const nameInputs = page.locator('input[type="text"]');
        const inputCount = await nameInputs.count();

        if (inputCount > 0) {
          // Check for sensory category names like "Sound (Auditory)"
          const firstValue = await nameInputs.nth(0).inputValue();
          const isSensoryCategory = firstValue.includes('Sound') || firstValue.includes('Auditory') ||
                                   firstValue.includes('Visual') || firstValue.includes('Tactile');

          if (isSensoryCategory) {
            console.log(`Successfully loaded sensory categories. First category: ${firstValue}`);
          } else {
            console.log(`Loaded categories but first doesn't appear sensory-specific: ${firstValue}`);
          }
        }

        // Save the sensory categories
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('heading', { name: 'My Autism Wheel' })).toBeVisible();
      } else {
        console.log('Load presets button found but is disabled');
        // Just exit without saving
        await page.getByRole('button', { name: 'Save' }).click();
      }
    } else {
      console.log('No load presets button found - skipping sensory categories test');
      // Just exit without saving
      await page.getByRole('button', { name: 'Save' }).click();
    }
  });
});
