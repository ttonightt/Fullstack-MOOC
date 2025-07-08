const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
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