
// command -> array 
	//			  0th entry is the type ()
	//			  Rest depends on the command

	// routing command -> type=0
	//	1st index -> from destination
	//  2nd index -> to destination

regexPatts = [/^.*from\s*(.*)\s*to\s*(.*)\s*$/,
			/^.*to\s*(.*)\s*from\s*(.*)\s*$/,
			/^.*to\s*(.*)\s*$/,

			
			];



exports.findCommand = function(inputString){

	// For loop tries all the regexPatts in order
	// matching regex's pattern assigned to 'index'
	for (var i = 0; i < regexPatts.length; i += 1) {
		console.log("asdf")
		var match = regexPatts[i].exec(inputString)
		if (match) {
			var index = i;
			break
		}
	}
	
	// This array contains the command itself
	// represented as an array
	// 0th index -> the type
	// rest -> information needed for the command
	var returnArr = [];

	//TYPES:
	//0 -> From, To -> [type,fromDest,toDest]
	//1 -> To -> [type, toDest]
	switch (index) {
		case 0:
			// this is the routing from - to command
			returnArr.push(0);//Type -> 0 (From, To)
			returnArr.push(match[1]); //From destination
			returnArr.push(match[2]); //To destination
			//returnArr = [type,fromDest,toDest]
			break
		case 1: //TODO: FORMATTING!
			// this is the routing from - to command
			returnArr.push(0);//Type -> 0 (From, To)
			returnArr.push(match[2]); //To destination
			returnArr.push(match[1]); //From destination
			//returnArr = [type,fromDest,toDest]
			break
		case 2:
			// this is the routing current - to command
			returnArr.push(1);//Type -> 1 (To)
			returnArr.push(match[1]); //ToDest
			//returnArr = [type,toDest]
			break
	}
	
	return returnArr
}