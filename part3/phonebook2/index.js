const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("body", (req, res) => req.method === "POST" ? JSON.stringify(req.body) : "");

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// /api/persons

let phonebook = [
	{
		"id": "1",
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{
		"id": "2",
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{
		"id": "3",
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{
		"id": "4",
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
];

app.get("/info", (req, res) => {

	res.send(`
		Phonebook has info for ${phonebook.length} people<br><br>
		${new Date()}
	`);
});

app.get("/api/persons", (req, res) => {
	res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {

	const id = req.params.id;
	const contact = phonebook.find(entry => entry.id === id);

	if (contact) {

		res.json(contact);
	} else {
		res.status(404).end();
	}
});

const range = 10 ** 8;

app.post("/api/persons", (req, res) => {

	const {name, number} = req.body;

	if (!(name && number)) {
		return res.status(400).json({
			error: "Name or number are missing!"
		});
	}

	const entry = {
		name,
		number,
		id: Math.round(Math.random() * range).toString()
	};

	phonebook = phonebook.concat(entry);

	res.json(phonebook);
});

app.delete("/api/persons/:id", (req, res) => {

	const id = req.params.id;
	phonebook = phonebook.filter(note => note.id !== id);

	res.status(204).end();
});

const unknownEndpoint = (req, res) => {

	res.status(404).send({
		error: "unknown endpoint"
	});
}

app.use(unknownEndpoint);

const PORT = 3001;

app.listen(PORT, () => {

	console.log(`Server is running on port ${PORT}`);
});