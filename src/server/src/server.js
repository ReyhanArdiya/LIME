import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== "production") {
	(await import("dotenv")).config({ path : join(__dirname, "") });
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