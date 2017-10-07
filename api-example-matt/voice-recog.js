var speech = require('@google-cloud/speech')({
  keyFilename: './SpeechToTextCalhacks-ec5d9b7a27ed.json'
});
var fs = require('fs');
var Mic = require('node-microphone');

var stream = speech.streamingRecognize({
  config: {
    encoding: 'LINEAR16',
    languageCode: 'en-US',
    sampleRateHertz: 44100,
  },
}).on('data', function(response) {
  // doThingsWith(response);
  console.log(response.results[0].alternatives[0].transcript);
});

var mic = new Mic();
setTimeout(() => {
    console.log('stopped recording');
    mic.stopRecording();
}, 3000);
var micstream = mic.startRecording();
micstream.on('data', (info) => {
  //console.log("info"+info);
  //fs.appendFile('test2.wav', info);
  stream.write(info);
});
mic.on('error', (error) => {
  console.log('an error occured '+ error);
});
console.log("started recording")

var requestFromFile = function(filename){
  var audioBuffer = fs.readFileSync(filename).toString('base64');
  return audioBuffer;
}

var request = requestFromFile('test.wav');

/*request.config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: 'en-US'
}*/

// Write request objects.
//stream.write(request);

/*speech.recognize(request)
  .then((results) => {
    const transcription = results[0].results[0].alternatives[0].transcript;
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });*/