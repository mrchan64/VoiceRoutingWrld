var S2T = require('./lib/speechToText'),
    TSA = require('./lib/textSiftAlgo'),
    EXS = require('./lib/expressServer');

/*var mic = new S2T.MicrophoneProcess();
console.log('started')

setTimeout(function(){
  console.log('ending')
  mic.end(console.log);
}, 5000);*/

EXS.bscallback = function(data){
  console.log('hiiiiii')
  var callback = function(string){
    console.log('sfsjdfojs '+string)
    EXS.wssconns.forEach(function(conn){
      conn.send(string);
      console.log('seeenddddd '+string)
    })
  }
  S2T.onceProcess(callback, {
    capture: 'buffer',
    buffer: data
  })
  console.log('oyyyyyyyy')
}

//test the sifting algorithm here
TSA.findCommand("");
