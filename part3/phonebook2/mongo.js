require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => console.log("connected to MongoDB"))
	.catch(err => console.error(err));

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3
	},
	number: {
		type: String,
		// match: /[0-9]{2,3}-[0-9]+/,
		validate: value => {
			return /[0-9]{2,3}-[0-9]+/.test(value)
		},
		minLength: 8
	}
});

contactSchema.set("toJSON", {
	transform: (doc, returned) => {
		returned.id  = returned._id.toString();
		delete returned._id;
		delete returned.__v;
	}
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;