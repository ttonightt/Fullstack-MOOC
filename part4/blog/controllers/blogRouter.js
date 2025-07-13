const jwt = require("jsonwebtoken");

const blogRouter = require("express").Router();
const {SECRET} = require("../utils/config");
const middleware = require("../utils/middleware");

const Post = require("../models/post");
const User = require("../models/user");

const mergeObjects = require("../utils/mergeObjects");


blogRouter.get("/", async (req, res) => {

	const posts = await Post.find({}).populate("user", {username: true, name: true});

	res.json(posts);
});

blogRouter.get("/:id", async (req, res) => {

	const id = req.params.id;

	const post = await Post.findById(id);

	res.json(post);
});

blogRouter.post("/", middleware.userExtractor, async (req, res, next) => {

	const {title, author, url, likes} = req.body;

	const decodedToken = jwt.verify(req.token, SECRET);

	if (!decodedToken.id) {

		return res.status(401).json({error: "invalid token"});
	}

	const user = await User.findById(decodedToken.id);

	if (!user) {

		res.status(400).json({error: "User is missing!"});
	}

	const post = new Post({
		title,
		author,
		url,
		likes: likes ?? 0,
		user: user._id
	});

	const post_ = await post.save();

	user.posts = user.posts.concat(post_._id);

	await user.save();

	res.status(201).json(post_);
});

blogRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;

	const post = await Post.findById(id);

	if (req.user._id.toString() !== post.user.toString()) {

		return res.status(401).json({error: "You cannot delete anothers post"});
	}

	const user = await User.findById(post.user);

	user.posts = user.posts.filter(p => p._id.toString() !== id);

	await user.save();

	await Post.findByIdAndDelete(id);

	res.status(204).end();
});

blogRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {

	const {title, author, url, likes} = req.body;
	const id = req.params.id;

	const post = await Post.findById(id);

	if (!post) {

		return res.status(404).end();
	}

	if (req.user._id.toString() !== post.user.toString()) {

		return res.status(401).json({error: "You cannot delete anothers post"});
	}

	mergeObjects(post, {title, author, url, likes});

	const post_ = await post.save();

	return res.json(post_);
});

module.exports = blogRouter;