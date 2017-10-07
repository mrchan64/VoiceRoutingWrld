var micbutton = $('#recorder');
var whiteone = $('#whiteone');
whiteone.css('background-color', 'white')
var micdiv = $('#voice')

micdiv.css('left', ($(window).width()-micdiv.width())/2)

var colorChangeSpeed = 500
var divHeightChangeSpeed = 650 

var recording = false
var pulse = null

var recorder = null;
var usermedia = navigator.getUserMedia({audio: true}, function(stream){
	recorder = new RecordAudio(stream);
}, function(error){})

micbutton.on('mouseover', function(){
	if (recording) return
	console.log('in')
	whiteone.stop();
	whiteone.animate({
		'opacity': '0'
	}, colorChangeSpeed);
	micdiv.stop();
	micdiv.animate({
		'height': '180px'
	}, divHeightChangeSpeed);
})
micbutton.on('mouseout', function(){
	if (recording) return
	console.log('out')
	whiteone.stop();
	whiteone.animate({
		'opacity': '1'
	}, colorChangeSpeed);
	micdiv.stop();
	micdiv.animate({
		'height': '0px'
	}, divHeightChangeSpeed);
})
micbutton.on('click', function(){
	if (!recording) {
		recording = true;
		pulseAnimation();
		pulse = setInterval(pulseAnimation, colorChangeSpeed);
		recorder.start();
	} else {
		//recording = false;
		clearInterval(pulse);
		whiteone.stop();
		whiteone.css({
			'opacity': '0'
		});
		recording = false;
		recorder.end();
	}
})
function pulseAnimation(){
	whiteone.stop();
	whiteone.animate({
		'opacity': '.5'
	}, colorChangeSpeed/2);
	setTimeout(function() {
		whiteone.stop();
		whiteone.animate({
			'opacity': '0'
		}, colorChangeSpeed/2);
	}, colorChangeSpeed/2);
}

function RecordAudio(stream, cfg) {

	var context = new AudioContext();
	var source = context.createMediaStreamSource(stream);
    var recLength = 0,
      recBuffers = [];

    // create a ScriptProcessorNode
    if(!context.createScriptProcessor){
       this.node = context.createJavaScriptNode(4096, 1, 1);
    } else {
       this.node = context.createScriptProcessor(4096, 1, 1);
    }

    // listen to the audio data, and record into the buffer
    this.node.onaudioprocess = function(e){
    	if(!recording)return;
      recBuffers.push(e.inputBuffer.getChannelData(0));
      recLength += e.inputBuffer.getChannelData(0).length;
    }

    // connect the ScriptProcessorNode with the input audio
    source.connect(this.node);
    // if the ScriptProcessorNode is not connected to an output the "onaudioprocess" event is not triggered in chrome
    this.node.connect(context.destination);

    this.start = function(){
    	recLength = 0;
    	recBuffers = [];
    }
    this.end = function(){
    	return recBuffers;
    }
}