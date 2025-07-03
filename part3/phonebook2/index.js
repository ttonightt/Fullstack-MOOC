const express = require("express");
const morgan = require("morgan");
const app = express();
const Contact = require("./mongo");
const errorHandler = require("./errorHandler");
const unknownEndpoint = require("./unknownEndpoint");

morgan.token("body", (req, res) => req.method === "POST" ? JSON.stringify(req.body) : "");

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get("/info", (req, res) => {

	Contact.find({}).then(cnts => {

		res.send(`
			Phonebook has info for ${cnts.length} people<br><br>
			${new Date()}
		`);
	});
});

app.get("/api/persons", (req, res) => {

	Contact.find({}).then(cnts => {

		res.json(cnts);
	});
});

app.get("/api/persons/:id", (req, res, next) => {

	const id = req.params.id;

	Contact
		.findById(id)
		.then(cnt => {

			if (cnt) {

				res.json(cnt);
			} else {

				res.status(404).end();
			}
		})
		.catch(err => next(err));
});

app.post("/api/persons", (reqP, resP) => {

	const {name, number} = reqP.body;

	console.log(reqP.body);

	if (!(name && number)) {
		return resP.status(400).json({
			error: "Name or number are missing!"
		});
	}

	const contact = new Contact({
		name,
		number
	});

	contact.save().then(resS => {

		console.log("New contact was saved successfully!");

		resP.json(resS);
	});
});

app.put("/api/persons/:id", (req, res, next) => {

	const id = req.params.id;
	const {name, number} = req.body;

	Contact
		.findByIdAndUpdate(id, {name, number})
		.then(cnt => {

			res.json(cnt);
		})
		.catch(err => next(err))
});

app.delete("/api/persons/:id", (req, res, next) => {

	const id = req.params.id;

	Contact
		.findByIdAndDelete(id)
		.then(() => 
			res.status(204).end()
		)
		.catch(err => 
			next(err)
		);
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

	console.log(`Server is running on port ${PORT}`);
});