const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {SECRET, SESSION_TIMEOUT} = require("../utils/config");

const loginRouter = require("express").Router();
const middleware = require("../utils/middleware");

const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {

	const {username, password} = req.body;

	const user = await User.findOne({username});

	const validation = user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!validation) {

		return res.status(401).json({error: "invalid username or password"});
	}

	const user_ = {
		username,
		id: user.id
	};

	const token = jwt.sign(
		user_, 
		SECRET,
		{expiresIn: SESSION_TIMEOUT}
	);

	res.status(200).send({
		token,
		username,
		name: user.name,
		id: user.id
	});
});

loginRouter.get("/", middleware.userExtractor, async (req, res, next) => {

	const {user} = req;

	return res.status(200).send({
		token: req.token,
		username: user.username,
		name: user.name,
		id: user.id
	});
});

module.exports = loginRouter;