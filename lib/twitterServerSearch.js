var https = require('https');
var oauthSignature = require('oauth-signature');



exports.searchQ = function(query, lat, long, r){
	//r in miles
	query = encodeURIComponent(query);
	var host="api.twitter.com"
	var path="/1.1/search/tweets.json"
	var addon="q=" + query + "&geocode=" + lat + "," + long + "," + r + "mi";
	var url = "https://" + host + path
	//ADD OTHER PARAMETERS????
	//TODO Above

	var httpMethod = "GET";
	var oauth_consumer_key="KDcG16JeLVDLYvTPrdj34a0hE";
	var oauth_nonce=generateRndToken();
	var oauth_signature_method="HMAC-SHA1";
	var oauth_timestamp=String(Math.floor((new Date).getTime()/1000));
	var oauth_token="916639838891261952-8W7tmA9P3G0lfjrfZoQrlHzJjZy4qFW";
	var oauth_version="1.0";
	var consumerSecret="wDGpKOBjfHBl2yJ5176tRhHIg2aCVbbcJnSfiAILPTEuiUbml5";
	var tokenSecret="rU86ZdpD2zswihe3OjS1u6MVkfZHb5TxJdXbbfzvE7pXr";

	var parameters={
		oauth_consumer_key : oauth_consumer_key,
		oauth_token : oauth_token,
		oauth_nonce : oauth_nonce,
		oauth_timestamp : oauth_timestamp,
		oauth_signature_method : oauth_signature_method,
		oauth_version : oauth_version,
		q: query,
		geocode: lat + "," + long + "," + r + "mi"
	}

	var oauth_signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: true});

	console.log(oauth_signature);

	path = path + "?" + authorizationStrGen(oauth_consumer_key, oauth_nonce, oauth_signature, oauth_signature_method, oauth_timestamp, oauth_token, oauth_version,"&",false) + "&" + addon;
	
	var options = {
		headers:{
			Authorization: "OAuth " + authorizationStrGen(oauth_consumer_key, oauth_nonce, oauth_signature, oauth_signature_method, oauth_timestamp, oauth_token, oauth_version,",",true)//,
			//"Content-Length": 7
		},
		host: host,
		method:httpMethod,
		path: path
		
	}

	var post = https.request(options, function(resp){
		console.log(resp.statusCode);
		var total = "";
		resp.on('data', function(chunk){
			total+=chunk;
		});
		resp.on('end', function(){
			console.log(extractStatuses(JSON.parse(total)));
		})
	}).on('error', function(e){
		console.log("error")
		console.log("Got error: "+ e.message);
	});

	post.end();
}




function extractStatuses(obj){
	var message = [];
	obj.statuses.forEach(function(status){
		message.push({text: status.text, count: status.retweet_count})
	})
	message.sort(function(a,b){
		return b.count - a.count
	})
	return message;
}

function generateRndToken(){
	var allChar = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var returnStr = "";
	for (var i = 0; i < 32; i += 1) {
		returnStr += allChar[Math.floor(Math.random()*allChar.length)];
	}
	return returnStr;
}

function authorizationStrGen(consumerKey, nonce, sig, sigMeth, timeSec, token, version, separator, qmark){
	var returnstr=  (//'OAuth ' + 
			'oauth_consumer_key="' + consumerKey + '",' +
			'oauth_token="' + token + '",' +
			'oauth_signature_method="' + sigMeth + '",' +
			'oauth_timestamp="' + timeSec + '",' +
			'oauth_nonce="' + nonce + '",' +
			'oauth_version="' + version + '",' +
			'oauth_signature="' + sig + '"').split(",").join(separator);
	if (qmark) {
		return returnstr;
	} else {
		return returnstr.split('"').join("");
	}

}


// searchQ("school", 37.753634,-122.399659, 100);
// console.log(generateRndToken());