import "dotenv/config";
import GoogleStrategy from "passport-google-oauth2";
import User from "./models/user.js";
import express from "express";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import userRouter from "./routers/user.js";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// TODO seperate the passport stuff into another file
// Passport stuff
app.use(passport.initialize());
app.use(passport.session());

passport.use(/* TODO local strategy here */);
passport.use(new GoogleStrategy(
	{
		callbackURL       : `/user${process.env.GOOGLE_AUTH_CB}`,
		clientID          : process.env.GOOGLE_CLIENT_ID,
		clientSecret      : process.env.GOOGLE_CLIENT_SECRET,
		passReqToCallback : true
	},
	(request, accessToken, refreshToken, profile, done) => {
		return done(null, profile);
	}
));

// Google de/serializers
passport.serializeUser((user, done) => {
	if (user.provider === "google") {
		done(null, user);
	} else {
		done("pass");
	}
});
passport.deserializeUser((user, done) => {
	if (user.provider === "google") {
		done(null, user);
	} else {
		done("pass");
	}
});

// Local de/serializers
passport.serializeUser(/* TODO local strategy here */);
passport.deserializeUser(/* TODO local strategy here */);

app.use((req, res, next) => {
	console.log(
		"🌟 You got a new request! ( *≧◡≦)~💌 \\(￣▽￣* )ゞ 🌟",
		`⌚ ${new Date()
			.toLocaleString()} ⌚`,
		// req.session,
		// req.user
	);
	next();
});


if (process.env.NODE_ENV !== "production") {
	app.get("/", (req, res) => {
		res.sendFile(join(__dirname, "./tests/test.html"));

	});
}

// Use routers
app.use("/user", userRouter);

app.listen(port, () => console.log(`Listening on 🚢 ${port} (●'◡'●)`));