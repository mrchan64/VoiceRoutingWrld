var Speech = require('@google-cloud/speech')({
  keyFilename: './SpeechToTextKey.json'
});
var fs  = require('fs'),
    Mic = require('node-microphone');

exports.config = {
  encoding: 'LINEAR16',
  languageCode: 'en-US',
  sampleRateHertz: 44100,
}

var audioFromFile = function(filename) {
  var audioBuffer = fs.readFileSync(filename).toString('base64');
  return {
    audio: {
      content: audioBuffer
    },
    config: exports.config
  }
}

var audioFromStream = function(buffer) {
  return {
    audio: {
      content: buffer
    },
    config: exports.config
  }
}

var audioFromMic = function(timeout) {
  console.log('mic support not done yet lel');
}

exports.onceProcess = function(callback, options) {
  var request = null;
  if(!callback || !options){
    console.log("ERROR: Need To Provide A Callback Function And Options Object");
    return;
  }
  switch(options.capture){
    //types can be 'file', 'mic', and 'buffer'
    case 'file':
      if(options.filename)request = audioFromFile(options.filename);
      else {
        console.log("ERROR: No Audio Filename Provided");
        return;
      }
      break;
    case 'mic':
      if(options.timeout)request = audioFromMic(options.timeout);
      else audioFromMic(5000);
      break;
    case 'buffer':
      if(options.buffer)request = audioFromStream(options.buffer);
      else {
        console.log("ERROR: No Audio Buffer Provided");
        return;
      }
      break;
    default:
      console.log("ERROR: No Valid Capture Field Detected.  Valid Capture Fields Are 'file', 'mic', and 'buffer'");
      return;
  }
  var promise = Speech.recognize(request)
    .then((results) => {
      try{
        var transcript = results[0].results[0].alternatives[0].transcript;
        callback(transcript);
      }catch(error){
        var transcript = "ERROR: No Transcript Found";
      }
      return transcript;
    });
  promise.catch((err) => {
    console.error('ERROR:', err);
  });
  return promise;
}

exports.MicrophoneProcess = function() {
  var mic = new Mic();
  var totalBuffer = new Buffer(0);
  var micProcess = mic.startRecording();
  micProcess.on('data', (info) => {
    totalBuffer = Buffer.concat([totalBuffer, info]);
  });
  mic.on('error', (error) => {
    console.log("Make sure you have SoX installed. if u on mac it prob brew install sox or some shit like that. -matt")
  });

  this.end = function(callback) {
    mic.stopRecording();
    exports.onceProcess(callback, {
      capture: 'buffer',
      buffer: totalBuffer
    })
  }
}