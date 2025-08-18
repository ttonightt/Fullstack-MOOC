const { describe, test, expect, beforeEach, beforeAll, afterEach } = require("@playwright/test");


beforeEach(async ({ page }) => {

	await page.goto("/");
});

test("NewPost section renders children when logged in", async ({ page }) => {

	await page.getByTestId("login-username").getByRole("textbox").fill("safranek");
	await page.getByTestId("login-password").getByRole("textbox").fill("safranek123");
	await page.getByTestId("login-submit").click();

	await expect(page.getByText("You logged in successfully!")).toBeVisible();
	await expect(page).toHaveURL("/posts");

	const usernameLoc = page.getByTestId("session-username");
	await expect(usernameLoc).toHaveText("@safranek");

	const newPostSectionLoc = page.getByTestId("newpost-root");
	await expect(newPostSectionLoc).toBeVisible();
});

afterEach(async ({ page }) => {

	await page.getByTestId("session-logout").click();

	const loginLoc = await page.getByTestId("session-login");
	await expect(loginLoc).toHaveText("Log In");
});