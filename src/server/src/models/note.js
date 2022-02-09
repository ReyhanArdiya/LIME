import dateFormat from "dateformat";
import mongoose from "mongoose";

const DateSchema = new mongoose.Schema({
	_created : {
		default  : Date.now(),
		required : true,
		type     : Number
	},
	_modified : {
		required : true,
		type     : Number
	}
}, { strict : "throw" });

class DateSchemaMethods {
	get created() {
		return dateFormat(this._created, "h:MM:ss TT dddd mmmm yyyy");
	}

	get modified() {
		return dateFormat(this._modified, "h:MM:ss TT dddd mmmm yyyy");
	}
}
DateSchema.loadClass(DateSchemaMethods);

const NoteSchema = new mongoose.Schema({
	date : {
		default : {},
		type    : DateSchema
	},
	text : {
		default : "",
		type    : String
	},
	user : {
		ref      : "User",
		required : true,
		type     : mongoose.Schema.Types.ObjectId
	}
}, { strict : "throw" });

const Note = mongoose.model("Note", NoteSchema);

export default Note;

