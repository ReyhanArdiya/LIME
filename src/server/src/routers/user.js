// /user
import express from "express";
import passport from "passport";
import userController from "../controllers/user.js";

const userRouter = express.Router({ mergeParams : true });

userRouter.use(express.urlencoded({ extended : true }));

userRouter.post("/register", userController.registerUser);

userRouter.post("/login", passport.authenticate("local"));

userRouter.route(userController.isLoggedIn, "/")
	.get(/* pass */)
	.delete(async (req, res, next) => {
		try {
			// pass
		} catch (err) {
			next(err);
		}
	})
	.patch(async (req, res, next) => {
		try {
			// pass
		} catch (err) {
			next(err);
		}
	});

export default userRouter;