var micbutton = $('#recorder');
var whiteone = $('#whiteone');
var loadsym = $('#loadsymbol');
var display = $('#display');
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

mouseOutOn();

micbutton.on('click', function(){
	//micbutton.off('mouseout');
	if (!recording) {
		recording = true;
		pulseAnimation();
		pulse = setInterval(pulseAnimation, colorChangeSpeed);
		recorder.start();
	} else {
		//recording ended by click
		recording = false;

		//ends the animation
		clearInterval(pulse);
		whiteone.stop();
		whiteone.css({
			'opacity': '0'
		});
		recording = false;
		var buffer = recorder.end();
		startLoadSym(); //starts the loading symbol
		console.log(buffer);
		$.ajax({
			url:"/speechtotext",
			data:{buffer:buffer},
			success:function(data){
				display.html(data.text);
				endLoadSym();
			},
			error:function(){
				console.log("error u suck");
			},
			method:"POST"
		})

	}
})

function mouseOutOn(){
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
}

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
      recBuffers = ArrayBuffer(0);

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
    	console.log(recBuffers);
    	return recBuffers;
    }
}
function getRequest(){
	//server request -> gets text
	setTimeout()
}

function startLoadSym(){
	micbutton.off('mouseout');
	loadsym.animate({
		'opacity': '1'
	}, colorChangeSpeed);
	loadsym.css({"-webkit-animation": "rotate 2s infinite linear"})
}

function endLoadSym(){
	mouseOutOn();
	loadsym.animate({
		'opacity': '0'
	}, colorChangeSpeed);
	loadsym.css({"-webkit-animation": "none"})
}