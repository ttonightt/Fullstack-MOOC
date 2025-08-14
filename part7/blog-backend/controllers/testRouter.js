const testRouter = require("express").Router();

const User = require("../models/user");
const Post = require("../models/post");

testRouter.delete("/reset", async (req, res, next) => {

	await User.deleteMany({});
	await Post.deleteMany({});

	res.status(204).end();
});

module.exports = testRouter;