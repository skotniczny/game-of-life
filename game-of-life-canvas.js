var canvas = $("board");
var ctx = canvas.getContext("2d");

var blockSize = 8;

var gridWidth = Math.floor(canvas.width / blockSize);
var gridHeight = Math.floor(canvas.height / blockSize);


function Block(col, row) {
  this.col = col;
  this.row = row;
}

Block.prototype.draw = function(color) {
  var x = this.col * blockSize;
  var y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x+1, y+1, blockSize-1, blockSize-1);
};

function makeBoard(width, height) {
  var blocks = [];
  var size = width * height;

  for (var i = 0; i < size; i += 1) {
    var col = i % gridWidth;
    var row = (i - col) / gridWidth;
    blocks.push(new Block(col, row));
  }
  return blocks;
}

// Make array of booleans.
function makeGrid() {
  return checkboxes.map(function(checkbox) {
    return Math.random() < 0.25;
  });
}

/* Calculate next generation */
var directions = [{x:0,y:-1}, {x:1,y:-1}, {x:1,y:0}, {x: 1,y:1}, {x:0,y:1}, {x:-1,y:1}, {x:-1,y:0}, {x:-1,y:-1}];

function countNeighbours(x, y) {
  var neighbours = 0;
  for (var i = 0; i < 8; i++) {
    var dir = directions[i];
    var dirX = x + dir.x;
    var dirY = y + dir.y;
    if (dirX >= 0 && dirX < gridWidth && dirY >= 0 && dirY < gridHeight) {
      var index = dirX + (dirY * gridWidth);
      neighbours += grid[index] ? 1 : 0;
    }
  }
  return neighbours;
}

function nextGeneration() {
  return grid.map(function(item, index) {
    var x = index % gridWidth;
    var y = (index - x) / gridWidth;
    var neighbours = countNeighbours(x, y);
    if (neighbours < 2 || neighbours > 3) {
      return false;
    }
    if (neighbours === 2) {
      return item;
    }
    return true;
  });
}

/* Update board */
function updateBoard() {
  checkboxes.forEach(function(checkbox, index) {
    var color = (grid[index]) ? "#335B5C" : "#ffffff";
    checkbox.draw(color);
  });
}

/* Single step */
function step() {
  grid = nextGeneration();
  updateBoard();
}

/* Loop and Timer */
var speed = 50;
var stop = false;
function loop() {
  step();
  if (!stop) {
    setTimeout(loop, speed);
  }
}

/* Create board */
var board = $("board");
var checkboxes = makeBoard(gridWidth, gridHeight);
var grid = makeGrid();
updateBoard();
loop();

/* Play Button */
var playBtn = $("play");
playBtn.addEventListener("click", function() {
  if (stop) {
    this.textContent = "Stop";
    stop = false;
    loop();
    return;
  }
  this.textContent = "Play";
  stop = true;
});

/* Next Button */
var nextBtn = $("next");
nextBtn.addEventListener("click", step);

/* New Button */
var newBtn = $("new");
newBtn.addEventListener("click", function() {
  grid = makeGrid();
  updateBoard();
  nextBtn.focus();
});

/* Clear Button */
$("clear").addEventListener("click", function() {
  grid = grid.map(function() {
    return false;
  });
  updateBoard();
  stop = true;
  playBtn.textContent = "Play";
  newBtn.focus();
});

/* Speed control, min - 2 fps, max - 20 fps */
var slider = $("speed");
function logSlider(position) {
  var minp = slider.min;
  var maxp = slider.max;
  var minv = Math.log(500);
  var maxv = Math.log(50);
  var scale = (maxv - minv) / (maxp - minp);
  return Math.ceil(Math.exp(minv + scale * (position - minp)));
}
slider.addEventListener("input", function(event) {
  speed = logSlider(this.value);
});
/* For IE */
slider.addEventListener("change", function(event) {
  speed = logSlider(this.value);
});

board.addEventListener("click", function(event) {
  var rect = canvas.getBoundingClientRect();
  var x = Math.floor((event.clientX - rect.left) / blockSize);
  var y = Math.floor((event.clientY - rect.top) / blockSize);
  var index = x + y * gridWidth;
  grid[index] = !grid[index];
  updateBoard();
  nextBtn.focus();
});

//console.time("timer");
//for (var i = 0; i < 1000; i++) {
//  grid = nextGeneration();
//}
//console.timeEnd("timer");
//updateBoard();

/* Helper */
function $(id) {
  return document.getElementById(id);
}