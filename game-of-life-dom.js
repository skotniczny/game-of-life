import Board from "./modules/board.mjs";
import Block from "./modules/block-dom.mjs";
import { qS as $ } from "./modules/dom-utils.mjs";

const config = {
  width: 50,
  height: 25,
  speed: 100
}

/* Make array of Block objects */
const makeBoard = (element, width, height) => {
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
    const el = new Block(id);
    nodes.push(el);

    fragment.appendChild(el.checkbox);
    fragment.appendChild(label);
  }
  element.appendChild(fragment)
  return nodes;
}

const el = $("board")
const board = new Board(el, makeBoard, config);
board.play();

/* Play Button */
var playBtn = $("play");
playBtn.addEventListener("click", function() {
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
nextBtn.addEventListener("click", () => board.step());

/* New Button */
var newBtn = $("new");
newBtn.addEventListener("click", function() {
  board.newGrid()
  nextBtn.focus();
});

/* Clear Button */
$("clear").addEventListener("click", function() {
  board.clearBoard()
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
  board.speed(logSlider(this.value));
});
/* For IE */
slider.addEventListener("change", function(event) {
  board.speed(logSlider(this.value));
});

el.addEventListener("click", function(event) {
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
