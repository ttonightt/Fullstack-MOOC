const { describe, test, expect, beforeEach, beforeAll, afterEach } = require("@playwright/test");

test("Unknown endpoint throw 404", async ({ page }) => {

	await page.goto("/post");

	await expect(page.getByTestId("error-page")).toHaveText(/404/);
});