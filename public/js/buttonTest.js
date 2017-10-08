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

var recorder = new RecordAudio();
var receiver = new WebSocket('ws://localhost:3000');
receiver.addEventListener('message', function(event){
	console.log(event.data);
	display.html(event.data.interp)
	endLoadSym();
})

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
		startLoadSym(); //starts the loading symbol
		recorder.end();
		//computation.send(buffer);

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

function RecordAudio() {
	var link = 'ws'+String(window.location).replace('http','')+'computation';
	console.log(link)
  var client = new BinaryClient(link);
  var that = this;

  client.on('open', function() {
    var Stream = that.Stream = client.createStream();

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, success, function(e) {
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');

    var recording = false;

    that.start = function() {
      recording = true;
    }

    that.end = function() {
      recording = false;
      Stream.end();
    }

    function success(e) {
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext();

      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      proc = context.createScriptProcessor(bufferSize, 1, 1);

      proc.onaudioprocess = function(e){
        if(!recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        Stream.write(convertoFloat32ToInt16(left));
      }

      audioInput.connect(proc)
      proc.connect(context.destination); 
    }

    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)

      while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
      }
      return buf.buffer
    }
  });
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