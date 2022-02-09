import User from "../models/user.js";

// TODO make this function check logged in from either local or google?
const isLoggedIn = (req, res, next) => {
	if (req.isUnauthenticated()) {
		// TODO change this for SPA
		res.redirect("/auth/login");
	} else {
		next();
	}
};

const registerUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({
			email,
			username
		});

		const newUser = await User.register(user, password);

		req.login(newUser, err => err && console.error(err));
		res.send(newUser);
	} catch (err) {
		next(err);
	}
};

const userController = {
	isLoggedIn,
	registerUser
};

export default userController;