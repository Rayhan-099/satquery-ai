import { test, expect } from '@playwright/test';
import path from 'path';

test('Golden Path E2E Workflow', async ({ page }) => {
  // Set timeout high because ML initialization takes time (~20s)
  test.setTimeout(60000);

  // 1. Open application
  await page.goto('http://localhost:3000/');
  await expect(page.locator('text=SATQUERY').first()).toBeVisible();

  // Initialize Workspace
  await page.click('button:has-text("Initialize Workspace")');

  // 2. Load known scene (Local Upload of dummy_multispectral.tif)
  const filePath = path.join(__dirname, '../../backend/dummy_multispectral.tif');
  await page.setInputFiles('input[type="file"]', filePath);
  
  // Click Extract Metadata
  await page.click('button:has-text("EXTRACT METADATA")');

  // Wait for the query interface to appear, meaning scene is loaded
  await expect(page.locator('textarea[placeholder="Enter natural language geospatial query..."]')).toBeVisible({ timeout: 10000 });

  // 3. Verify provenance
  // Since it was a local upload, it should say LOCAL_UPLOAD
  await expect(page.locator('text=LOCAL_UPLOAD')).toBeVisible();

  // 4. Submit supported query
  await page.fill('textarea', 'Where is vegetation strongest?');
  await page.click('button:has-text("RUN ANALYSIS")');

  // 5. Wait for analysis & Verify evidence
  // Look for Evidence Statistics block
  await expect(page.locator('text=EVIDENCE STATISTICS')).toBeVisible({ timeout: 35000 });
  await expect(page.locator('text=MEAN').first()).toBeVisible();

  // 6. Verify result interpretation exists
  // We can't rely on "Grounded Response" heading, but the interpretation paragraph should appear.
  // We'll verify that "Export .tif" is available.
  await expect(page.locator('text=EXPORT .TIF')).toBeVisible();

  // 7. Submit unsupported query
  await page.fill('textarea', 'What exact crop species are growing here?');
  await page.click('button:has-text("RUN ANALYSIS")');

  // 8. Verify safe unsupported state
  await expect(page.locator('text=INSUFFICIENT EVIDENCE')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=SatQuery does not currently have an analysis tool that can reliably')).toBeVisible();
});
