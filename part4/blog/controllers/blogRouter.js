const blogRouter = require("express").Router();
const Post = require("../models/post");
const logger = require("../utils/logger");

const mergeObject = (target, source) => {

	const source_ = Object.assign({}, source);

	for (const k in source_)
		if (source_[k] === undefined)
			delete source_[k];

	return Object.assign(target, source_);
};

blogRouter.get("/", (req, res) => {

	Post.find({})
		.then(posts =>
			res.json(posts)
		);
});

blogRouter.get("/:id", (req, res) => {

	const id = req.params.id;

	Post.findById(id)
		.then(post =>
			res.json(post)
		);
});

blogRouter.post("/", (req, res) => {

	const {title, author, url, likes} = req.body;

	const post = new Post({
		title,
		author,
		url,
		likes
	});

	post.save()
		.then(post_ =>
			res.json(post_)
		)
		.catch(
			err => next(err)
		);
});

blogRouter.delete("/:id", (req, res, next) => {

	const id = req.params.id;

	Post.findByIdAndDelete(id)
		.then(() =>
			res.status(204).end()
		)
		.catch(err => next(err));
});

blogRouter.put("/:id", (req, res, next) => {

	const {title, author, url, likes} = req.body;
	const id = req.params.id;

	Post.findById(id)
		.then(post => {

			if (!post) {

				return res.status(404).end();
			}

			mergeObject(post, {title, author, url, likes});

			return post.save().then(post_ =>
				res.json(post_)
			);
		})
		.catch(err => next(err));
});

module.exports = blogRouter;