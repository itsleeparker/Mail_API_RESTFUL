//Import all the features here 
const DB = require("../db").db;
const data  = require("../Features/Datahandler").data;
const publishQuene = require("../Features/Quene").quene;

//Function to take a data from database and put it inside the quene sorted by date
const refreshQuene = ()=>{
	//Delete all data from the quene if any 
	if(publishQuene.size() !== 0){
		data.delete();
	}
	//Fetch data from api and refresh the entry in quene 
	DB.find({}).sort({date : 1}).exec((err , results)=>{
		if(results){
			data.add(results);
		}
	})
}

//Start Code from  here

const triggerMail = async ()=>{
	return new promise((resolve  , reject)=>{
	  if(publishQuene.isEmpty()){
	  		reject(new Error("No Task Found to send "));
	  		return reject;
	  }		
  	  const {sender ,  sub , rec , message , date} = publishQuene.denque();
  	  //get the milliseconds difference
  	  var totalTime = new Date - Date(date);
  	  setTimeout((e)=>{
  	  	console.log("Its Time");		//Replace this with mailer
  	  	resolve(callback);	
  	  } , totalTime);
	})

}

const post = (req , res)=>{
	//get all the queries
	const info = new DB({
		sender  : req.query.sender,
		rec     : req.query.rec,
		sub     : req.query.sub,
		message : req.query.message,
		date 	: req.query.date,
		status  : 200
	});

	info.save(err=>{
		if(!err){
			console.log("Data saved " , info);
			res.json(info);
			refreshQuene();

		}else{
			console.log(err);
			res.json({err:  "Error Occcured While sending the data ", status : 400});
		}
	})
}


module.exports = {
	post : post
}