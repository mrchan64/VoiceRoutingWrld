
// command -> array 
	//			  0th entry is the type ()
	//			  Rest depends on the command

	// routing command -> type=0
	//	1st index -> from destination
	//  2nd index -> to destination

regexPatts = [/^.*to\s*(.*)\s*$/,
			];




exports.findCommand = function(inputString){

	for (var i = 0; i < regexPatts.length; i += 1) {
		console.log("asdf")
		var match = TOregPatt.exec(inputString)
		if (match) {
			var index = i;
			break
		}
	}
	
	if (index === 0) {
		
	}



	var command = ""
	
	return command
}