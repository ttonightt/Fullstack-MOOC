const express = require("express");
const mongoose = require("mongoose");

const blogRouter = require("./controllers/blogRouter");

const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const config = require("./utils/config");

const app = express();

mongoose
	.connect(config.MONGODB_URI)
	.then(() => 
		logger.info("Connected to MongoDB")
	)
	.catch(err =>
		logger.error("Error was cought during connection to MongoDB:", err.message)
	);

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/posts", blogRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;