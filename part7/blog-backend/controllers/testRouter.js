const router = require("express").Router();

const Post = require("../models/post");
const User = require("../models/user");

router.post("/", async (req, res) => {

	await Post.deleteMany({});
	await User.deleteMany({});

	res.status(204).end();
});

module.exports = router;