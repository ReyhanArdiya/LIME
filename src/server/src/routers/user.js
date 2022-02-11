// /user
import express from "express";
import passport from "passport";
import userController from "../controllers/user.js";

const userRouter = express.Router({ mergeParams : true });

userRouter.use(express.urlencoded({ extended : true }));

userRouter.post("/register", userController.registerUser);

userRouter.post("/login", passport.authenticate("local", { successRedirect : "/" }));

userRouter.get("/logout", userController.logoutUser);

userRouter.get(process.env.GOOGLE_AUTH_PATH, passport.authenticate(
	"google",
	{ scope : [ "email", "profile" ] }
));

userRouter.get(process.env.GOOGLE_AUTH_CB, passport.authenticate(
	"google",
	// DBG
	{ successRedirect : "/" }
));

userRouter.route("/")
	.all(userController.isLoggedIn)
	.get(userController.sendUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

export default userRouter;