var gridWidth = 50;
var gridHeight = 25;

function makeBoard(width, height) {
  var nodes = [];
  var size = width * height;

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < size; i += 1) {
    if (i % width === 0) {
      var br = document.createElement("br");
      fragment.appendChild(br);
    }

    var id = "box" + i;
    var label = document.createElement("label");
    label.setAttribute("for", id);

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.id = id;
    nodes.push(checkbox);

    fragment.appendChild(checkbox);
    fragment.appendChild(label);
  }
  board.appendChild(fragment);
  return nodes;
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

var size = gridWidth * gridHeight;
function nextGeneration() {
  var newGrid = new Array(size);
  for (var i = 0; i < size; i++) {
    var x = i % gridWidth;
    var y = (i - x) / gridWidth;
    var neighbours = countNeighbours(x, y);
    if (neighbours < 2 || neighbours > 3) {
      newGrid[i] = false;
    } else if (neighbours === 2) {
      newGrid[i] = grid[i];
    } else {
      newGrid[i] = true;
    }
  }
  return newGrid;
}

/* Update board */
function updateBoard() {
  checkboxes.forEach(function(checkbox, index) {
    checkbox.checked = grid[index];
  });
}

/* Single step */
function step() {
  grid = nextGeneration();
  updateBoard();
}

/* Loop and Timer */
var speed = 100;
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
  var target = event.target;
  if (target.tagName === "LABEL") {
    var index = parseInt(target.htmlFor.substring(3), 10);
    grid[index] = !grid[index];
  }
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