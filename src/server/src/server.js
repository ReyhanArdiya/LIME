import "dotenv/config";
import User from "./models/user.js";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

// Connect mongo
const mongoDatabase = process.env.MONGODB;
try {
	await mongoose.connect(mongoDatabase);
	console.log(`Connected to ${mongoDatabase}!🍃`);
} catch (err) {
	console.log(`Error! Can't connect to ${mongoDatabase}!🍂`, err);
}

const port = process.env.PORT;
const app = express();

// Session stuff
app.use(session({
	cookie : {
		expires  : Date.now() + (1000 * 60 * 60 * 24 * 7),
		httpOnly : true,
		maxAge   : 1000 * 60 * 60 * 24 * 7,
		secure   : process.env.NODE_ENV === "production",
	},
	name              : process.env.SESSION_NAME || "connect.sid",
	resave            : false,
	saveUninitialized : true,
	secret            : process.env.SESSION_SECRET
	// store             : MongoStore.create(
	// 	{
	// 		mongoUrl,
	// 		touchAfter : 24 * 60 * 60
	// 	}
	// )
}));

// Passport stuff
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	console.log(
		"🌟 You got a new request! ( *≧◡≦)~💌 \\(￣▽￣* )ゞ 🌟",
		`⌚ ${new Date()
			.toLocaleString()} ⌚`
	);
	next();
});


app.listen(port, () => console.log(`Listening on 🚢 ${port} (●'◡'●)`));