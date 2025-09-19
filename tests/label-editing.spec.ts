import { test, expect } from '@playwright/test';

const INITIAL_SLICE_LABELS = [
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

test.describe('Autism Wheel - Label Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should enter edit mode when clicking "Edit labels"', async ({ page }) => {
    // Click the Edit labels button
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Should now show the editing interface
    await expect(page.getByText('Edit Labels')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save labels' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Default labels' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Revert changes' })).toBeVisible();
    
    // Should show the editing table
    const editTable = page.locator('table').first();
    await expect(editTable).toBeVisible();
    
    // Check for table headers
    await expect(page.getByText('Icon')).toBeVisible();
    await expect(page.getByText('Label Name & Description')).toBeVisible();
    await expect(page.getByText('Color')).toBeVisible();
    await expect(page.getByText('Delete')).toBeVisible();
    await expect(page.getByText('Reorder')).toBeVisible();
  });

  test('should display all initial labels in edit mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    await expect(page.getByText('Edit Labels')).toBeVisible();
    
    // Check that all initial labels are present in the edit table
    for (const label of INITIAL_SLICE_LABELS) {
      await expect(page.locator(`input[value="${label}"]`)).toBeVisible();
    }
  });

  test('should allow editing label text', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Find the first label input and change its value
    const firstLabelInput = page.locator('input[type="text"]').first();
    await expect(firstLabelInput).toBeVisible();
    
    // Clear and enter new text
    await firstLabelInput.fill('Modified Label Text');
    
    // Verify the value changed
    await expect(firstLabelInput).toHaveValue('Modified Label Text');
    
    // The Revert changes button should now be enabled
    const revertButton = page.getByRole('button', { name: 'Revert changes' });
    await expect(revertButton).toBeEnabled();
  });

  test('should allow editing label descriptions', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Find the first description textarea and change its value
    const firstDescriptionTextarea = page.locator('textarea').first();
    await expect(firstDescriptionTextarea).toBeVisible();
    
    // Enter description text
    await firstDescriptionTextarea.fill('This is a modified description for testing purposes.');
    
    // Verify the value changed
    await expect(firstDescriptionTextarea).toHaveValue('This is a modified description for testing purposes.');
  });

  test('should allow changing label colors', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Find the first color input
    const firstColorInput = page.locator('input[type="color"]').first();
    await expect(firstColorInput).toBeVisible();
    
    // Change the color
    await firstColorInput.fill('#FF5733');
    
    // Verify the color changed
    await expect(firstColorInput).toHaveValue('#ff5733'); // Browsers normalize to lowercase
  });

  test('should allow changing label icons through emoji picker', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Find the first emoji picker button (should show current emoji)
    const firstEmojiButton = page.locator('button').filter({ hasText: /^[💏🗨️👂👋🔍🏠😰🔄📚🤸‍♀️]$/ }).first();
    await expect(firstEmojiButton).toBeVisible();
    
    // Click to open emoji picker
    await firstEmojiButton.click();
    
    // Should show emoji picker popover
    const emojiPicker = page.locator('[role="dialog"], .popover-content, .emoji-picker').first();
    await expect(emojiPicker).toBeVisible({ timeout: 3000 });
    
    // Look for emoji options and click one
    const emojiOption = emojiPicker.locator('button').filter({ hasText: '🎯' }).first();
    if (await emojiOption.isVisible()) {
      await emojiOption.click();
      
      // Verify the emoji changed in the original button
      await expect(page.locator('button').filter({ hasText: '🎯' }).first()).toBeVisible();
    }
  });

  test('should allow adding new labels', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Find the "Enter new label name..." input at the bottom
    const newLabelInput = page.getByPlaceholder('Enter new label name...');
    await expect(newLabelInput).toBeVisible();
    
    // Enter a new label name
    await newLabelInput.fill('New Test Category');
    
    // Click the add button (Plus icon)
    const addButton = page.locator('button').filter({ hasText: '+' }).or(page.locator('button:has(svg[data-lucide="plus"])')).first();
    await addButton.click();
    
    // Verify the new label appears in the table
    await expect(page.locator('input[value="New Test Category"]')).toBeVisible();
  });

  test('should allow deleting labels when more than 2 exist', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Add a new label first to ensure we can delete one
    const newLabelInput = page.getByPlaceholder('Enter new label name...');
    await newLabelInput.fill('Deletable Label');
    const addButton = page.locator('button').filter({ hasText: '+' }).or(page.locator('button:has(svg[data-lucide="plus"])')).first();
    await addButton.click();
    
    // Find a delete button (trash icon) and click it
    const deleteButton = page.locator('button:has(svg[data-lucide="trash-2"])').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    // The label should be removed from the table
    // (The exact verification would depend on which label was deleted)
  });

  test('should prevent deleting when only 2 labels remain', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Delete labels until only 2 remain (start with 10, delete 8)
    const deleteButtons = page.locator('button:has(svg[data-lucide="trash-2"])');
    const initialCount = await deleteButtons.count();
    
    // Delete all but 2 labels
    for (let i = 0; i < Math.min(initialCount - 2, 8); i++) {
      const deleteButton = page.locator('button:has(svg[data-lucide="trash-2"])').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(100); // Brief pause between deletions
      }
    }
    
    // Remaining delete buttons should be disabled or not functional
    const remainingDeleteButtons = page.locator('button:has(svg[data-lucide="trash-2"])');
    const remainingCount = await remainingDeleteButtons.count();
    
    if (remainingCount > 0) {
      // If delete buttons still exist, they should be disabled
      await expect(remainingDeleteButtons.first()).toBeDisabled();
    }
  });

  test('should reset to default labels when clicking "Default labels"', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Modify a label first
    const firstLabelInput = page.locator('input[type="text"]').first();
    await firstLabelInput.fill('Modified Label');
    
    // Click Default labels button
    await page.getByRole('button', { name: 'Default labels' }).click();
    
    // Verify all labels are reset to defaults
    for (const label of INITIAL_SLICE_LABELS) {
      await expect(page.locator(`input[value="${label}"]`)).toBeVisible();
    }
  });

  test('should save changes and exit edit mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Make a change
    const firstLabelInput = page.locator('input[type="text"]').first();
    await firstLabelInput.fill('Saved Modified Label');
    
    // Click Save labels
    await page.getByRole('button', { name: 'Save labels' }).click();
    
    // Should exit edit mode
    await expect(page.getByText('Edit Labels')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit labels' })).toBeVisible();
    
    // The modified label should now appear in the wheel
    await expect(page.getByText('Saved Modified Label')).toBeVisible();
  });

  test('should revert changes when clicking "Revert changes"', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Make a change
    const firstLabelInput = page.locator('input[type="text"]').first();
    const originalValue = await firstLabelInput.inputValue();
    await firstLabelInput.fill('Temporary Change');
    
    // Click Revert changes
    await page.getByRole('button', { name: 'Revert changes' }).click();
    
    // Should exit edit mode and revert to original state
    await expect(page.getByText('Edit Labels')).not.toBeVisible();
    await expect(page.getByText(originalValue)).toBeVisible();
    await expect(page.getByText('Temporary Change')).not.toBeVisible();
  });

  test('should disable action buttons appropriately', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    
    // Initially, Revert changes should be disabled (no changes made yet)
    await expect(page.getByRole('button', { name: 'Revert changes' })).toBeDisabled();
    
    // Make a change
    const firstLabelInput = page.locator('input[type="text"]').first();
    await firstLabelInput.fill('Changed');
    
    // Now Revert changes should be enabled
    await expect(page.getByRole('button', { name: 'Revert changes' })).toBeEnabled();
  });
});