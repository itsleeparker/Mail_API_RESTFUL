//Import all the features here 
const DB = require("../db").db;
const data  = require("../Features/Datahandler").data;
const publishQuene = require("../Features/Quene").quene;
const mail = require("../Features/email").mailer;
const dayjs = require("dayjs");
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const getMilliSeconds = (date)=>{
	const newDate = dayjs(date);
	const cDate = dayjs(new Date()).tz("Asia/Kolkata");
	console.log("Current time  ", cDate.format());
	const diff = newDate.diff(cDate);
	return diff;
}

const deleteDb = (queneId)=>{
	 DB.deleteOne({_id : queneId} , (err , results)=>{
		if(!err){
			return true;
		}else{
			return false;
		}
	})
}

const refreshQuene = ()=>{
	//Delete all data from the quene if any 
	if(publishQuene.size() > 0){
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
	  if(publishQuene.size() <=0){
	  	reject(new Error("Qune is empty"));
	  }
	  var count = 0 ;			
  	  var {_id , date  , message , sub , sender , rec} = publishQuene.denque();
  	  const timeout = getMilliSeconds(new Date(date));
	  console.log(`trigger in  ${count}: `, timeout);
  	  setTimeout(()=>{
  	  	mail(sender  , rec , sub  , message);		//Replace this with mailer
  	  	if(deleteDb(_id)){
  	  		reject(new Error("Error While deleting the data"));
  	  	}else{
  	  		count ++ ;
			resolve(trigger);					//Problem resolved
  	  	}
  	  },timeout);
	})
}


const trigger = ()=>{
	triggerMail().finally(e=>{
				console.log("Request processed");
			}).then(resolve=>{
				resolve();
			}).catch(reject=>{
				console.log("Error Occurred   " , reject);
				return;
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