const express = require("express");
const mongoose = require("mongoose");

const blogRouter = require("./controllers/blogRouter");

const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const mongoLocalServer = require("./utils/mongo-local-server");

const app = express();

const connectToDB = uri => {
	
	mongoose
		.connect(uri)
		.then(() =>
			logger.info("Connected to MongoDB")
		)
		.catch(err =>
			logger.error("Error was cought during connection to MongoDB:", err.message)
		);
};

if (config.NODE_ENV === "test") {

	logger.info("DB is running on local Mongo Server");

	mongoLocalServer.create().then(srv => {

		connectToDB(srv.getUri());
	});

} else {

	logger.info("DB is running on external Mongo Server");

	connectToDB(config.MONGODB_URI);
}

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/posts", blogRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;