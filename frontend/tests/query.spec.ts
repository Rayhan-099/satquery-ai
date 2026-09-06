import { test, expect } from '@playwright/test';
import path from 'path';

test('Natural Language Query Flow - Multimodal', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // 1. Upload optical scene
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('input[type="file"]').click({ force: true });
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, '../../backend/dummy_multispectral.tif'));
  
  await page.click('button:has-text("Extract Metadata")');
  await expect(page.locator('text=Query Interface')).toBeVisible({ timeout: 10000 });
  
  // 2. Unsupported Query
  await page.fill('textarea', 'Where are the buildings?');
  await page.click('button:has-text("Submit Query")');
  await expect(page.locator('text=Limitations / Refusals:')).toBeVisible({ timeout: 10000 });
  
  // 3. SAR Analysis on Optical Scene (Should be trapped by band validation)
  await page.fill('textarea', 'Analyze SAR response');
  await page.click('button:has-text("Submit Query")');
  await expect(page.locator('text=CLARIFICATION_REQUIRED')).toBeVisible({ timeout: 10000 });
  
  // 4. Water Analysis Query
  await page.fill('textarea', 'Where is the water?');
  await page.click('button:has-text("Submit Query")');
  
  await expect(page.locator('text=Grounded Response')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('text=Based on NDWI computation')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('text=Evidence Statistics')).toBeVisible({ timeout: 30000 });
  
});
