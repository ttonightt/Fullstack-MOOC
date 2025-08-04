const assert = require("node:assert");
const {test, after, beforeEach, describe} = require("node:test");
const supertest = require("supertest");

const mongoose = require("mongoose");
const User = require("../models/user");

const app = require("../app");
const mongoLocalServer = require("../utils/mongo-local-server");

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});
});

test("Error thrown attempting to save user with too short username or password", async () => {

	const user = {

		username: "",
	};

	const user_ = await api
		.post("/api/users")
		.send(user)
		.expect(400);

	assert.strictEqual(user_.body.error.length > 0, true);
});

after(async () => {

	await mongoLocalServer.stop();
	await mongoose.connection.close();
});