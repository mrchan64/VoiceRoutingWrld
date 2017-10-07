
// command -> array 
	//			  0th entry is the type ()
	//			  Rest depends on the command

	// routing command -> type=0
	//	1st index -> from destination
	//  2nd index -> to destination

regexPatts = [ /^.*where\s(?:is)\s*(.*)\s(?:is)\s*$/,
			/^.*to\s*(.*)\s*$/,
			/^.*from\s*(.*)\s*to\s*(.*)\s*$/,
			/^.*to\s*(.*)\s*from\s*(.*)\s*$/,
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

	switch (index) {
		case 0:
			//LOOKUP: DEST
			returnArr.push(match[1])
		case 1:
			// ROUTE: from currLocation to DEST
			returnArr.push(match[1]); //ToDest
			//returnArr = [type,DEST]
			break
		case 2:
			// ROUTE: from START to DEST
			returnArr.push(match[1]); //From START
			returnArr.push(match[2]); //To DEST
			//returnArr = [type,START,DEST]
			break
		case 3: 
			// ROUTE: to DEST from START
			returnArr.push(match[2]); //To DEST
			returnArr.push(match[1]); //From START
			//returnArr = [type,START,DEST]
			break
		case 4:
	}
	
<<<<<<< HEAD
	return command
}

inputString = "Take me to El Dorado"
var cmd = exports.findCommand(inputString);
console.log(cmd);
=======
	return returnArr
}
>>>>>>> 16c9fd4eb8a9e7fddc6488e8e00a44decde0e3df
