var eventAllPiecesLanded = 1;
var eventLaunchPiece = 2;
var eventNextReady = 3;

/*
 * PLAYER CLASS
 *
 * Manages the board for a given player. Can be extended to add AI capabilities or user inputs
 */
function Player(p, x, y, nx, ny)
{
  this.rand = new mxRand();
  this.rand.seed(Game.seed);

  this.player = p;
  this.offx = x;
  this.offy = y;
  this.nextoffx = nx;
  this.nextoffy = ny;
  this.nextnextoffx = (p == 1) ? nx + Game.spritesize : nx - Game.spritesize;
  this.nextnextoffy = ny + Game.spritesize/2;

  this.current = [this.makeCelPuyo(2, -1), this.makeCelPuyo(2, -2)];
  this.current[0].startAnimate(11 + this.current[0].spritey / 2);
  this.next = [this.makePuyo(0, 0), this.makePuyo(0, Game.spritesize)];
  this.nextnext = [this.makePuyo(0, 0), this.makePuyo(0, Game.spritesize)];
  this.cels = [[], [], [], [], [], []];

  this.movecounter = 0;
  this.movedir = 0;
  this.split = 0;
  this.drawnext = true;

  this.combopath = [];
}

Player.prototype.moveLeft = function()
{
  if (this.split) return;
  if (this.current[0].celx == 0 || this.current[1].celx == 0) return;                  // cant go left due to edge of board
  // use +1 for the bottom edge
  if (this.cels[this.current[0].celx - 1][this.current[0].cely + 1] !== undefined) return; // cant go left due to puyo in the way
  if (this.cels[this.current[1].celx - 1][this.current[1].cely + 1] !== undefined) return; // cant go left due to puyo in the way

  this.current[0].x -= Game.spritesize;
  this.current[1].x -= Game.spritesize;
}

Player.prototype.moveRight = function ()
{
  if (this.split) return;
  if (this.current[0].celx >= 5 || this.current[1].celx >= 5) return;                  // cant go right due to edge of board
  // use +1 for the bottom edge
  if (this.cels[this.current[0].celx + 1][this.current[0].cely + 1] !== undefined) return; // cant go right due to puyo in the way
  if (this.cels[this.current[1].celx + 1][this.current[1].cely + 1] !== undefined) return; // cant go right due to puyo in the way

  this.current[0].x += Game.spritesize;
  this.current[1].x += Game.spritesize;
}

Player.prototype.moveCW = function()
{
  if (this.split) return;

  if (this.current[0].celx == this.current[1].celx+1) 
  {
    this.current[1].x = this.current[0].x; this.current[1].celx = this.current[0].celx;
    this.current[1].y -= Game.spritesize; this.current[1].cely--;
  }
  else if (this.current[0].celx == this.current[1].celx - 1) {
    this.current[1].x = this.current[0].x; this.current[1].celx = this.current[0].celx;
    this.current[1].y += Game.spritesize; this.current[1].cely++;
  }
  else if (this.current[0].cely == this.current[1].cely + 1) {
    this.current[1].y = this.current[0].y; this.current[1].cely = this.current[0].cely;
    this.current[1].x += Game.spritesize; this.current[1].celx++;
  }
  else if (this.current[0].cely == this.current[1].cely - 1) {
    this.current[1].y = this.current[0].y; this.current[1].cely = this.current[0].cely;
    this.current[1].x -= Game.spritesize; this.current[1].celx--;
  }

  if (this.current[1].x < 0 || this.current[1].x >= 6 * Game.spritesize) this.moveCW();
  if (this.puyoWillLand(this.current[1])) this.moveCW();
}

Player.prototype.makeCelPuyo = function (x, y)
{
  var p = new Puyo;
  p.stage = 1;
  p.define(0, 2 * ((this.rand.pop() * 5) | 0));
  p.place(x * Game.spritesize, y * Game.spritesize);
  return p;
}

Player.prototype.makePuyo = function (x, y)
{
  var p = new Puyo;
  p.stage = 3;
  p.define(0, 2 * ((this.rand.pop() * 5) | 0));
  p.place(x, y);
  return p;
}

Player.prototype.puyoWillLand = function (p)
{
  if (p.cely < -1) return false;

  // get the cel that the bottom edge will be in
  var y = p.y + Game.spritesize + Game.dropspeed;
  var targetcel = (y / Game.spritesize) |0;

  if (targetcel > 11) return true;

  if (this.cels[p.celx][targetcel] === undefined) return false;
  return true;
}

Player.prototype.puyoLand = function (p)
{
  p.cely++;
  // sanity check - why does this happen? - somehow, sometimes, we skip over a cel and need to pull it back one
  while (this.cels[p.celx][p.cely] !== undefined) p.cely--;
  p.y = p.cely * Game.spritesize;
  p.stop();

  // set puyo in the board
  this.cels[p.celx][p.cely] = p;
  // game over?
  if (p.cely == 0 && p.celx == 2) { Game.gameover = true; }

  // check around for linkages
  var image = 0;
  if (p.cely > 0 && this.cels[p.celx][p.cely - 1] !== undefined && this.cels[p.celx][p.cely - 1].origspritey == p.origspritey) { image += 2; this.cels[p.celx][p.cely - 1].shift(1,0); }
  if (p.cely < 11 && this.cels[p.celx][p.cely + 1] !== undefined && this.cels[p.celx][p.cely + 1].origspritey == p.origspritey) { image += 1; this.cels[p.celx][p.cely + 1].shift(2,0); }
  if (p.celx > 0 && this.cels[p.celx - 1][p.cely] !== undefined && this.cels[p.celx - 1][p.cely].origspritey == p.origspritey) { image += 8; this.cels[p.celx - 1][p.cely].shift(4, 0); }
  if (p.celx < 5 && this.cels[p.celx + 1][p.cely] !== undefined && this.cels[p.celx + 1][p.cely].origspritey == p.origspritey) { image += 4; this.cels[p.celx + 1][p.cely].shift(8, 0); }
  p.origspritex = image;
  p.spritey = p.origspritey;
  p.spritex = image;
  return true;
}

Player.prototype.update = function ()
{
  // check if current puyos are done dropping
  // check the lower one first
  if (this.current[1].y > this.current[0].y)
  {
    if (this.current[1].stage == 1 && this.puyoWillLand(this.current[1])) {
      this.puyoLand(this.current[1]);
      this.split++;
    }

    if (this.current[0].stage == 1 && this.puyoWillLand(this.current[0])) {
      this.puyoLand(this.current[0]);
      this.split++;
    }
  }
  else
  {
    if (this.current[0].stage == 1 && this.puyoWillLand(this.current[0])) {
      this.puyoLand(this.current[0]);
      this.split++;
    }

    if (this.current[1].stage == 1 && this.puyoWillLand(this.current[1])) {
      this.puyoLand(this.current[1]);
      this.split++;
    }
  }

  // are both down?
  if (this.split == 2) this.trigger(eventAllPiecesLanded);

  // apply user inputs?
  this.movecounter++;
  if (this.movecounter > movepollrate)
  {
    this.movecounter = 0;
    if (this.movedir > 0) this.moveRight();
    if (this.movedir < 0) this.moveLeft();
  }

  // advance the downward motion of the current puyos
  this.current[0].update();
  this.current[1].update();
  this.next[0].update();
  this.next[1].update();
  this.nextnext[0].update();
  this.nextnext[1].update();

  // update all puyo animations
  for (var x = 0; x < 6; x += 1)
  {
    for (var y = 0; y < 12; y += 1)
    {
      if (this.cels[x][y] !== undefined) this.cels[x][y].update();
    }
  }
}

Player.prototype.draw = function ()
{
  for (var x = 0; x < 6; x += 1)
  {
    for (var y = 0; y < 12; y += 1)
    {
      if (this.cels[x][y] !== undefined) this.cels[x][y].draw(this.offx, this.offy);
    }
  }
  this.current[0].draw(this.offx, this.offy);
  this.current[1].draw(this.offx, this.offy);
  if (this.drawnext)
  {
    this.next[0].draw(this.nextoffx, this.nextoffy);
    this.next[1].draw(this.nextoffx, this.nextoffy);
  }
  this.nextnext[0].draw(this.nextnextoffx, this.nextnextoffy);
  this.nextnext[1].draw(this.nextnextoffx, this.nextnextoffy);
}

Player.prototype.trigger = function(e)
{
  if (e == eventAllPiecesLanded)
  {
    this.checkforCombo();

      this.split = 0;
      this.current = [this.makeCelPuyo(2, -1), this.makeCelPuyo(2, -2)];
      this.current[0].clone(this.next[1]); // ya I know
      this.current[0].startAnimate(11 + this.current[0].spritey/2);
      this.current[1].clone(this.next[0]);
      this.current[0].stage = 4; // dont drop
      this.current[1].stage = 4;

      this.next[0].startPath(3);
      this.next[1].startPath(3);
    }

  if (e == eventLaunchPiece)
  {
    this.current[0].stage = 1; // drop
    this.current[1].stage = 1;
    this.drawnext = false;
//    this.next[0].startPath(4);
//    this.next[1].startPath(4);
    this.nextnext[0].startPath(2);
    this.nextnext[1].startPath(2);
  }

  if (e == eventNextReady)
  {
    this.drawnext = true;
    this.next[0].clone(this.nextnext[0]);
    this.next[1].clone(this.nextnext[1]);
    this.nextnext[0].define(0, 2 * ((this.rand.pop() * 5) | 0));
    this.nextnext[1].define(0, 2 * ((this.rand.pop() * 5) | 0));
  }
}

Player.prototype.checkforCombo = function()
{
  var combo = false;
  var dead = [];
  this.combopath = [];
  if (this.checkforComboRecurse(this.current[0]) >= 4)
  {
    dead = this.combopath;
    combo = true;
  }
  this.combopath = [];
  if (this.checkforComboRecurse(this.current[1]) >= 4)
  {
    for (key in this.combopath) dead[key] = true;
    combo = true;
  }
  if (combo)
  {
    // remove all combo pieces
    for (key in dead)
    {
      var y = (key / 10)|0;
      var x = key - (y * 10);
      this.cels[x][y] = undefined;
    }
  }
}

Player.prototype.checkforComboRecurse = function (p)
{
  var total = 0;
  var index = p.cely * 10 + p.celx;
  if (this.combopath[index] !== undefined) return total; // already been here

  // this p counts
  this.combopath[index] = true;
  total += 1;

  // find ways to go
  if (p.celx > 0)
  {
    var n = this.cels[p.celx - 1][p.cely];  // neighbour
    if (n !== undefined && p.origspritey == n.origspritey) total += this.checkforComboRecurse(n);
  }
  if (p.celx < 5) {
    var n = this.cels[p.celx + 1][p.cely];  // neighbour
    if (n !== undefined && p.origspritey == n.origspritey) total += this.checkforComboRecurse(n);
  }
  if (p.cely > 0) {
    var n = this.cels[p.celx][p.cely-1];  // neighbour
    if (n !== undefined && p.origspritey == n.origspritey) total += this.checkforComboRecurse(n);
  }
  if (p.cely < 11) {
    var n = this.cels[p.celx][p.cely + 1];  // neighbour
    if (n !== undefined && p.origspritey == n.origspritey) total += this.checkforComboRecurse(n);
  }
  return total;
}
