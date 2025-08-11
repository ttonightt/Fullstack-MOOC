const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = require("express").Router();
const middleware = require("../utils/middleware");

const User = require("../models/user");
const Post = require("../models/post");

userRouter.get("/", async (req, res, next) => {

	const users = await User
		.find({})
		.populate("posts", {
			title: true,
			author: true,
			url: true,
			likes: true
		});

	res.json(users);
});

userRouter.post("/", async (req, res, next) => {

	const {username, name, password} = req.body;

	if (!username || username?.length < 4 || !password || password.length < 4) {

		return res.status(400).json({error: "Username and password must be at least 4 characters long!"});
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = new User({
		username,
		name,
		passwordHash,
		posts: []
	});

	const user_ = await user.save();

	res.status(201).json(user_);
});

userRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;

	if (req.user.id !== id) {

		return res.status(401).json({error: "You cannot delete another user"});
	}

	await Post.deleteMany({user: id});

	await User.findByIdAndDelete(id);

	res.status(204).end();
});

module.exports = userRouter;