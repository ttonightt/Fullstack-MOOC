const logger = require("./logger");

const errorHandler = (err, req, res, next) => {

	logger.error(err);

	switch (err.name) {
		case "CastError":

			return res.status(400).send({error: "Malformatted ID"});
		case "ValidationError":

			return res.status(400).json({error: "Validation error :("});
	}

	next(err);
};

const unknownEndpoint = (req, res) => {

	res.send(404).send("Unknown endpoint");
};

const requestLogger = (req, res, next) => {

	logger.info("###");
	logger.info("Method:", req.method);
	logger.info("Path:", req.path);
	logger.info("Body:", req.body);
	logger.info("---");
	next();
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
};