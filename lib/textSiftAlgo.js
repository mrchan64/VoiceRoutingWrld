




exports.findCommand = function(inputString){
	var cmd = new Array(4);
	//command[0] is command type

	//command[0] = 0. Route.
	//cmd[1] = start, cmd[2] = dest

	target = /[me,get] to (.+)/;
	cmd[2] = target.exec(inputString);
	console.log(cmd[2]);


	return cmd;
}
var cmd = exports.findCommand("Take me to El Dorado");

/*
	inputString = "Take me to El Dorado"
	var newcommand = [];
	target = /to (.+)$/;
	newcommand[2] = target.exec(inputString);
	console.log(newcommand[1]);
*/

