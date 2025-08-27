const { describe, test, expect, beforeEach, beforeAll, afterEach } = require("@playwright/test");
const { initPosts } = require("./initData");


beforeEach(async ({ page }) => {

	page.on("dialog", dialog => dialog.accept());

	await page.goto("/login");

	await expect(page).toHaveURL("/login");

	await page.getByTestId("login-username").getByRole("textbox").fill("safranek");
	await page.getByTestId("login-password").getByRole("textbox").fill("safranek123");
	await page.getByTestId("login-submit").click();

	await expect(page).toHaveURL("/posts");
});

test("Posts are generated in right number and order", async ({ page }) => {

	const postlistLoc = page.getByTestId("postlist-root");

	const postLocs = await postlistLoc.getByTestId(".postlist-post").all();

	expect(postLocs).toHaveLength(initPosts.length);

	for (let i = 0; i < postLocs.length; i++) {

		console.log(initPosts[i]);

		await expect(postLocs[i]).toHaveText(RegExp(initPosts[i].title));
		await expect(postLocs[i]).toHaveText(RegExp(initPosts[i].author));
	}
});

test("Post can be liked by authorized user", async ({ page }) => {

	const postlistLoc = page.getByTestId("postlist-root");

	const posts = await postlistLoc.getByTestId(".postlist-post").all();

	for (const post of posts) {

		await post.getByRole("button").click();

		const likeUserLoc = post.getByTestId("post-like-user");

		expect(likeUserLoc).toBeVisible();
	}
});

test("Post can be created", async ({ page }) => {

	await page.getByTestId("newpost-title").getByRole("textbox").fill("Post 4");
	await page.getByTestId("newpost-content").getByRole("textbox").fill("Content 4");
	
	const authorLoc = page.getByTestId("newpost-author").getByRole("textbox");

	await expect(authorLoc).toHaveValue("Safranek");
	await authorLoc.fill("Author 4");

	await page.getByRole("button", { name: "Share" }).click();

	const postlistLoc = page.getByTestId("postlist-root");

	await expect(postlistLoc).toHaveText(/Post 4/);
	await expect(postlistLoc).toHaveText(/Author 4/);

	const postLocs = await postlistLoc.getByTestId(".postlist-post").all();

	expect(postLocs).toHaveLength(initPosts.length + 1);
});

test("Post can be opened", async ({ page }) => {

	await page
		.getByTestId("postlist-root")
		.getByRole("link", { name: "Post 1" })
		.click();

	await expect(page).toHaveURL(/\/posts\/.+/);
});

test("Post can be commented by authorized user", async ({ page }) => {

	await page
		.getByTestId("postlist-root")
		.getByRole("link", { name: "Post 1" })
		.click();

	await expect(page).toHaveURL(/\/posts\/.+/);

	const commentLoc = page.getByTestId("comment-root").getByRole("button");

	page.getByTestId("comment-root").getByRole("textbox").fill("Comment 1");

	await expect(commentLoc).toBeEnabled();
	await commentLoc.click();

	const comments = await page.getByTestId("commentlist-root").locator("p").all();

	expect(comments).toHaveLength(1);
	await expect(comments[0]).toHaveText("Comment 1");
});

test("Unknown post throw 204", async ({ page }) => {

	await page.goto("/posts/7243g23276d623");

	await expect(page.getByTestId("error-page")).toHaveText(/204/);
});

test("User can reset comments of their own post", async ({ page }) => {

	const postLoc = page.getByTestId(".postlist-post").filter({ has: page.getByRole("link", { name: "@safranek" }) });

	await postLoc.getByRole("link", { name: /Post/ }).click();

	await page.getByTestId("post-menu-btn").click();

	const menuLoc = page.getByTestId("post-menu-opts");
	await expect(menuLoc).toBeVisible();

	await page.getByTestId("post-menu-reset").click({ force: true });

	await expect(page.getByTestId("commentlist-root")).toHaveText("No comments");
});

test("User can delete their own post", async ({ page }) => {

	const postLoc = page.getByTestId(".postlist-post").filter({ has: page.getByRole("link", { name: "@safranek" }) });

	await postLoc.getByRole("link", { name: /Post/ }).click();

	await page.getByTestId("post-menu-btn").click();

	const menuLoc = page.getByTestId("post-menu-opts");
	await expect(menuLoc).toBeVisible();

	await page.getByTestId("post-menu-delete").click();
	//await page.getByRole("button").click();

	await expect(page).toHaveURL("/posts");

	const posts = await page.getByTestId(".postlist-post").all();

	expect(posts).toHaveLength(2);
});