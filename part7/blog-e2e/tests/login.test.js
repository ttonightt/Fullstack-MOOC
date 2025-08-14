const { describe, test, expect, beforeEach, beforeAll } = require("@playwright/test");


const initUsers = [
	{
		username: "safranek",
		name: "Safranek",
		password: "safranek123"
	},
	{
		username: "teufel",
		name: "Fritz T.",
		password: "SAFRANEK!"
	},
	{
		username: "therealgatto",
		name: "Giovanni Gatto",
		password: "$yndiCATe"
	}
];


beforeAll("request", async ({ request }) => {

	await request.delete("/api/test/reset");

	for (const user of initUsers) {

		const issue = await request.post("/api/users", { data: user });
		console.log(issue);
		expect(issue.ok()).toBeTruthy();
	}
});

beforeEach(async ({ page }) => {

	await page.goto("http://localhost:5173/login");
});

test("NewPost section renders children when logged in", async ({ page }) => {

	await page.getByTestId("login-username").getByRole("textbox").fill("safranek");
	await page.getByTestId("login-password").getByRole("textbox").fill("safranek123");
	await page.getByTestId("login-submit").click();

	await expect(page.getByText("You logged in successfully!")).toBeVisible();
});