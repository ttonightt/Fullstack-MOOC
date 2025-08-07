const express = require("express");
const mongoose = require("mongoose");

const loginRouter = require("./controllers/loginRouter");
const blogRouter = require("./controllers/blogRouter");
const userRouter = require("./controllers/userRouter");

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
app.use("/public", express.static("public"));
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/posts", blogRouter);
app.use("/api/users", userRouter);

if (config.NODE_ENV === "test") {

	const testRouter = require("./controllers/testRouter");
	app.use("/api/reset", testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;