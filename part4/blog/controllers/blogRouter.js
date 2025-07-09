const blogRouter = require("express").Router();
const Post = require("../models/post");
const logger = require("../utils/logger");

const mergeObjects = require("../utils/mergeObjects");

blogRouter.get("/", async (req, res) => {

	const posts = await Post.find({});

	res.json(posts);
});

blogRouter.get("/:id", async (req, res) => {

	const id = req.params.id;

	const post = await Post.findById(id);
	
	res.json(post);
});

blogRouter.post("/", async (req, res, next) => {

	const {title, author, url, likes} = req.body;

	if (title === undefined || url === undefined) {

		res.status(400).json({error: "title or/and url entries are missing!"});
	} else {

		const post = new Post({
			title,
			author,
			url,
			likes: likes ?? 0
		});

		const post_ = await post.save();

		res.status(201).json(post_);
	}

});

blogRouter.delete("/:id", async (req, res, next) => {

	const id = req.params.id;

	await Post.findByIdAndDelete(id);

	res.status(204).end();
});

blogRouter.put("/:id", async (req, res, next) => {

	const {title, author, url, likes} = req.body;
	const id = req.params.id;

	const post = await Post.findById(id);
		
	if (!post) {

		return res.status(404).end();
	}

	mergeObjects(post, {title, author, url, likes});

	return post.save().then(post_ =>
		res.json(post_)
	);
});

module.exports = blogRouter;