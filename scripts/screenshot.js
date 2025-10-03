#!/usr/bin/env node

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function takeScreenshot() {
  const url = process.argv[2];
  const outputDir = process.argv[3];
  const view = process.argv[4]; // 'main', 'edit', 'help', or 'samples'

  if (!url || !outputDir || !view) {
    console.error('Usage: node screenshot.js <url> <outputDir> <view>');
    console.error('  view options: main, edit, help, samples');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    acceptDownloads: true
  });
  const page = await context.newPage();

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    // Wait for the main content to load
    await page.waitForSelector('svg', { timeout: 15000 });
    console.log('Main content loaded');

    if (view === 'samples') {
      await generateSamples(page, outputDir);
    } else {
      // Navigate to the specified view
      if (view === 'edit') {
        console.log('Clicking Edit categories button...');
        await page.getByRole('button', { name: 'Edit categories' }).click();
        await page.waitForSelector('text=Category Name & Description', { timeout: 5000 });
        console.log('Edit categories view loaded');
      } else if (view === 'help') {
        console.log('Clicking Help button...');
        await page.getByRole('button', { name: 'Help', exact: true }).click();
        await page.waitForSelector('text=Help', { timeout: 5000 });
        console.log('Help view loaded');
      } else if (view === 'main') {
        console.log('Taking screenshot of main view');
      }

      // Construct the full output path
      const outputPath = path.join(outputDir, `${view}.png`);

      // Take the screenshot
      console.log(`Taking screenshot: ${outputPath}`);
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log('Screenshot saved successfully');
    }

  } catch (error) {
    console.error('Error taking screenshot:', error.message);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function generateSamples(page, outputDir) {
  console.log('Starting sample generation...');

  // Helper function to validate MIME type by checking file magic bytes
  function validateMimeType(filePath, expectedExtension) {
    try {
      const buffer = fs.readFileSync(filePath);
      const ext = expectedExtension.toLowerCase();

      // Check magic bytes for different file types
      switch (ext) {
        case 'png':
          if (buffer.length >= 8 &&
              buffer[0] === 0x89 && buffer[1] === 0x50 &&
              buffer[2] === 0x4E && buffer[3] === 0x47) {
            return { valid: true, actualType: 'image/png' };
          }
          break;
        case 'jpg':
        case 'jpeg':
          if (buffer.length >= 3 &&
              buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            return { valid: true, actualType: 'image/jpeg' };
          }
          break;
        case 'svg':
          const content = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
          if (content.includes('<svg') && content.includes('xmlns')) {
            return { valid: true, actualType: 'image/svg+xml' };
          }
          break;
        case 'html':
          const htmlContent = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
          if (htmlContent.includes('<!DOCTYPE html') || htmlContent.includes('<html')) {
            return { valid: true, actualType: 'text/html' };
          }
          break;
        default:
          return { valid: false, actualType: 'unknown', error: `Unknown extension: ${ext}` };
      }

      return { valid: false, actualType: 'unknown', error: `Invalid ${ext} file format` };
    } catch (error) {
      return { valid: false, actualType: 'error', error: error.message };
    }
  }

  // Helper function to wait for downloads
  async function waitForDownload(page, expectedFilename) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Download timeout')), 10000);

      const downloadHandler = async (download) => {
        clearTimeout(timeout);
        // Remove the event listener to prevent duplicate handling
        page.off('download', downloadHandler);

        const suggestedFilename = download.suggestedFilename();
        console.log(`Download started: ${suggestedFilename}`);

        const finalPath = path.join(outputDir, expectedFilename);
        await download.saveAs(finalPath);

        // Validate the MIME type of the downloaded file
        const extension = path.extname(expectedFilename).slice(1); // Remove the dot
        const validation = validateMimeType(finalPath, extension);

        if (validation.valid) {
          console.log(`Downloaded: ${finalPath} (${validation.actualType})`);
        } else {
          console.warn(`Downloaded: ${finalPath} - Warning: ${validation.error}`);
        }

        resolve(finalPath);
      };

      page.on('download', downloadHandler);
    });
  }

  // Helper function to set theme
  async function setTheme(page, theme) {
    console.log(`Setting theme to ${theme}...`);
    await page.getByRole('button', { name: 'Theme' }).click();
    await page.getByRole('menuitem', { name: theme }).click();
    await page.waitForTimeout(1000); // Wait for theme to apply
  }

  // Helper function to set numbers visibility
  async function setNumbersVisibility(page, visible) {
    console.log(`Setting numbers visibility to ${visible ? 'show' : 'hide'}...`);
    await page.getByRole('button', { name: 'Numbers' }).click();
    const option = visible ? 'Left aligned' : 'Hide segment numbers';
    await page.getByRole('menuitem', { name: option, exact: true }).click();
    await page.waitForTimeout(1000);
  }

  // Helper function to enter edit mode and load preset
  async function loadPreset(page, presetName) {
    console.log(`Loading preset: ${presetName}...`);
    await page.getByRole('button', { name: 'Edit categories' }).click();
    await page.waitForSelector('text=Category Name & Description', { timeout: 5000 });

    await page.getByRole('button', { name: 'Load presets' }).click();
    await page.getByRole('menuitem', { name: presetName }).click();
    await page.waitForTimeout(1500); // Wait for preset to load completely

    // Wait for the Save button to be enabled and click it
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();
    console.log('Clicked Save button');

    // Wait for automatic return to main view and diagram to load
    await page.waitForSelector('svg', { timeout: 8000 }); // Wait for diagram to load
    await page.waitForTimeout(1500); // Additional wait for full rendering
    console.log('Returned to main view');
  }

  // Helper function to set category values
  async function setCategoryValues(page, categoryValues) {
    console.log('Setting category values...');

    // Wait for the detailed breakdown table to be present
    try {
      await page.waitForSelector('table', { timeout: 5000 });
      console.log('Table found, proceeding with value setting...');
      await page.waitForTimeout(1000); // Wait for full rendering

    } catch (error) {
      console.log('Table not found:', error.message);
      return;
    }

    for (const [categoryName, values] of Object.entries(categoryValues)) {
      console.log(`Setting values for ${categoryName}: ${values.join(', ')}`);

      // Find the category row by name in the table
      const categoryRow = page.locator('tr').filter({ hasText: categoryName });
      const rowCount = await categoryRow.count();

      if (rowCount === 0) {
        console.log(`  Warning: Could not find row for category "${categoryName}"`);
        continue;
      }

      if (values.length >= 1 && values[0] > 0) {
        // Set typical impact (first value)
        console.log(`  Setting typical impact to ${values[0]}`);

        // Find the "+" button in the typical impact column (second column)
        const typicalCell = categoryRow.locator('td').nth(1);
        const plusButton = typicalCell.locator('text="+"').first();
        const plusCount = await plusButton.count();

        console.log(`  Found ${plusCount} plus buttons in typical column`);

        if (plusCount > 0) {
          console.log(`  Clicking plus button for typical impact`);
          await plusButton.click();
          await page.waitForTimeout(700);

          // Wait for input field and set value
          const input = page.locator('input[type="number"]').first();
          await input.waitFor({ timeout: 3000 });
          await input.fill(values[0].toString());
          await input.press('Enter');
          await page.waitForTimeout(700);
          console.log(`  Successfully set typical impact to ${values[0]}`);
        } else {
          // Maybe there's already a value we can click on
          const existingValue = typicalCell.locator('.clickableValue').first();
          const existingCount = await existingValue.count();
          if (existingCount > 0) {
            console.log(`  Clicking existing value for typical impact`);
            await existingValue.click();
            await page.waitForTimeout(700);
            const input = page.locator('input[type="number"]').first();
            await input.waitFor({ timeout: 3000 });
            await input.fill(values[0].toString());
            await input.press('Enter');
            await page.waitForTimeout(700);
            console.log(`  Successfully updated typical impact to ${values[0]}`);
          } else {
            console.log(`  Warning: No plus button or clickable value found for typical impact in "${categoryName}"`);
          }
        }
      }

      if (values.length >= 2 && values[1] > 0) {
        // Set stressed impact (second value)
        console.log(`  Setting stressed impact to ${values[1]}`);

        // Find the "+" button in the stressed impact column (third column)
        const stressedCell = categoryRow.locator('td').nth(2);
        const plusButton = stressedCell.locator('text="+"').first();
        const plusCount = await plusButton.count();

        console.log(`  Found ${plusCount} plus buttons in stressed column`);

        if (plusCount > 0) {
          console.log(`  Clicking plus button for stressed impact`);
          await plusButton.click();
          await page.waitForTimeout(700);

          // Wait for input field and set value
          const input = page.locator('input[type="number"]').first();
          await input.waitFor({ timeout: 3000 });
          await input.fill(values[1].toString());
          await input.press('Enter');
          await page.waitForTimeout(700);
          console.log(`  Successfully set stressed impact to ${values[1]}`);
        } else {
          // Maybe there's already a value we can click on
          const existingValue = stressedCell.locator('.clickableValue').first();
          const existingCount = await existingValue.count();
          if (existingCount > 0) {
            console.log(`  Clicking existing value for stressed impact`);
            await existingValue.click();
            await page.waitForTimeout(700);
            const input = page.locator('input[type="number"]').first();
            await input.waitFor({ timeout: 3000 });
            await input.fill(values[1].toString());
            await input.press('Enter');
            await page.waitForTimeout(700);
            console.log(`  Successfully updated stressed impact to ${values[1]}`);
          } else {
            console.log(`  Warning: No plus button or clickable value found for stressed impact in "${categoryName}"`);
          }
        }
      }
    }

    await page.waitForTimeout(1000);
  }

  // Helper function to save diagram in all formats
  async function saveAllFormats(page, prefix, theme, outputDir) {
    console.log(`Saving all formats for ${prefix}-${theme}...`);

    const formats = [
      { name: 'Save as PNG', ext: 'png' },
      { name: 'Save as JPEG', ext: 'jpg' },
      { name: 'Save as SVG', ext: 'svg' },
      { name: 'Save as HTML', ext: 'html' },
      { name: 'Save as locked HTML', ext: 'html', suffix: '-locked' }
    ];

    for (const format of formats) {
      const filename = `${prefix}-${theme}${format.suffix || ''}.${format.ext}`;

      await page.getByRole('button', { name: 'Save diagram' }).click();

      const downloadPromise = waitForDownload(page, filename);
      await page.getByRole('menuitem', { name: format.name }).click();

      try {
        await downloadPromise;
        console.log(`Saved: ${filename}`);
      } catch (error) {
        console.error(`Failed to save ${filename}:`, error.message);
      }

      await page.waitForTimeout(1000);
    }
  }

  // Helper function to clear all values
  async function clearAllValues(page) {
    console.log('Clearing all category values...');

    // Find all impact value elements and click to edit them, then set to 0
    const impactValues = page.locator('.clickableValue:not(.emptyValue)');
    const count = await impactValues.count();

    for (let i = 0; i < count; i++) {
      try {
        const valueElement = impactValues.nth(i);
        await valueElement.click({ timeout: 1000 });

        // Wait for input and clear it
        const input = page.locator('input[type="number"]').first();
        await input.waitFor({ timeout: 2000 });
        await input.fill('0');
        await input.press('Enter');
        await page.waitForTimeout(300);
      } catch (error) {
        console.log(`Skipping value ${i}: ${error.message}`);
      }
    }

    await page.waitForTimeout(1000);
  }

  try {
    // Step 1: Set initial theme and options
    await setTheme(page, 'Light');
    await setNumbersVisibility(page, false); // Hide segment numbers

    // Step 2: Load sensory wheel categories first (fewer categories)
    await loadPreset(page, 'Sensory wheel categories');

    // Temporarily show numbers so we can set values
    await setNumbersVisibility(page, true);

    const sensoryWheelValues = {
      'Sound (Auditory)': [4, 6],
      'Sight (Visual)': [4, 6],
      'Smell (Olfactory)': [2],
      'Touch (Tactile)': [2, 5],
      'Taste (Gustatory)': [1, 2],
      'Internal Sensations (Interoception)': [3, 5],
      'Balance (Vestibular)': [2]
      // 'Body Awareness (Proprioception)' has no values set
    };

    await setCategoryValues(page, sensoryWheelValues);

    // Hide numbers again for final output
    await setNumbersVisibility(page, false);

    // Step 3: Save sensory wheel light theme
    await saveAllFormats(page, 'sensory-wheel', 'light', outputDir);

    // Step 4: Save sensory wheel dark theme
    await setTheme(page, 'Dark');
    await saveAllFormats(page, 'sensory-wheel', 'dark', outputDir);

    // Step 5: Clear values and load autism wheel
    await clearAllValues(page);
    await loadPreset(page, 'Autism wheel categories');

    // Show numbers again to set values
    await setNumbersVisibility(page, true);

    const autismWheelValues = {
      'Social Interaction & Relationships': [3, 5],
      'Communication Differences': [2, 7],
      'Sensory Experiences': [3, 6],
      'Stimming & Self-Regulation': [2, 4],
      'Passionate Interests': [1, 3],
      'Executive Functioning': [3, 6],
      'Emotional Experiences & Regulation': [2, 7],
      'Need for Predictability & Routine': [2, 5],
      'Cognitive Profile & Learning Style': [1],
      'Motor Skills & Coordination': [2]
    };

    await setCategoryValues(page, autismWheelValues);

    // Hide numbers again for the final output
    await setNumbersVisibility(page, false);

    // Step 6: Save autism wheel light theme
    await setTheme(page, 'Light');
    await saveAllFormats(page, 'autism-wheel', 'light', outputDir);

    // Step 7: Save autism wheel dark theme
    await setTheme(page, 'Dark');
    await saveAllFormats(page, 'autism-wheel', 'dark', outputDir);

    console.log('Sample generation completed successfully!');

  } catch (error) {
    console.error('Error during sample generation:', error);
    throw error;
  }
}

takeScreenshot();