/*
 * PUYO CLASS
 * 
 * Maintains the state of a puyo at a certain location. This class mainly controls the sprite animation states of the puyo
 * location x and y do not include the board offsets
 */
function Puyo()
{
  this.spritex = 0;
  this.spritey = 0;
  this.origspritex = 0;
  this.origspritey = 0;
  this.x = 0;
  this.y = 0;
  this.stage = 0;

  this.path = 0;
  this.pcurframe = 0;
  this.plasttime = 0;

  this.animation = 0;
  this.curframe = 0;
  this.lasttime = 0;
  this.time = 0;

  this.celx = 0;
  this.cely = 0;
}

Puyo.prototype.clone = function(p)
{
  this.animation = 0;
  this.time = 0;
  this.spritex = p.origspritex;
  this.spritey = p.origspritey;
  this.origspritex = p.origspritex;
  this.origspritey = p.origspritey;
}

Puyo.prototype.place = function (x, y)
{
  this.x = x;
  this.y = y;
}

Puyo.prototype.define = function (x, y)
{
  this.spritex = x;
  this.spritey = y;
  this.origspritex = x;
  this.origspritey = y;
}

Puyo.prototype.shift = function (x, y)
{
  this.animation = 0;
  this.origspritex += x;
  this.spritex = this.origspritex;
  this.spritey = this.origspritey;// + y;
//  this.origspritey += y;
}

Puyo.prototype.update = function ()
{
  this.time++;
  if (this.stage == 1)
    // temp hack for now
  {
    if (Game.playerOne.split == 1)
      this.y += 6;
    else
      this.y += Game.dropspeed;
  }

  this.celx = Math.floor(this.x / Game.spritesize);
  this.cely = Math.floor(this.y / Game.spritesize);

  // if landed, and not animating and chance
  var chance = Math.random();
  if (this.stage == 2 && this.origspritex == 0 && this.animation == 0 && chance < 0.005)
  {
    if (this.spritey == 8) this.startAnimate(1);  // animate purple upon landing
    if (this.spritey == 2) this.startAnimate(2); // same for other colours
    if (this.spritey == 6) this.startAnimate(3);
    if (this.spritey == 4) this.startAnimate(4);
    if (this.spritey == 0) this.startAnimate(5);
  }

  if (this.stage == 3 && this.origspritex == 0 && this.animation == 0 && chance < 0.02) {
    if (this.spritey == 0) this.startAnimate(6);
    if (this.spritey == 2) this.startAnimate(7); // same for other colours
    if (this.spritey == 4) this.startAnimate(8);
    if (this.spritey == 6) this.startAnimate(9);
    if (this.spritey == 8) this.startAnimate(10);  // animate purple upon landing
  }

  if (this.animation > 0)                          // if animating
  {
    var anim = am.animations[this.animation];
    if (this.time - this.lasttime >= anim.speed)    // if time for next frame
    {
      this.lasttime = this.time;
      this.curframe++;
      if (this.curframe >= anim.x.length)           // last frame? 
      {
        if (anim.loop)                              // loop means start over
          this.curframe = 0;
        else
        {                                           // turn off animation
          this.animation = 0;
          this.spritex = this.origspritex;
          this.spritey = this.origspritey;
          return;
        }
      }
      else
        this.spritex = anim.x[this.curframe];       // set the current frame
    }
  }

  if (this.path > 0)                        
  {
    var p = pm.paths[this.path];
    if (this.time - this.plasttime >= p.speed)    // if time for next frame
    {
      this.plasttime = this.time;
      this.pcurframe++;
      if (this.pcurframe >= p.x.length)           // last frame? 
      {
        // special events
        if (this == Game.playerOne.next[1] && this.path == 3) Game.playerOne.trigger(eventLaunchPiece);
        if (this == Game.playerOne.nextnext[1]) Game.playerOne.trigger(eventNextReady);
        // done
        this.pcurframe = 0;
        this.path = 0;
        return;
      }
    }
  }
}

Puyo.prototype.startAnimate = function(a)
{
  this.animation = a;
  this.curframe = 0;
  this.lasttime = this.time;

  var anim = am.animations[this.animation];
  this.spritey = anim.y;
  this.spritex = anim.x[this.curframe];
}

Puyo.prototype.startPath = function (a)
{
  this.path = a;
//  this.pcurframe = 0;
  this.plasttime = this.time;
}

Puyo.prototype.stop = function ()
{
  this.stage = 2;
  this.animation = 0;
}

Puyo.prototype.draw = function (ox, oy)
{
  if (this.path > 0)
  {
    var p = pm.paths[this.path];
    ox += p.x[this.pcurframe];
    oy += p.y[this.pcurframe];
  }
  Game.context.drawImage(Game.sprites, this.spritex * Game.sheetsize, this.spritey * Game.sheetsize, Game.sheetsize, Game.sheetsize, ox + this.x, oy + this.y, Game.spritesize, Game.spritesize);
}
