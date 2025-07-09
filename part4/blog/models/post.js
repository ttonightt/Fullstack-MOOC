const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		required: true
	}
});

postSchema.set("toJSON", {
	transform: (doc, returned) => {

		returned.id = returned._id.toString();
		delete returned._id;
		delete returned.__v;
	}
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;