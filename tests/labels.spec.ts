import { test, expect } from '@playwright/test';

const INITIAL_SLICE_LABELS = [
  'Social Interaction',
  'Communication',
  'Sensory Processing',
  'Repetitive Behaviours and Special Interests',
  'Executive Functioning',
  'Emotional Regulation',
  'Cognitive and Learning Skills',
  'Motor Skills and Physical Development'
];

const INITIAL_SLICE_ICONS = [
  '💏',
  '🗨️',
  '👂',
  '♻️',
  '🏠',
  '😰',
  '📚',
  '🤸‍♀️'
];

const INITIAL_SLICE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
];

test.describe('Default labels button', () => {
  test.beforeEach(async ({ page }) => {
    // The test server serves the app at the root, so we navigate to the root.
    await page.goto('http://localhost:3000/');
    // Wait for the main heading to be visible before running any test.
    // This ensures the page and its initial React components have loaded.
    await expect(page.getByRole('heading', { name: 'Autism Wheel' })).toBeVisible({ timeout: 15000 });
  });

  test('should not be visible by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Default labels' })).not.toBeVisible();
  });

  test('should be visible after clicking "Edit labels"', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit labels' }).click();
    await expect(page.getByRole('button', { name: 'Default labels' })).toBeVisible();
  });

  test('should reset labels to default values', async ({ page }) => {
    // This test was previously flaky. It is now re-enabled with the more robust
    // loading check in beforeEach.

    await page.getByRole('button', { name: 'Edit labels' }).click();

    // Wait for the table to be visible
    await expect(page.locator('table')).toBeVisible();

    // Modify the first label
    const firstLabelInput = page.locator('input[type="text"]').first();
    await expect(firstLabelInput).toBeVisible();
    await firstLabelInput.fill('New Label Name');

    // Modify the first color
    const firstColorInput = page.locator('input[type="color"]').first();
    await firstColorInput.fill('#000000');

    // We can't easily change the icon with playwright, so we will check the icon is reset as well.

    // Click the "Default labels" button
    await page.getByRole('button', { name: 'Default labels' }).click();

    // Check that the labels are reset
    const labelInputs = await page.locator('input[type="text"]').all();
    for (let i = 0; i < labelInputs.length -1; i++) { // last one is the "add new"
      await expect(labelInputs[i]).toHaveValue(INITIAL_SLICE_LABELS[i]);
    }

    const colorInputs = await page.locator('input[type="color"]').all();
    for (let i = 0; i < colorInputs.length; i++) {
        await expect(colorInputs[i]).toHaveValue(INITIAL_SLICE_COLORS[i]);
    }

    const iconPickers = await page.locator('button > svg.lucide-smile').all();
    // This is a bit of a hack, but we check that the icon pickers are there.
    // The default icons are not easily accessible in the DOM.
     const emojiButtons = await page.locator('button.w-12.h-8').all();
    for (let i = 0; i < emojiButtons.length -1; i++) { // last one is the "add new"
        const emoji = await emojiButtons[i].textContent();
        expect(emoji).toBe(INITIAL_SLICE_ICONS[i]);
    }
  });
});
