// ANIMATION
// 
// You can define a series of frames in a sprite sheet that a puyo will use to draw itself.
// It is assumed that all sprites in the animation are on the same Y level of the sheet
// Animations can loop
// TODO
// These are animation definitions really. Need an object for a running animation to track its frame and time internally
// Apply that to paths also
function Animation()
{
  this.speed = 10;
  this.loop = false;
  this.x = 0;
  this.y = [];
}

function AnimationManager()
{
  this.animations = {};
}

// some simple animations to use when a puyo is waiting to link
var am = new AnimationManager();
var purplesleep = new Animation();
purplesleep.speed = 15;
purplesleep.y = 9;
purplesleep.x = [1, 2, 3, 2, 1, 2, 3, 2, 1, 0];
am.animations[1] = purplesleep;

var bluenerves = new Animation();
bluenerves.speed = 15;
bluenerves.y = 3;
bluenerves.x = [5, 5, 6, 6, 5, 7, 7, 4, 4, 6, 0];
am.animations[2] = bluenerves;

var greenwaves = new Animation();
greenwaves.speed = 15;
greenwaves.y = 7;
greenwaves.x = [8, 9, 8, 10, 11, 10, 8, 9, 8];
am.animations[3] = greenwaves;

var yellowwink = new Animation();
yellowwink.speed = 15;
yellowwink.y = 5;
yellowwink.x = [6, 12, 12, 12, 7, 12, 0, 0, 1, 2, 2, 1];
am.animations[4] = yellowwink;

var redbounce = new Animation();
redbounce.speed = 15;
redbounce.y = 1;
redbounce.x = [3, 4, 5, 6, 6, 5];
am.animations[5] = redbounce;

// animations that puyos use when waiting in the next box
var rednext = new Animation();
rednext.speed = 2;
rednext.y = 0;
rednext.x = [16, 17, 16, 17];
am.animations[6] = rednext;

var bluenext = new Animation();
bluenext.speed = 2;
bluenext.y = 2;
bluenext.x = [16, 17, 16, 17];
am.animations[7] = bluenext;

var yellownext = new Animation();
yellownext.speed = 2;
yellownext.y = 4;
yellownext.x = [16, 17, 16, 17];
am.animations[8] = yellownext;

var greennext = new Animation();
greennext.speed = 2;
greennext.y = 6;
greennext.x = [16, 17, 16, 17];
am.animations[9] = greennext;

var purplenext = new Animation();
purplenext.speed = 2;
purplenext.y = 8;
purplenext.x = [16, 17, 16, 17];
am.animations[10] = purplenext;

// the flashing position 0 puyo animation
var redflash = new Animation();
redflash.loop = true;
redflash.speed = 5;
redflash.y = 0;
redflash.x = [0, 18, 0, 18];
am.animations[11] = redflash;

var blueflash = new Animation();
blueflash.loop = true;
blueflash.speed = 5;
blueflash.y = 2;
blueflash.x = [0, 18, 0, 18];
am.animations[12] = blueflash;

var yellowflash = new Animation();
yellowflash.loop = true;
yellowflash.speed = 5;
yellowflash.y = 4;
yellowflash.x = [0, 18, 0, 18];
am.animations[13] = yellowflash;

var greenflash = new Animation();
greenflash.loop = true;
greenflash.speed = 5;
greenflash.y = 6;
greenflash.x = [0, 18, 0, 18];
am.animations[14] = greenflash;

var purpleflash = new Animation();
purpleflash.loop = true;
purpleflash.speed = 5;
purpleflash.y = 8;
purpleflash.x = [0, 18, 0, 18];
am.animations[15] = purpleflash;

