var S2T = require('./lib/speechToText'),
    TSA = require('./lib/textSiftAlgo'),
    EXS = require('./lib/expressServer'),
    TSS = require('./lib/twitterServerSearch')

/*var mic = new S2T.MicrophoneProcess();
console.log('started')

setTimeout(function(){
  console.log('ending')
  mic.end(console.log);
}, 5000);*/

EXS.bscallback = function(data){
  var callback = function(string){
    var command = TSA.findCommand(string);
    console.log("ALERT: Sending String: "+string)
    console.log("ALERT: Found Commands: "+command)
    EXS.wssconns.forEach(function(conn){
      conn.send(JSON.stringify({interp: string, command: command}));
    })
  }
  S2T.onceProcess(callback, {
    capture: 'buffer',
    buffer: data
  })
}

EXS.app.post('/twitter', function(req, res){
  var callback = function(statuses){
    res.json(statuses);
  };
  TSS.searchQ(req.body.query, req.body.lat, req.body.lng, req.body.r, callback);
})

//test the sifting algorithm here
//TSA.findCommand("");
