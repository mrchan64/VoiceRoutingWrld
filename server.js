var S2T = require('./lib/speechToText'),
    TSA = require('./lib/textSiftAlgo');
    EXS = require('./lib/expressServer')

/*var mic = new S2T.MicrophoneProcess();
console.log('started')

setTimeout(function(){
  console.log('ending')
  mic.end(console.log);
}, 5000);*/

//test the sifting algorithm here
TSA.findCommand("");
