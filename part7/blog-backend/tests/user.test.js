const assert = require("node:assert");
const {test, after, beforeEach, describe} = require("node:test");
const supertest = require("supertest");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const app = require("../app");
const mongoLocalServer = require("../utils/mongo-local-server");

const api = supertest(app);

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

let initUsersPended;

beforeEach(async () => {

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

	initUsersPended = await User.find({});
});

test("Users are fetched in right number", async () => {

	const res = await api
		.get("/api/users")
		.expect(200);

	assert.strictEqual(res.body.length, 2);
});

test("Attempt to save a user in wrong format fails", async () => {

	const user = {username: ""};

	await api
		.post("/api/users")
		.send(user)
		.expect(400);
});

test("User can be created", async () => {

	const user = {
		username: "ttonightt",
		name: "Tonight",
		password: "ttonightt"
	};

	const res = await api
		.post("/api/users")
		.send(user)
		.expect(201);

	const { id, username, name, posts } = res.body;

	assert.strictEqual(mongoose.isObjectIdOrHexString(id), true);
	assert.strictEqual(username, user.username);
	assert.strictEqual(name, user.name);
	assert.strictEqual(posts.length, 0);

	const users = (await api.get("/api/users")).body;

	assert.strictEqual(users.length, 3);
});

test("Attempt to delete the user being unauthorized fails", async () => {

	const _id = session.users[0].id;

	await api
		.delete(`/api/users/${_id}`)
		.expect(401);
});

test("User can delete theirselves if they're authorized", async () => {

	const _id = initUsersPended[0].id;

	await api
		.delete(`/api/users/${_id}`)
		.set("Authorization", `Bearer ${session.tokens[0]}`)
		.expect(204);

	const users = (await api.get("/api/users")).body;

	assert.strictEqual(users.length, 1);
});

after(async () => {

	await mongoLocalServer.stop();
	await mongoose.connection.close();
});