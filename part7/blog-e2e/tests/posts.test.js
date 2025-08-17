const { describe, test, expect, beforeEach, beforeAll, afterEach } = require("@playwright/test");


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
		expect(issue.ok()).toBeTruthy();
	}

	const res = await request.get("/api/users");
	const json = await res.json();

	console.log(json.map( ({posts, username }) => ({ username, posts: posts.length }) ));
});

beforeEach(async ({ page }) => {

	await page.goto("/login");
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