import { test, expect } from '@playwright/test';
import path from 'path';

test('Natural Language Query Flow - Multimodal', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Initialize Workspace
  await page.click('button:has-text("Initialize Workspace")');

  // 1. Upload optical scene
  const filePath = path.join(__dirname, '../../backend/dummy_multispectral.tif');
  await page.setInputFiles('input[type="file"]', filePath);
  
  await page.click('button:has-text("Extract Metadata")');
  await expect(page.locator('textarea[placeholder="Enter natural language query..."]')).toBeVisible({ timeout: 10000 });
  
  // 2. Unsupported Query
  await page.fill('textarea', 'Where are the buildings?');
  await page.click('button:has-text("Analyze")');
  await expect(page.locator('text=Insufficient Evidence')).toBeVisible({ timeout: 10000 });
  
  // 3. SAR Analysis on Optical Scene (Should be trapped by band validation)
  await page.fill('textarea', 'Analyze SAR response');
  await page.click('button:has-text("Analyze")');
  await expect(page.locator('text=Insufficient Evidence')).toBeVisible({ timeout: 10000 });
  
  // 4. Water Analysis Query
  await page.fill('textarea', 'Where is the water?');
  await page.click('button:has-text("Analyze")');
  
  await expect(page.locator('text=Export .tif')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('text=Based on NDWI computation')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('text=Evidence Statistics')).toBeVisible({ timeout: 30000 });
});
