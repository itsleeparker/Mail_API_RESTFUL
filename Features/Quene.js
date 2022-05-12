//Reponsible for all the quene functions and maintaining a single quene 

function Quene(){
	const obj = {};
	var head = 0;
	var tail = 0;
	return{
		enque : (item)=>{
			obj[tail] = item;
			tail++
		},
		denque : ()=>{
			const size = tail - head;
			if(size <= 0 ) return undefined;

			var item = obj[head];
			delete obj[head];

			head++;

			//Check if the quene is empty
			if(tail === head){
				head = 0;
				tail = 0;
			}
			return item;
		},
		size : ()=>{
			return tail - head;
		},
		print : ()=>{
			var results = [];
			for(var i in obj){
				results.push(obj[i]);
			}

			return results;
		},
		isEmpty:()=>{
			if(head === tail)
				return true;
			else
				return false
		}
	}
}

const publishQuene = new Quene();


module.exports = {
	quene : publishQuene
}