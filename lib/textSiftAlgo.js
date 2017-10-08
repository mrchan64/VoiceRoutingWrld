// Determines type of command and plucks keywords (beginning, destination, etc.) from input string
/*
 COMMAND TYPES {					{RETURN FIELDS}
	0: Single location lookup; 		[0, DESTS]
	1: Double-ended route; 			[1, START, DEST]
	2: Route from current location;	[2, DEST]
	3: Nearby points of interest;	[3]
	4: "Take me there", highlighted location;	[4]
 } 
*/

// Potential bug: for nearby, may need to remove 's' at end of location if no results.

// Matches key words and captures groups such as DEST
var locationExc = "here|my.* location|me|where I am" //accounting for 'my current location'
regexPatts = [ /^.*[Ww]here\s(?:is\s)*(.*?)(?:\sis)*\s*$/,		// Single location lookup
			/^.*[Ff]rom\s(?!${locationExc}\s)(.*)\sto\s(.*)\s*$/, 	// Double-ended route
			/^.*[Tt]o\s(.*)\sfrom\s(${locationExc})(.*)\s*$/,	// Double-ended route
			/^.*to\s(.*(?!\sfrom ${locationExc}))\s*$/,			// Route from curr location  NEEDS FIXING
			/^.*(?:nearby|near).*$/,							// Nearby location lookup
			/^\s*[Tt]ake\sme\sthere\s*/							// Single location routing to highlighted location
			];

exports.findCommand = function(inputString){

	// For loop tries all the regexPatts in order and stops on first match
	// matching regex's pattern assigned to 'index'
	// Captured groups assigned to match[1] and on, depending on number of groups
	for (var i = 0; i < regexPatts.length; i += 1) {
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
			break;
		case 1:
			// ROUTE: from START to DEST
			returnArr.push(1);
			returnArr.push(match[1]); //From START
			returnArr.push(match[2]); //To DEST
			//returnArr = [cmdType,START,DEST]
			break;
		case 2:
			// ROUTE: to DEST from START
			returnArr.push(1);
			returnArr.push(match[2]); //To DEST
			returnArr.push(match[1]); //From START
			//returnArr = [cmdType,START,DEST]
			break;
		case 3:
			// ROUTE: from curr location to DEST
			returnArr.push(2);
			returnArr.push(match[1]); //To DEST
			//returnArr = [cmdType,DEST]
			break;
		case 4:
			// NEARBY: shows all nearby points of interest
			returnArr.push(3);
			//returnArr = [cmdType,LOCATION]
			break;
		case 5:
			// ROUTE: from curr location to highlighted location
			returnArr.push(4);
	}
	return returnArr
}


var inputString = "Take me to El Dorado"
var cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Take me from my current location to El Dorado"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

// NEEDS FIXING
inputString = "Take me to El Dorado from here"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Where is El Dorado"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Tell me where El Dorado is"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Show me all nearby El Dorados"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Take me from Evans to El Dorado"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

inputString = "Take me there"
cmd = exports.findCommand(inputString);
console.log("\"" + inputString + "\"")
console.log(cmd);

