//Handles all the database Schema and creation of database 
const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema({
	sender  : String,		//Owner of the message
	rec 	: String,		//Receiver
	sub 	: String,		//Subjet of the email
	message : String,		//Message to be sent
	ms : Number,
	date   	: Date 		//Date to be executed on
})

const db = new mongoose.model("Mail_API" , dbSchema);

module.exports = {
	db  : db
}