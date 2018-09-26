var canvas = $("board");

/* Make array of booleans */
function makeGrid(checkboxes) {
  return checkboxes.map(function () {
    return Math.random() < 0.25;
  });
}

function Block(ctx, col, row, size) {
  this.col = col;
  this.row = row;
  this.blockSize = size;
  this.ctx = ctx;
}

Block.prototype.draw = function (color) {
  var x = this.col * this.blockSize;
  var y = this.row * this.blockSize;
  this.ctx.fillStyle = color;
  this.ctx.fillRect(x + 1, y + 1, this.blockSize - 1, this.blockSize - 1);
};

function Board(element) {
  this.blockSize = 8;
  this.gridWidth = Math.floor(element.width / this.blockSize);
  this.gridHeight = Math.floor(element.height / this.blockSize);

  /* Create board */
  this.arrayOfBlocks = makeBoard(element, this.gridWidth, this.gridHeight, this.blockSize);
  this.grid = makeGrid(this.arrayOfBlocks);

  /* Loop and Timer */
  this.boardSpeed = 50;
  this.stop = false;

  /* Make array of Block objects */
  function makeBoard(element, width, height, blockSize) {
    var blocks = [];
    var size = width * height;

    for (var i = 0; i < size; i += 1) {
      var col = i % width;
      var row = (i - col) / width;
      blocks.push(new Block(element.getContext("2d"), col, row, blockSize));
    }
    return blocks;
  }
}

/* Calculate next generation */
Board.prototype.countNeighbours = function (x, y) {
  var directions = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
  var neighbours = 0;
  for (var i = 0; i < 8; i++) {
    var dir = directions[i];
    var dirX = x + dir.x;
    var dirY = y + dir.y;
    if (dirX >= 0 && dirX < this.gridWidth && dirY >= 0 && dirY < this.gridHeight) {
      var index = dirX + (dirY * this.gridWidth);
      neighbours += this.grid[index] ? 1 : 0;
    }
  }
  return neighbours;
}

Board.prototype.nextGeneration = function () {
  var that = this;
  this.grid = this.grid.map(function (item, index) {
    var x = index % that.gridWidth;
    var y = (index - x) / that.gridWidth;
    var neighbours = that.countNeighbours(x, y);
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
Board.prototype.updateBoard = function () {
  var that = this;
  this.arrayOfBlocks.forEach(function (checkbox, index) {
    var color = (that.grid[index]) ? "#335B5C" : "#ffffff";
    checkbox.draw(color);
  });
}

Board.prototype.newGrid = function () {
  this.grid = makeGrid(this.arrayOfBlocks);
  this.updateBoard();
}

Board.prototype.clearBoard = function () {
  this.grid = this.grid.map(function () {
    return false;
  });
  this.updateBoard();
  this.pause()
}

Board.prototype.checkBlock = function (index) {
  this.grid[index] = !this.grid[index];
  this.updateBoard();
}

Board.prototype.step = function () {
  this.nextGeneration();
  this.updateBoard();
}

Board.prototype.play = function () {
  this.stop = false;
  var that = this;
  function loop() {
    that.step();
    if (!that.stop) {
      setTimeout(loop, that.boardSpeed);
    }
  }
  loop()
}

Board.prototype.pause = function () {
  this.stop = true;
}

Board.prototype.speed = function (value) {
  this.boardSpeed = value;
}

var board = new Board(canvas);
board.play();

/* Play Button */
var playBtn = $("play");
playBtn.addEventListener("click", function () {
  if (board.stop) {
    this.textContent = "Stop";
    board.play();
    return;
  }
  this.textContent = "Play";
  board.pause();
});

/* Next Button */
var nextBtn = $("next");
nextBtn.addEventListener("click", function () {
  board.step();
});

/* New Button */
var newBtn = $("new");
newBtn.addEventListener("click", function () {
  board.newGrid();
  nextBtn.focus();
});

/* Clear Button */
$("clear").addEventListener("click", function () {
  board.clearBoard();
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
slider.addEventListener("input", function () {
  board.speed(logSlider(this.value));
});
/* For IE */
slider.addEventListener("change", function () {
  board.speed(logSlider(this.value));
});

canvas.addEventListener("click", function (event) {
  var rect = canvas.getBoundingClientRect();
  var x = Math.floor((event.clientX - rect.left) / board.blockSize);
  var y = Math.floor((event.clientY - rect.top) / board.blockSize);
  var index = x + y * board.gridWidth;
  board.checkBlock(index);
  nextBtn.focus();
});

/* Helper */
function $(id) {
  return document.getElementById(id);
}
