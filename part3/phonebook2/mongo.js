const mongoose = require("mongoose");

if (process.argv.length < 3) {

	console.log("give password as an argument");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ttonightt:${password}@cluster0.czjtbih.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
	name: String,
	number: String
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length < 4) {

	Contact.find({}).then(res => {

		console.log("phonebook:");
		res.forEach(cnt => console.log(cnt.name, cnt.number));

		mongoose.connection.close();
	});
} else {
	
	const contact = new Contact({
		name: process.argv[3],
		number: process.argv[4]
	});
	
	contact.save().then(res => {
	
		console.log(`added ${res.name} number ${res.number} to phonebook`);
		mongoose.connection.close();
	});
}