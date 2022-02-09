import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const validateEmail = email => {
	const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

	return re.test(email);
};

const UserSchema = new mongoose.Schema({
	email : {
		match    : [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address" ],
		required : true,
		trim     : true,
		type     : String,
		unique   : true,
		validate : [ validateEmail, "Please fill a valid email address" ],
	}
}, { strict : "throw" });

UserSchema.plugin(passportLocalMongoose, { usernameQueryFields : [ "email" ] });

const User = mongoose.model("User", UserSchema);

export default User;