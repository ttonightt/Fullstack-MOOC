const express = require("express");
const mongoose = require("mongoose");

const loginRouter = require("./controllers/loginRouter");
const postRouter = require("./controllers/postRouter");
const userRouter = require("./controllers/userRouter");

const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const mongoLocalServer = require("./utils/mongo-local-server");


const app = express();

const connectToDB = async () => {

	let uri;

	if (config.NODE_ENV === "test") {

		logger.info("DB is running on local Mongo Server");

		uri = ( await mongoLocalServer.create() ).getUri();

	} else {

		logger.info("DB is running on external Mongo Server");

		uri = config.MONGODB_URI;
	}

	try {
		await mongoose.connect(uri);

		logger.info("Connected to MongoDB");
	} catch (e) {

		logger.error("Error was cought during connection to MongoDB:", e.message);
	}
};

connectToDB();

app.use(express.static("dist"));
app.use("/public", express.static("public"));
app.use(express.json());

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;