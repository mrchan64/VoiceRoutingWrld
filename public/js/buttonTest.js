var micbutton = $('#recorder');
var whiteone = $('#whiteone');
whiteone.css('background-color', 'white')
var micdiv = $('#voice')

micdiv.css('left', ($(window).width()-micdiv.width())/2)

var colorChangeSpeed = 500
var divHeightChangeSpeed = 650 

var recording = false
var pulse = null

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
	} else {
		//recording = false;
		clearInterval(pulse);
		whiteone.stop();
		whiteone.css({
			'opacity': '0'
		});
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