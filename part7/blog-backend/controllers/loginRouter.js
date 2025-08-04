const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {SECRET} = require("../utils/config");

const loginRouter = require("express").Router();

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
		id: user._id
	};

	const token = jwt.sign(
		user_, 
		SECRET,
		{expiresIn: 60 * 15}
	);

	res.status(200).send({
		token,
		username,
		name: user.name
	});
});

module.exports = loginRouter;