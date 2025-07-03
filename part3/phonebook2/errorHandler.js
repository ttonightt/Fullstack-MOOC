const errorHandler = (err, req, res, next) => {

	console.log(err);

	if (err.name === "CastError") {

		return res.status(400).send({error: "malformatted id"});
	}

	next(err);
};

module.exports = errorHandler;