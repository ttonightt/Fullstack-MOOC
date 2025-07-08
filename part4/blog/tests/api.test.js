const assert = require("node:assert");
const {test, after, beforeEach} = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Post = require("../models/post");

const app = require("../app");

const api = supertest(app);

const initPosts = [
	{
		title: "Hófehér",
		author: "József Nepp",
		url: "...",
		likes: 90
	},
	{
		title: "Hófehér 2",
		author: "József Nepp",
		url: "...",
		likes: 0
	}
];

beforeEach(async () => {
	await Post.deleteMany({});

	for (const post of initPosts)
		await new Post(post).save();
});

test("posts are returned as json", async () => {

	await api
		.get("/api/posts")
		.expect(200)
		.expect("Content-Type", /application\/json/);
});

test("all posts are returned", async () => {

	const res = await api.get("/api/posts");

	assert.strictEqual(res.body.length, initPosts.length);
});

after(async () => {

	await mongoose.connection.close();
});