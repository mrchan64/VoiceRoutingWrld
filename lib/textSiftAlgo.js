// Matches key words and captures groups such as DEST
regexPatts = [ /^.*where\s(?:is)\s*(.*)\s(?:is)\s*$/,
			/^.*to\s*(.*)\s*$/,
			/^.*from\s*(.*)\s*to\s*(.*)\s*$/,
			/^.*to\s*(.*)\s*from\s*(.*)\s*$/,
			];



exports.findCommand = function(inputString){

	// For loop tries all the regexPatts in order and stops on first match
	// matching regex's pattern assigned to 'index'
	// Captured groups assigned to match[1] and on, depending on number of groups
	for (var i = 0; i < regexPatts.length; i += 1) {
		console.log("")
		var match = regexPatts[i].exec(inputString);
		if (match) {
			var index = i;
			break;
		}
	}
	
	// Contains command type and information related to command, such as DEST
	var returnArr = [];

	switch (index) {
		case 0:
			//LOOKUP: DEST
			returnArr.push(0);
			returnArr.push(match[1]);
			//returnArr = [cmdType,DEST]
		case 1:
			// ROUTE: from currLocation to DEST
			returnArr.push(1);
			returnArr.push(match[1]); //ToDest
			//returnArr = [cmdType,DEST]
			break
		case 2:
			// ROUTE: from START to DEST
			returnArr.push(2);
			returnArr.push(match[1]); //From START
			returnArr.push(match[2]); //To DEST
			//returnArr = [cmdType,START,DEST]
			break
		case 3: 
			// ROUTE: to DEST from START
			returnArr.push(3);
			returnArr.push(match[2]); //To DEST
			returnArr.push(match[1]); //From START
			//returnArr = [cmdType,START,DEST]
			break
		case 4:
	}
	return returnArr
}

inputString = "Take me to El Dorado"
var cmd = exports.findCommand(inputString);
console.log(cmd);

//>>>>>>> 16c9fd4eb8a9e7fddc6488e8e00a44decde0e3df
