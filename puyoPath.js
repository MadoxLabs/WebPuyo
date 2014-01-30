//
// PATHING
//
// You can define paths that a puyo will follow as it goes on with its life.
// This is meant to be used by the bounce from nextnext to next and the spin when rotating
// It will path while animating and falling etc.
// Paths do not loop
// The path x/y values are offset from the normal position, NOT from the last position. 
// Offsets are applied at draw time, normal position is never altered
// TODO
// There is a probably need to chain a path after another path finishes
// There is a definite need to chain an event after a path finishes.
// We probably need an event system
function Path()
{
  this.speed = 5;
  this.x = [];
  this.y = [];
}

function PathManager()
{
  this.paths = {};
}

// a wiggle path for testing
var pm = new PathManager();
var testwiggle = new Path();
testwiggle.speed = 1;
testwiggle.y = [0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0, 0, 0, 0, 0, 0, 0, 0,  0,  0,  0,  0,  0, 0];
testwiggle.x = [1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0];
pm.paths[1] = testwiggle;

// path for nextnext puyo to follow, bounce into the next position
var p1nextnext = new Path();
p1nextnext.speed = 1;
p1nextnext.x = [0, -6, -12, -18, -24, -30, -36, -42];
p1nextnext.y = [0, -9, -13, -16, -18, -20, -21, -21];
pm.paths[2] = p1nextnext;

// path for next puyo to rise up and enter the board
var p1next = new Path();
p1next.speed = 1;
p1next.x = [0, 0, 0, 0, 0, 0, 0, 0];
p1next.y = [0, -12, -24, -36, -48, -60, -72, -84];
pm.paths[3] = p1next;

var p1nextoff = new Path();
p1nextoff.speed = 1;
p1nextoff.x = [0, 0, 0, 0, 0, 0, 0, 0];
p1nextoff.y = [-84, -84, -84, -84, -84, -84, -84, -84];
pm.paths[4] = p1nextoff;
