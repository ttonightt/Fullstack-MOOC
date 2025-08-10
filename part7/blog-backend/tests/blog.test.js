const assert = require("node:assert");
const {test, after, beforeEach, describe, before } = require("node:test");
const supertest = require("supertest");

const mongoose = require("mongoose");
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
		content: "Hello World"
	},
	{
		title: "Macskafogó",
		author: "Béla Ternovszky",
		content: "Lorem ipsum"
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

const session = {

	tokens: initUsers.map(() => null),
	users: initUsers.map(() => null),
	async login (i) {

		const res = await api
			.post("/api/login")
			.send(initUsers[i]);

		this.tokens[i] = res.body.token;
		this.users[i] = {username: res.body.username};
	},
	async logout (i) {

		this.tokens[i] = null;
		this.users[i] = null;
	}
};

let initPostsPended = [];

before(async () => {

	await User.deleteMany({});

	for (const user of initUsers) {
	
		const passwordHash = await bcrypt.hash(user.password, 10);

		const user_ = {
			...user,
			posts: [],
			passwordHash
		};

		delete user_.password;

		await new User(user_).save();
	}

	await session.login(0);
	await session.login(1);
});

beforeEach(async () => {

	await Post.deleteMany({});

	for (const post of initPosts) {

		await api
			.post("/api/posts")
			.send(post)
			.set("Authorization", `Bearer ${session.tokens[0]}`);
	}

	initPostsPended = (await api.get("/api/posts")).body;
});


test("Posts are returned in right number and json format", async () => {

	const prom = api.get("/api/posts");

	await prom
		.expect(200)
		.expect("Content-Type", /application\/json/);

	const json = await prom;

	assert.strictEqual(json.body.length, 2);
});

//test("Saving new post (User 0)", async () => {

//	const post = initPosts[0];

//	const post_ = await api
//		.post("/api/posts")
//		.send(post)
//		.set("Authorization", `Bearer ${session.tokens[0]}`)
//		.expect(201)
//		.expect("Content-Type", /application\/json/);

//	const {id, title, author, content, likes, comments, user} = post_.body;

//	assert.strictEqual(mongoose.isObjectIdOrHexString(id), true);
//	assert.strictEqual(title, post.title);
//	assert.strictEqual(author, post.author);
//	assert.strictEqual(content, post.content);
//	assert.strictEqual(likes.length, 0);
//	assert.strictEqual(comments.length, 0);
//	assert.strictEqual(user.username, session.user.username);

//	const json = await api.get("/api/posts");

//	assert.strictEqual(json.body.length, 1);
//});

//test("Saving new post (User 1)", async () => {

//	const post = initPosts[0];

//	const post_ = await api
//		.post("/api/posts")
//		.send(post)
//		.set("Authorization", `Bearer ${session.token}`)
//		.expect(201)
//		.expect("Content-Type", /application\/json/);

//	const {id, title, author, content, likes, comments, user} = post_.body;

//	assert.strictEqual(mongoose.isObjectIdOrHexString(id), true);
//	assert.strictEqual(title, post.title);
//	assert.strictEqual(author, post.author);
//	assert.strictEqual(content, post.content);
//	assert.strictEqual(likes.length, 0);
//	assert.strictEqual(comments.length, 0);
//	assert.strictEqual(user.username, session.user.username);

//	const json = await api.get("/api/posts");

//	assert.strictEqual(json.body.length, 2);
//});

test("Get single post", async () => {

	const post = initPosts[0];

	const _id = initPostsPended[0].id;

	const res = await api
		.get(`/api/posts/${_id}`)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	const { title, author, content, likes, comments } = res.body;

	assert.strictEqual(title, post.title);
	assert.strictEqual(author, post.author);
	assert.strictEqual(content, post.content);
	assert.strictEqual(likes.length, 0);
	assert.strictEqual(comments.length, 0);
});

test("Attempt of another users post deletion fails", async () => {

	const _id = initPostsPended[0].id;

	await api
		.delete(`/api/posts/${_id}`)
		.set("Authorization", `Bearer ${session.tokens[1]}`)
		.expect(401);

	const json = await api.get("/api/posts");

	assert.strictEqual(json.body.length, 2);
});

test("User can delete their post", async () => {

	const _id = initPostsPended[1].id;

	console.log(session);

	await api
		.delete(`/api/posts/${_id}`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(204);

	const json = await api.get("/api/posts");

	assert.strictEqual(json.body.length, 1);
});

test("Attempt to modify another users post fails", async () => {

	const _id = initPostsPended[0].id;

	await api
		.put(`/api/posts/${_id}`)
		.send({})
		.set("Authorization", `Bearer ${session.tokens[1]}`)
		.expect(401);
});

test("User can modify their post", async () => {

	const post = initPostsPended[0];
	const _id = post.id;

	const modifier = {
		title: "Hungarian parodical animation",
		content: "In 1977..."
	};

	const res = await api
		.put(`/api/posts/${_id}`)
		.send(modifier)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(200);

	const {id, title, author, content, likes, comments, user} = res.body;

	assert.strictEqual(id, _id);
	assert.strictEqual(mongoose.isObjectIdOrHexString(id), true);
	assert.strictEqual(title, modifier.title);
	assert.strictEqual(author, post.author);
	assert.strictEqual(content, modifier.content);
	assert.strictEqual(likes.length, 0);
	assert.strictEqual(comments.length, 0);
	assert.strictEqual(user.username, session.users[0].username);
});

test("User likes their post", async () => {

	const _id = initPostsPended[0].id;

	const res = await api
		.post(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(200);

	const { likes } = res.body;

	assert.strictEqual(likes.length, 1);
	assert.strictEqual(likes.some(item => item.username === session.users[0].username), true);
});

test("If user likes the post again, likes don't increment", async () => {

	const _id = initPostsPended[0].id;

	await api
		.post(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)

	const res = await api
		.post(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(200);

	const { likes } = res.body;

	assert.strictEqual(likes.length, 1);
});

test("User dislikes the post", async () => {

	const _id = initPostsPended[0].id;

	await api
		.post(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)

	const res = await api
		.delete(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`);

	const { likes } = res.body;

	assert.strictEqual(likes.length, 0);
});

test("If user dislikes the post, which they've disliked already, request ends with 204 status code", async () => {

	const _id = initPostsPended[0].id;

	await api
		.delete(`/api/posts/${_id}/like`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(204);
});


after(async () => {

	await mongoLocalServer.stop();
	await mongoose.connection.close();
});