const jwt = require("jsonwebtoken");

const postRouter = require("express").Router();
const {SECRET} = require("../utils/config");
const middleware = require("../utils/middleware");

const Post = require("../models/post");
const User = require("../models/user");

const mergeObjects = require("../utils/mergeObjects");


postRouter.get("/", async (req, res) => {

	const posts = await Post
		.find({})
		.populate("user", {username: true, name: true})
		.populate("likes", {username: true, name: true});

	res.json(posts);
});


postRouter.get("/:id", async (req, res) => {

	const id = req.params.id;

	const post = await Post
		.findById(id)
		.populate("user", {username: true, name: true})
		.populate("likes", {username: true, name: true});

	res.json(post);
});


postRouter.post("/", middleware.userExtractor, async (req, res, next) => {

	const {title, author, content} = req.body;

	const userId = req.user.id;

	const user = await User.findById(userId);

	if (!user) 
		res.status(401).json({
			error: "User is missing!"
		});

	const post = new Post({
		title,
		author,
		content,
		likes: [],
		user: userId,
		comments: []
	});

	const post_ = await post.save();

	await post_.populate("user", {username: true, name: true})
	await post_.populate("likes", {username: true, name: true});

	user.posts.push(post_.id);

	await user.save();

	res.status(201).json(post_);
});


postRouter.post("/:id/like", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;
	const post = await Post.findById(id);

	if (!post)
		return res.status(204).end();

	const userId = req.user.id;

	if (!post.likes.includes(userId)) {

		post.likes.push(userId);

		const post_ = await post.save();

		await post_.populate("user", {username: true, name: true})
		await post_.populate("likes", {username: true, name: true});

		return res.json(post_);
	}

	return res.json(post); // Some http code have to be added
});


postRouter.delete("/:id/like", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;
	const post = await Post.findById(id);

	if (!post)
		return res.status(204).end();

	const userId = req.user.id;

	if (post.likes.includes(userId)) {

		post.likes = post.likes.filter(item => userId.toString() !== item.toString());

		const post_ = await post.save();

		await post_.populate("user", {username: true, name: true});
		await post_.populate("likes", {username: true, name: true});

		return res.json(post_);
	}

	return res.status(204).end();
});


postRouter.post("/:id/comments", middleware.userExtractor, async (req, res, next) => {
	// Though comment is stored anonymously, userExtractor checks whether it's an existing user comments
	const id = req.params.id;
	const post = await Post.findById(id);

	const { comment } = req.body;

	if (!post)
		return res.status(404).end();

	post.comments.push(comment);

	const post_ = await post.save();

	await post_.populate("user", {username: true, name: true})
	await post_.populate("likes", {username: true, name: true});

	return res.json(post_);
});

postRouter.delete("/:id/comments", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;
	const post = await Post.findById(id);

	if (!post)
		return res.status(204).end();

	const userId = req.user.id;

	if (post.user.toString() === userId) {

		post.comments = [];

		const post_ = await post.save();

		await post_.populate("user", {username: true, name: true});
		await post_.populate("likes", {username: true, name: true});

		return res.json(post_);
	}

	return res.status(401).json({
		error: "The post isn't yours!"
	});
});


postRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {

	const id = req.params.id;
	const post = await Post.findById(id);

	if (!post)
		return res.status(204).end();

	if (req.user.id !== post.user.toString()) {

		return res.status(401).json({error: "You cannot delete anothers post"});
	}

	const user = await User.findById(post.user);

	user.posts = user.posts.filter(p => p.id !== id);

	await user.save();

	await Post.findByIdAndDelete(id);

	res.status(204).end();
});


postRouter.put("/:id", middleware.userExtractor, async (req, res, next) => {

	const {title, author, content} = req.body;
	const id = req.params.id;

	const post = await Post.findById(id);

	if (!post) {

		return res.status(404).end();
	}

	if (req.user.id !== post.user.toString()) {

		return res.status(401).json({error: "You cannot modify another's post"});
	}

	mergeObjects(post, {title, author, content});

	const post_ = await post.save();

	await post_.populate("user", {username: true, name: true});
	await post_.populate("likes", {username: true, name: true});

	return res.json(post_);
});


module.exports = postRouter;