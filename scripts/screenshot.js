#!/usr/bin/env node

const { chromium } = require('playwright');

async function takeScreenshot() {
  const url = process.argv[2];
  const output = process.argv[3];
  const view = process.argv[4]; // 'main-view', 'edit-view', or 'help-view'

  if (!url || !output || !view) {
    console.error('Usage: node screenshot.js <url> <output> <view>');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url);

    // Wait for the main content to load
    await page.waitForSelector('svg', { timeout: 15000 });
    console.log('Main content loaded');

    // Navigate to the specified view
    if (view === 'edit-view') {
      console.log('Clicking Edit categories button...');
      await page.getByRole('button', { name: 'Edit categories' }).click();
      await page.waitForSelector('text=Edit Categories', { timeout: 5000 });
      console.log('Edit categories view loaded');
    } else if (view === 'help-view') {
      console.log('Clicking Help button...');
      await page.getByRole('button', { name: 'Help', exact: true }).click();
      await page.waitForSelector('text=Help', { timeout: 5000 });
      console.log('Help view loaded');
    } else if (view === 'main-view') {
      console.log('Taking screenshot of main view');
    }

    // Take the screenshot
    console.log(`Taking screenshot: ${output}`);
    await page.screenshot({ path: output, fullPage: true });
    console.log('Screenshot saved successfully');

  } catch (error) {
    console.error('Error taking screenshot:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshot();