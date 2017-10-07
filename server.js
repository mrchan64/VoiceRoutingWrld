var S2T = require('./lib/speechToText'),
    TSA = require('./lib/textSiftAlgo');
    EXS = require('./lib/expressServer')

/*var mic = new S2T.MicrophoneProcess();
console.log('started')

setTimeout(function(){
  console.log('ending')
  mic.end(console.log);
}, 5000);*/

EXS.app.post('/speechtotext', function(req,res){
  function callback(inputString){
  	var obj = {text: inputString};
  	res.sendJSON(obj);
  }
  var b = req.body.buffer;
  console.log(req.body);
  S2T.onceProcess(callback, {capture: "buffer", buffer: b});
})

//test the sifting algorithm here
TSA.findCommand("");