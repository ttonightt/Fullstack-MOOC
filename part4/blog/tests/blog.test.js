const assert = require("node:assert");
const {test, after, beforeEach, describe} = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const Post = require("../models/post");
const User = require("../models/user");

const app = require("../app");
const mongoLocalServer = require("../utils/mongo-local-server");

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

const initUsers = [
	{
		username: "user1",
		name: "User A",
		password: "uSER!"
	},
	{
		username: "user2",
		name: "User B",
		password: "uSER@"
	}
];

let tokenBuffer = null;

beforeEach(async () => {
	await Post.deleteMany({});
	await User.deleteMany({});

	for (const user of initUsers) {

		const passwordHash = await bcrypt.hash(user.password, 10);

		const user_ = {
			username: user.username,
			name: user.name,
			passwordHash,
			posts: []
		};

		await new User(user_).save();
	}

	const users_ = await User.find({});

	for (const post of initPosts) {

		post.user = users_[0]._id;
		await new Post(post).save();
	}

	const tokenJSON = await api
		.post("/api/login")
		.send(initUsers[0]);

	tokenBuffer = tokenJSON.body.token;
});

describe("GET actions", () => {

	test("posts are returned in right number and json format", async () => {

		const postsProm = api.get("/api/posts");

		await postsProm
			.expect(200)
			.expect("Content-Type", /application\/json/);

			assert.strictEqual((await postsProm).body.length, 2);
	});

	test("Unique index is stored in the 'id' property", async () => {

		const posts = await api.get("/api/posts");

		for (const post of posts.body)
			assert.strictEqual(mongoose.isObjectIdOrHexString(post.id), true);
	});
});



describe("POST actions", () => {

	test("Saving a new blog", async () => {

		const post = {
			title: "I've done exercise 4.23!",
			author: "ttonightt",
			url: "...",
			likes: 12
		};

		const post_ = await api
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer ${tokenBuffer}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const {id, title, author, url, likes} = post_.body;

		// Post format validation here might seem as excessive, but you said:
		// |	"At the VERY LEAST, verify that the total number of blogs in the system is
		// |	increased by one. You can also VERIFY that the content of the blog post is
		// |	saved correctly to the database."

		assert.strictEqual(typeof title === "string", true);
		assert.strictEqual(typeof author === "string", true);
		assert.strictEqual(typeof url, "string");
		assert.strictEqual(typeof likes, "number");
		assert.strictEqual(mongoose.isObjectIdOrHexString(id), true);

		assert.strictEqual((await api.get("/api/posts")).body.length, 3);
	});

	test("Blog, which is saved into DB without likes property, gets 0 value as default", async () => {

		const post = {
			title: "I've done exercise X!",
			author: "ttonightt",
			url: "..."
		};

		const post_ = await api
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer ${tokenBuffer}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);

			const {likes} = post_.body;

		assert.strictEqual(likes, 0);
	});

	test("Get 400 status code on blog saving with title or/and url missing", async () => {

		const post = {
			author: "ttonightt"
		};

		await api
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer ${tokenBuffer}`)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("Adding a blog, using inappropriate token, fails with code 401", async () => {

		const post = {
			title: "I've done exercise 4.23!",
			author: "ttonightt",
			url: "..."
		};

		const post_ = await api
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer `)
			.expect(401);
	});
});



describe("DELETE actions", () => {

	test("Single post deletion", async () => {

		const id = (await api.get("/api/posts")).body[0].id;

		console.log((await api.get("/api/posts")).body);

		await api
			.delete(`/api/posts/${id}`)
			.set("Authorization", `Bearer ${tokenBuffer}`);

		assert.strictEqual((await api.get("/api/posts")).body.length, 1);
	});
});



describe("PUT actions", () => {

	test("Post likes increasing", async () => {

		const {id, likes} = (await api.get("/api/posts")).body[0];

		const post = {
			likes: likes + 1
		};

		const post_ = await api
			.put(`/api/posts/${id}`)
			.set("Authorization", `Bearer ${tokenBuffer}`)
			.send(post);

			const body = post_.body;

		// Validation here plays role of testing whether only likes property was put instead of
		// target object or just modified the object

		assert.strictEqual(typeof body.title === "string", true);
		assert.strictEqual(typeof body.author === "string", true);
		assert.strictEqual(typeof body.url, "string");
		assert.strictEqual(body.likes, likes + 1);
	});
});



after(async () => {

	await mongoLocalServer.stop();
	await mongoose.connection.close();
});