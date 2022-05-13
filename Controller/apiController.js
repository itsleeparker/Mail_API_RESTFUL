//Import all the features here 
const DB = require("../db").db;
const data  = require("../Features/Datahandler").data;
const publishQuene = require("../Features/Quene").quene;	
const moment = require("moment")
const preciseDiff = require("moment-precise-range-plugin");

const getSeconds = (date2)=>{
	const d1 = moment();
	const d2 = moment(date2);
	const diff = moment.preciseDiff(d2 , d1 ,true);
	console.log(diff);
	console.log(diff.seconds * 1000);
}	

//Function to take a data from database and put it inside the quene sorted by date
const refreshQuene = async()=>{
	//Delete all data from the quene if any 
	if(publishQuene.size() !== 0){
		data.delete();
	}
	//Fetch data from api and refresh the entry in quene 
	DB.find({}).sort({date : 1}).exec((err , results)=>{
		if(results){
			data.add(results);			
			trigger();				//After adding all the request to quene add trigger the request 
		}else{
			console.log("No Request found to post");
		}
	})
}

//Start Code from  here
const triggerMail = ()=>{
	return new Promise((resolve  , reject)=>{
	  if(publishQuene.isEmpty()){
	  	 console.log("Quene is emptyy");
	  	 return;
	  }		
  	  var {sender ,  sub , rec , message , date , ms} = publishQuene.denque();
 	  console.log(ms);
  	  setTimeout(()=>{
  	  	console.log("Its Time");		//Replace this with mailer
  	  	resolve();						//Problem resolved
  	  },ms);
	})

}


const trigger = async ()=>{
	triggerMail().finally(e=>{
				console.log("Request processed");
			}).then(resolve=>{
					publishQuene.denque();																//Write a feature here to delete the data from the program
					trigger();		
			})
}


const post = (req , res)=>{
	const second = getSeconds(req.query.date);
	//get all the queries
	const info = new DB({
		sender  : req.query.sender,
		rec     : req.query.rec,
		sub     : req.query.sub,
		message : req.query.message,
		date 	: req.query.date,
		ms 		:  second,
		status  : 200
	});

	info.save(err=>{
		if(!err){
			console.log("Data saved " , info);
			res.json(info);
			// refreshQuene();
		}else{
			console.log(err);
			res.json({err:  "Error Occcured While sending the data ", status : 400});
		}
	})
}


module.exports = {
	post : post
}