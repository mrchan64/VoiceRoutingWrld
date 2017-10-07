var apiKey = "60308764d26b82e014649973d6901157";

var map = L.Wrld.map("map", apiKey);

//var speedometer = document.getElementById('speedometer');
/*
window.onkeydown = function(e) {
  var key = e.keyCode || e.which;
  if(key == 32){
    window.game = new Game();
  }
  if(key == 37){
    //left
    window.game.leftDown();
  }
  if(key == 38){
    //up
    window.game.forwardDown();
  }
  if(key == 39){
    //right
    window.game.rightDown();
  }
  if(key == 40){
    //down
    window.game.backwardDown();
  }
}
window.onkeyup = function(e) {
  var key = e.keyCode || e.which;
  if(key == 37){
    //left
    window.game.leftUp();
  }
  if(key == 38){
    //up
    window.game.forwardUp();
  }
  if(key == 39){
    //right
    window.game.rightUp();
  }
  if(key == 40){
    //down
    window.game.backwardUp();
  }
}

function Game(){
  var moveInterval = {min: .00005, max: .00009, inc: 1.05};
  var turnInterval = {min: 2, max: 2, inc: 1.00};
  var timeInterval = 30;
  var zoomInterval = 16;
  var triangLength = .00006;
  var trianglAngle = 150 * Math.PI/180;
  var movementObj = this.movementObj = {};
  var polyRep = this.polyRep = {};
  movementObj.center = [37.506389, -121.927350];
  movementObj.facing = 0;
  map.setView(movementObj.center, zoomInterval);
  map.setCameraHeadingDegrees(movementObj.facing);
  movementObj.getSpeStr = function(){
    var ret = String(Math.floor(movementObj.speed*10000000 || 0));
    while(ret.length<3){
      ret = "0"+ret;
    }
    return ret;
  }
  movementObj.getAngStr = function(){
    var ret = String(Math.floor(movementObj.turn*100 || 0)/100);
    while(ret.length<6){
      ret = "0"+ret;
    }
    return ret;
  }
  movementObj.update = function(){
    map.setView(movementObj.center, zoomInterval, {
      'headingDegrees': movementObj.facing,
      'animate': false
    });
    polyRep.update();
    speedometer.innerHTML = "Sp | "+movementObj.getSpeStr()+" | Ang | "+movementObj.getAngStr();
    //setTimeout(movementObj.update.bind(movementObj), timeInterval);
  }
  movementObj.changeCenter = function(lat, lng){
    movementObj.center[0]+=lat;
    movementObj.center[1]+=lng;
  }
  movementObj.changeDirection = function(change){
    movementObj.facing = ((movementObj.facing+change)%360 + 360)%360;
  }
  polyRep.points = [];
  polyRep.update = function(){
    if(polyRep.floating)polyRep.floating.removeFromMap();
    var lat = movementObj.center[0];
    var lng = movementObj.center[1];
    var the = -facingRadians();
    var d = triangLength;
    var phi = trianglAngle;
    polyRep.points[0] = [lat+d*Math.cos(the), lng-d*Math.sin(the)];
    polyRep.points[1] = [lat+d*Math.cos(the+phi), lng-d*Math.sin(the+phi)];
    polyRep.points[2] = [lat+d*Math.cos(the-phi), lng-d*Math.sin(the-phi)];
    polyRep.floating = L.Wrld.polygon(polyRep.points, {"altitudeOffset":10, "offsetFromSeaLevel":false}).setColor([1.0,0.0,0.0,0.5]).addTo(map);
  }

  this.moveForward = function(){
    if(!this.forward)return;
    var lat = movementObj.speed*Math.cos(facingRadians());
    var lng = movementObj.speed*Math.sin(facingRadians());
    movementObj.changeCenter(lat, lng);
    movementObj.speed = movementObj.speed*moveInterval.inc<moveInterval.max ? movementObj.speed*moveInterval.inc : moveInterval.max;
    this.forwardInterval = setTimeout(this.moveForward.bind(this), timeInterval);
  }
  this.forwardDown = function(){
    var current = this.forward;
    this.backward = false;
    this.forward = true;
    if(!current)movementObj.speed = moveInterval.min;
    if(!current)this.moveForward();
  }
  this.forwardUp = function(){
    if(this.forward)movementObj.speed = 0
    this.forward = false;
    clearInterval(this.forwardInterval)
  }

  this.moveBackward = function(){
    if(!this.backward)return;
    var lat = movementObj.speed*Math.cos(facingRadians());
    var lng = movementObj.speed*Math.sin(facingRadians());
    movementObj.changeCenter(lat, lng);
    movementObj.speed = movementObj.speed*moveInterval.inc>-moveInterval.max ? movementObj.speed*moveInterval.inc : -moveInterval.max;
    this.backwardInterval = setTimeout(this.moveBackward.bind(this), timeInterval);
  }
  this.backwardDown = function(){
    var current = this.backward;
    this.forward = false;
    this.backward = true;
    if(!current)movementObj.speed = -moveInterval.min;
    if(!current)this.moveBackward();
  }
  this.backwardUp = function(){
    if(this.backward)movementObj.speed = 0;
    this.backward = false;
    clearInterval(this.backwardInterval)
  }

  this.moveLeft = function(){
    if(!this.left)return;
    movementObj.changeDirection(movementObj.turn);
    movementObj.turn = movementObj.turn*turnInterval.inc>-turnInterval.max ? movementObj.turn*turnInterval.inc : -turnInterval.max;
    this.leftInterval = setTimeout(this.moveLeft.bind(this), timeInterval);
  }
  this.leftDown = function(){
    var current = this.left;
    this.right = false;
    this.left = true;
    if(!current)movementObj.turn = -turnInterval.min;
    if(!current)this.moveLeft();
  }
  this.leftUp = function(){
    if(this.left)movementObj.turn = 0;
    this.left = false;
    clearInterval(this.leftInterval)
  }

  this.moveRight = function(){
    if(!this.right)return;
    movementObj.changeDirection(movementObj.turn);
    movementObj.turn = movementObj.turn*turnInterval.inc<turnInterval.max ? movementObj.turn*turnInterval.inc : turnInterval.max;
    this.rightInterval = setTimeout(this.moveRight.bind(this), timeInterval);
  }
  this.rightDown = function(){
    var current = this.right;
    this.left = false;
    this.right = true;
    if(!current)movementObj.turn = turnInterval.min;
    if(!current)this.moveRight();
  }
  this.rightUp = function(){
    if(this.right)movementObj.turn = 0;
    this.right = false;
    clearInterval(this.rightInterval)
  }

  function facingRadians(){
    return movementObj.facing*Math.PI/180;
  }

  setTimeout(movementObj.update.bind(movementObj), timeInterval);
}
*/
