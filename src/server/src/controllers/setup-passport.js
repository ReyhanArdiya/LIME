import GoogleStrategy from "passport-google-oauth2";
import LocalStrategy from "passport-local";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const createLocalStrategy = () => {
	const authLocalStrategy = async (username, password, done) => {
		try {
			const user = await User.findOne({ username });

			if (!user) {
				done(null, null);
			} else {
				const res = await bcrypt.compare(
					password,
					user.accounts.local?.password
				);

				if (res) {
					done(null, user);
				} else {
					done(null, false);
				}
			}
		} catch (err) {
			done(err);
		}
	};

	return new LocalStrategy(authLocalStrategy);
};

const serializeLocalStrategy = (user, done) => {
	done(
		null,
		{
			id       : user._id,
			provider : user.accounts.local.provider
		}
	);
};

const deserializeLocalStrategy = async (localUser, done) => {
	try {
		const { id } = localUser;
		const user = await User.findById(id);
		const { local } = user.accounts;
		const reqUser = {
			...local,
			_id : user._id
		};
		delete reqUser.password;
		done(null, reqUser);
	} catch (err) {
		done(err);
	}
};

const createGoogleStrategy = () => {
	const authGoogleStrategy = async (
		_request,
		accessToken,
		_refreshToken,
		profile,
		done
	) => {
		try {
			const { id, email } = profile;
			const user = await User.findOne({
				"accounts.google.email" : email,
				"accounts.google.id"    : id
			});
			if (!user) {
				const newUser = new User({
					accounts : {
						google : {
							email,
							id,
							provider : "google",
							token    : accessToken,
						}
					},
					// TODO need to find out how to update this later
					username : `${Math.random() * 230}name`
				});

				done(null, await newUser.save());
			} else {
				done(null, user);
			}
		} catch (err) {
			done(err);
		}
	};

	return new GoogleStrategy(
		{
			callbackURL       : `/user${process.env.GOOGLE_AUTH_CB}`,
			clientID          : process.env.GOOGLE_CLIENT_ID,
			clientSecret      : process.env.GOOGLE_CLIENT_SECRET,
			passReqToCallback : true
		},
		authGoogleStrategy
	);
};

const serializeGoogleStrategy = (user, done) => {
	if (user.accounts.google?.provider === "google") {
		done(
			null,
			{
				id       : user.accounts.google.id,
				provider : user.accounts.google.provider
			}
		);
	} else {
		done("pass");
	}
};

const deserializeGoogleStrategy = async (googleUser, done) => {
	try {
		if (googleUser.provider === "google") {
			const { id } = googleUser;
			const user = await User.findOne({ "accounts.google.id" : id });
			const { google } = user.accounts;
			const reqUser = {
				...google,
				_id : user._id
			};
			done(null, reqUser);
		} else {
			done("pass");
		}
	} catch (err) {
		done(err);
	}
};

const setupPassport = passport => {
	// Google strategy
	passport.use(createGoogleStrategy());
	passport.serializeUser(serializeGoogleStrategy);
	passport.deserializeUser(deserializeGoogleStrategy);

	// Local strategy
	passport.use(createLocalStrategy());
	passport.serializeUser(serializeLocalStrategy);
	passport.deserializeUser(deserializeLocalStrategy);
};

export default setupPassport;