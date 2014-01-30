// game config
var movepollrate = 5;

/*
 * GAME CLASS
 *
 * The game object. Controls the main game loop
 */
var Game = {};

Game.init = function ()
{
  this.seed = Math.random();
  this.loading = 0;
  this.frame = 29;
  this.sheetsize = 16;
  this.spritesize = 42;
  this.dropspeed = 1;
  this.gameover = false;

  this.playerOne = new Player(1, 40, 57, 334, 15);
  this.playerTwo = new Player(2, 522, 57, 438, 15);

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  this.surface = document.getElementById('surface');
  this.context = this.surface.getContext('2d');

  this.sprites = this.loadImage('puyo.png');
  this.spritebg = this.loadImage('puyoback.png');
  this.spritefg = this.loadImage('puyofront.png');
}

Game.loadImage = function (name)
{
  var img = new Image();
  Game.loading++;
  img.onload = function () { Game.loading -= 1; }
  img.src = name;
  return img;
}

Game.run = function ()
{
  if (Game.loading > 0) return;
  if (Game.gameover) return;
  Game.frame++;

  var d = new Date();
  Game.time = d.getTime();

  Game.update();
  d = new Date();
  var updateTime = d.getTime() - Game.time;

  Game.draw();
  d = new Date();
  var drawTime = d.getTime() - Game.time;

  var idleTime = 17 - updateTime - drawTime;

  Game.context.font = "bold 8px Arial";
  Game.context.fillStyle = "#ffffff";
  if (idleTime < 0) { idleTime = 0; Game.context.fillStyle = "#ff0000"; }
  var perFrame = idleTime + drawTime + updateTime;

  Game.context.fillText("FPS: " + ((1000 / perFrame) | 0) + "  Each frame: " + perFrame + " ms", 0, 10);
  Game.context.fillText("Frame Time: Update: " + updateTime + "ms  Draw: " + drawTime + "ms  Idle: " + idleTime + "ms", 0, 20);
  updateTime = (updateTime / perFrame * 100) | 0;
  drawTime = (drawTime / perFrame * 100) | 0;
  idleTime = (idleTime / perFrame * 100) | 0;
  Game.context.fillText("Frame Time: Update: " + updateTime + "%  Draw: " + drawTime + "%  Idle: " + idleTime + "%", 0, 30);

  if (Game.frame == 60) Game.frame = 0;
}

Game.update = function ()
{
  Game.playerOne.update();
//  Game.playerTwo.update();
}

Game.draw = function ()
{
  Game.context.globalCompositeOperation = "source-over";
  Game.context.imageSmoothingEnabled = false;
  Game.context.webkitImageSmoothingEnabled = false;
  Game.context.mozImageSmoothingEnabled = false;

  Game.context.drawImage(Game.spritebg, 0, 0);
  Game.playerOne.draw();
  Game.playerTwo.draw();
  Game.context.drawImage(Game.spritefg,0,0);
}

function onKeyDown(e)
{
  if (e.keyCode == 39) Game.playerOne.movedir = 1;
  if (e.keyCode == 37) Game.playerOne.movedir = -1;
  if (e.keyCode == 40) Game.dropspeed = 5; 
}

function onKeyUp(e)
{
  if (e.keyCode == 39) Game.playerOne.movedir = 0;
  if (e.keyCode == 37) Game.playerOne.movedir = 0;
  if (e.keyCode == 40) Game.dropspeed = 1;
  if (e.keyCode == 65) Game.playerOne.moveCW();
  if (e.keyCode == 66) Game.playerOne.current[0].startPath(1);
  if (e.keyCode == 67) {
  }
}

/*
 * MAIN
 *
 * Creates game and hands over control to it
 */
function main()
{
  Game.init();
  window.setInterval(Game.run, 17);
}


/* 
 * TODO
 *

 Pathing for rotating
 rotating the other way
 sounds
 eliminating
 animation for elimination
 rotation logic
 hooks for adding AI algorithms
 multiplayer
 remove player 1 hard coding
 menus - graphics/coding
 options - graphics/coding
 garbage puyos
 garbage algorithm
 eliminating garbage
 powers  - graphics/coding
 replacement puyo graphics
 replacement animations
 game over screens
 garbage arrival animations
 clear board - graphics/coding
 avatar support
 server for data saving
 logins
 code cleanup
 lens flares

 *
 */
