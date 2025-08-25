import { test, expect } from '@playwright/test';


test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring (update to your app's title)
  await expect(page).toHaveTitle(/quiz|react/i); // Adjust regex as needed for your app's title
});


// Optionally, update or remove the following test if not relevant to your app
