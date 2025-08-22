const { describe, test, expect, beforeEach, beforeAll, afterEach } = require("@playwright/test");
const { initUsers } = require("./initData");


beforeEach(async ({ page }) => {

	page.on("dialog", dialog => dialog.accept());

	await page.goto("/login");

	await expect(page).toHaveURL("/login");

	await page.getByTestId("login-username").getByRole("textbox").fill("safranek");
	await page.getByTestId("login-password").getByRole("textbox").fill("safranek123");
	await page.getByTestId("login-submit").click();

	await page.goto("/users");
	await expect(page).toHaveURL("/users");
});

test("Users are generated in right number and order", async ({ page }) => {

	const userlistLoc = page.getByTestId("userlist-root");

	const userLocs = await userlistLoc.getByTestId(".userlist-user").all();

	expect(userLocs).toHaveLength(initUsers.length);

	for (let i = 0; i < userLocs.length; i++) {

		console.log(initUsers[i]);

		await expect(userLocs[i]).toHaveText(RegExp(initUsers[i].name));
		await expect(userLocs[i]).toHaveText(RegExp(initUsers[i].username));
	}
});

test("User can be opened", async ({ page }) => {

	await page
		.getByTestId("userlist-root")
		.getByRole("link", { name: "@safranek" })
		.click();

	await expect(page).toHaveURL(/\/users\/.+/);
});

test("Unknown user throw 204", async ({ page }) => {

	await page.goto("/users/7243g23276d623");

	await expect(page.getByTestId("error-page")).toHaveText(/204/);
});