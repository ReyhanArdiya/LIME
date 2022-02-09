import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

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

app.use((req, res, next) => {
	console.log(
		"🌟 You got a new request! ( *≧◡≦)~💌 \\(￣▽￣* )ゞ 🌟",
		`⌚ ${new Date()
			.toLocaleString()} ⌚`
	);
	next();
});


app.listen(port, () => console.log(`Listening on 🚢 ${port} (●'◡'●)`));