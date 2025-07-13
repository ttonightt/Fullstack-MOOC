const jwt = require("jsonwebtoken");
const {SECRET} = require("./config");

const User = require("../models/user");
const logger = require("./logger");

const errorHandler = (err, req, res, next) => {

	logger.error(err);

	switch (err.name) {
		case "CastError":

			return res.status(400).send({error: "Malformatted ID"});
		case "ValidationError":

			return res.status(400).json({error: "Validation error :("});

		case "MongoServerError": if (err.message.includes("E11000 dublicate key error")) {

			return res.status(400).json({error: "Expected 'username' to be unique"});
		}
		case "JsonWebTokenError":

			return res.status(401).json({error: "invalid token"});

		case "TokenExpiredError":

			return res.status(401).json({error: "token has expired"});
	}

	next(err);
};

const unknownEndpoint = (req, res) => {

	res.send(404).send("Unknown endpoint");
};

const requestLogger = (req, res, next) => {

	logger.info(`### ${req.method} ${req.path} Body:`, req.body);
	next();
};

const tokenExtractor = (req, res, next) => {

	const autorization = req.get("authorization");

	if (autorization && autorization.startsWith("Bearer ")){

		req.token = autorization.replace("Bearer ", "");
	} else {

		req.token = null;
	}

	next();
};

const userExtractor = async (req, res, next) => {

	const {id} = jwt.verify(req.token, SECRET);

	if (!id) {

		return res.status(401).json({error: "invalid token"});
	}

	const user = await User.findById(id);

	if (!user) {

		return res.status(401).json({error: "invalid token"});
	}

	req.user = user;

	next();
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor
};