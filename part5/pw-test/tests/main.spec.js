const { test, expect, describe, beforeEach } = require("@playwright/test");

const toLogin = async (page, username, password) => {

	const usernameLoc = page.getByRole("textbox", {name: "username"});
	const passwordLoc = page.getByRole("textbox", {name: "password"});

	await usernameLoc.fill(username);
	await passwordLoc.fill(password);

	await page.getByRole("button", {name: "Login"}).click();
};

const toCreatePost = async (page, title, author, url) => {

	await page.getByRole("button", {name: "New Post"}).click();

	const titleLoc = page.getByTestId("postform-title");
	const authorLoc = page.getByTestId("postform-author");
	const urlLoc = page.getByTestId("postform-url");

	await titleLoc.fill(title);
	await authorLoc.fill(author);
	await urlLoc.fill(url);

	await page.getByRole("button", {name: "Save"}).click();
};

const toShow = async (page, title) => {

	const showButtonLoc = page
		.getByRole("table")
		.getByText(title)
		.locator("..")
		.getByRole("button", {name: "Show"});

	await showButtonLoc.click();
};

const toLike = async (page, title) => {

	const likeButtonLoc = page
		.getByRole("table")
		.getByText(title)
		.locator("..")
		.getByTestId("like-button");

	await likeButtonLoc.click();

	const likesLoc = page
		.getByRole("table")
		.getByText(title)
		.locator("..")
		.getByTestId("likes");

	await likesLoc.waitFor();

	return await likesLoc.innerText();
};

describe("Tests", () => {

	beforeEach(async ({ page, request }) => {

		await request.post("/api/reset");
		await request.post("/api/users", {

			data: {
				name: "Hello Kitty",
				username: "hello-kitty",
				password: "Bye-bye k!tty"
			}
		});
		await request.post("/api/users", {

			data: {
				name: "Gummy Bear",
				username: "gummy-bear",
				password: "gummy-bear"
			}
		});

		await page.goto("/");
	});

	test("Login form opens", async ({ page }) => {

		const loc = page.getByRole("heading", {name: "Login"});

		await expect(loc).toBeVisible();
	});

	describe("Login tests", () => {

		test("User login passes", async ({ page }) => {

			await toLogin(page, "hello-kitty", "Bye-bye k!tty");

			await expect(page.getByText("Hello Kitty")).toBeVisible();
		});

		test("User login fails", async ({ page }) => {

			await toLogin(page, "hello kitty", "nnn");

			await expect(page.getByText("Hello Kitty")).not.toBeVisible();
		});
	});

	describe("After successful login:", () => {

		beforeEach(async ({ page }) => {

			await toLogin(page, "gummy-bear", "gummy-bear");

			await toCreatePost(page, "Bear's post", "gummy-bear", "...");

			await page.getByRole("button", {name: "Log out"}).click();

			await toLogin(page, "hello-kitty", "Bye-bye k!tty");

			await toCreatePost(page, "Kitty's post", "hello-kitty", "...");
		});

		test("Logged user can create a new post", async ({ page }) => {

			await toCreatePost(page, "Post #0", "ttonightt", "example.com");

			await expect(page.getByRole("table").getByText("Post #0")).toBeVisible();
		});

		test("Logged user can like a post", async ({ page }) => {

			const likes = await toLike(page, "Kitty's post");

			expect(likes).toBe("1");
		});

		test("Logged user can delete a post", async ({ page }) => {

			await toShow(page, "Kitty's post");

			const deleteButtonLoc = page
				.getByRole("table")
				.getByRole("button", {name: "Delete"});

			page.on("dialog", dialog => dialog.accept());

			await deleteButtonLoc.click();

			await expect(page.getByRole("table").getByText("Kitty's post").first()).not.toBeVisible();			
		});

		test("Delete button is shown only for posts created by logged user", async ({ page }) => {

			await toShow(page, "Bear's post");

			const deleteButtonLoc = page
				.getByRole("table")
				.getByRole("button", {name: "Delete"});

			await expect(deleteButtonLoc).not.toBeVisible();
		});

		test("Posts are sorted by likes", async ({ page }) => {

			await toCreatePost(page, "Like test #0", "ttonightt", "...");
			await toCreatePost(page, "Like test #1", "ttonightt", "...");
			await toCreatePost(page, "Like test #2", "ttonightt", "...");

			let i;

			for (i = 0; i < 6; i++)
				await toLike(page, "Like test #0");

			for (i = 0; i < 4; i++)
				await toLike(page, "Like test #1");

			for (i = 0; i < 7; i++)
				await toLike(page, "Like test #2");

			const likesLocs = page
				.getByRole("table")
				.locator("b");

			const linesLocsLength = await likesLocs.count();

			const likes = [];

			for (let i = 0; i < linesLocsLength; i++) {

				likes[i] = parseInt(await likesLocs.nth(i).innerText());
			}

			const sortedLikes = Array.from(likes).sort((a, b) => b - a);

			console.log("s", sortedLikes);
			console.log("r", likes);

			expect(likes).toEqual(sortedLikes);
		});
	});
});
