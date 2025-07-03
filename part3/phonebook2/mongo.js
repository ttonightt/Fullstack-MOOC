require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => console.log("connected to MongoDB"))
	.catch(err => console.error(err));

const contactSchema = new mongoose.Schema({
	name: String,
	number: String
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