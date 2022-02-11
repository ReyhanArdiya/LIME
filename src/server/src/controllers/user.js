import User from "../models/user.js";
import bcrypt from "bcrypt";

// TODO make this function check logged in from either local or google?
const isLoggedIn = (req, res, next) => {
	if (req.isUnauthenticated()) {
		// TODO change this for SPA
		res.redirect("/user/login");
	} else {
		next();
	}
};

const registerUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({
			accounts : {
				local : {
					email,
					password : await bcrypt.hash(password, 12),
					provider : "local"
				}
			},
			username
		});

		await user.save();

		req.login(user, err => err && console.error(err));
		// DBG
		res.send(user);
	} catch (err) {
		next(err);
	}
};

// TODO add logout which i think can be used for any strategies

// TODO is this how we do it in SPAs?
const sendUser = (req, res) => {
	res.send(req.user);
};

const deleteUser = async (req, res, next) => {
	try {
		await User.findByIdAndDelete(req.user._id);
		res.end();
	} catch (err) {
		next(err);
	}
};

const updateUser = async (req, res, next) => {
	try {
		// pass
		res.end();
	} catch (err) {
		next(err);
	}
};

const userController = {
	deleteUser,
	isLoggedIn,
	registerUser,
	sendUser,
	updateUser,
};

export default userController;