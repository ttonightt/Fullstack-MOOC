const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	name: String,
	passwordHash: {
		type: String,
		required: true
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		}
	]
});

userSchema.set("toJSON", {
	transform: (doc, returned) => {

		returned.id = returned._id.toString();
		delete returned.passwordHash;
		delete returned._id;
		delete returned.__v;
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;