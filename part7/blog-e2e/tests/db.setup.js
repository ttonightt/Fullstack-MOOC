const { expect } = require("@playwright/test");
const setup = require("@playwright/test").test;


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

const initPosts = [
	{
		title: "Post 1",
		author: "Author 1",
		content: "Content 1",
		__user__: 0
	},
	{
		title: "Post 2",
		author: "Author 2",
		content: "Content 2",
		__user__: 1
	},
	{
		title: "Post 3",
		author: "Author 3",
		content: "Content 3",
		__user__: 2
	}
];

setup("Init DB", async ({ request }) => {

	await request.delete("/api/test/reset");

	for (const user of initUsers) {

		const issue = await request.post("/api/users", { data: user });
		expect(issue.ok()).toBeTruthy();
	}

	for (const post of initPosts) {

		const res = await request.post("/api/login", { data: initUsers[post.__user__] });
		const json = await res.json();

		const issue = await request.post("/api/posts", { data: post, headers: { Authorization: `Bearer ${json.token}` } });

		console.log(await issue.json());
		expect(issue.ok()).toBeTruthy();
	}

	const users = await ( await request.get("/api/users") ).json();
	const posts = await ( await request.get("/api/posts") ).json();

	console.log(users.map( ({ posts, username, name }) => ({ username, name, posts: posts.length }) ));
	console.log(posts.map( ({ title, author, user, content }) => ({ title, author, user: user.username, content }) ));
});


module.exports = { initPosts, initUsers };