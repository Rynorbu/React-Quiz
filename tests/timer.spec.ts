import { test, expect } from "@playwright/test";

// TC006-TC007: Timer Tests
test.describe("Timer Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");
  });

  test("TC006: Timer Countdown", async ({ page }) => {
    // Start the quiz
    await page.click("text=Start Quiz");
    await page.waitForSelector('[data-testid="timer"]');

    // Verify timer starts at 30
    await expect(page.locator('[data-testid="timer"]')).toContainText("30");

    // Wait 2 seconds and verify countdown
    await page.waitForTimeout(2000);
    const timerText = await page.locator('[data-testid="timer"]').textContent();
    const currentTime = parseInt(timerText?.match(/\d+/)?.[0] || "0");

    // Should be around 28 seconds (allowing for some variance)
    expect(currentTime).toBeGreaterThanOrEqual(27);
    expect(currentTime).toBeLessThanOrEqual(29);

    // Wait another 3 seconds and verify continued countdown
    await page.waitForTimeout(3000);
    const newTimerText = await page
      .locator('[data-testid="timer"]')
      .textContent();
    const newCurrentTime = parseInt(newTimerText?.match(/\d+/)?.[0] || "0");

    // Should be around 25 seconds
    expect(newCurrentTime).toBeGreaterThanOrEqual(24);
    expect(newCurrentTime).toBeLessThanOrEqual(26);
    expect(newCurrentTime).toBeLessThan(currentTime);
  });

  test("TC007: Timer Expiry", async ({ page }) => {

  // Use a short timer for reliable testing
  await page.goto("http://localhost:5173/?timer=5");
  await page.waitForLoadState("networkidle");
  await page.click("text=Start Quiz");
  await page.waitForSelector('[data-testid="timer"]');


    // Wait for timer to reach 0 and quiz to end (game over state)
    await page.waitForFunction(
      () => {
        const gameOver = document.querySelector('[data-testid="game-over"]');
        return gameOver !== null;
      },
      { timeout: 40000 } // Allow up to 40s for slow environments
    );

    // Verify quiz ended automatically
    await expect(page.locator('[data-testid="game-over"]')).toBeVisible();

    // Verify final score is shown
    await expect(page.locator('[data-testid="final-score"]')).toBeVisible();
  });
});
