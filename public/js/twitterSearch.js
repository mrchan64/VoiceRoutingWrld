var xhr = new XMLHttpRequest();
xhr.open('GET', "api.twitter.com", true);
xhr.send();

xhr.onreadystatechange = processRequest;
 
function processRequest(e) {
	if (xhr.readyState == 4){
		if (xhr.status == 200) {
			var response = JSON.parse(xhr.responseText)
		} else {
			console.log("ERROR CODE: " + str(xhr.status))
		}
	}
}