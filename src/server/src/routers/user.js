// /user
import express from "express";
import passport from "passport";
import userController from "../controllers/user.js";

const userRouter = express.Router({ mergeParams : true });

userRouter.use(express.urlencoded({ extended : true }));

userRouter.post("/register", userController.registerUser);

userRouter.post("/login", passport.authenticate("local"));

userRouter.route(userController.isLoggedIn, "/")
	.get(userController.sendUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

export default userRouter;