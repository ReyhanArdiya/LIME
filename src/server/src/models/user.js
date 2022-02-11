import mongoose from "mongoose";

const validateEmail = email => {
	const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

	return re.test(email);
};

const UserSchema = new mongoose.Schema({
	accounts : {
		google : {
			email : {
				index    : true,
				match    : [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address" ],
				sparse   : true,
				trim     : true,
				type     : String,
				unique   : true,
				validate : [ validateEmail, "Please fill a valid email address" ],
			},
			id       : String,
			provider : String,
			token    : String,
		},

		local : {
			email : {
				index    : true,
				match    : [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address" ],
				sparse   : true,
				trim     : true,
				type     : String,
				unique   : true,
				validate : [ validateEmail, "Please fill a valid email address" ],

			},
			password : String,
			provider : String
		}
	},

	/* TODO username will be created by the
	user after registering form any account. So after registring email, they will be prompted to give their username */
	username : {
		index    : true,
		required : true,
		sparse   : true,
		type     : String,
		unique   : true
	}
}, { strict : "throw" });

const User = mongoose.model("User", UserSchema);

export default User;