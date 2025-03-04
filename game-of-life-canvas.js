import Board from "./modules/board.mjs";
import Block from "./modules/block.mjs";
import { qS as $ } from "./modules/dom-utils.mjs";

const canvas = $("board");

/* Make array of Block objects */
const makeBoard = (element, width, height, blockSize) => {
  const blocks = [];
  var size = width * height;

  for (let i = 0; i < size; i += 1) {
    const col = i % width;
    const row = (i - col) / width;
    blocks.push(new Block(element.getContext("2d"), col, row, blockSize));
  }
  return blocks;
}

const blockSize = 8;
const size = {
  width: Math.floor(canvas.width / blockSize),
  height: Math.floor(canvas.height / blockSize),
  block: blockSize,
  speed: 50
};

const board = new Board(canvas, makeBoard, size);
board.play();

/* Play Button */
const playBtn = $("play");
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
const nextBtn = $("next");
nextBtn.addEventListener("click", function () {
  board.step();
});

/* New Button */
const newBtn = $("new");
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
const slider = $("speed");
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
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / board.blockSize);
  const y = Math.floor((event.clientY - rect.top) / board.blockSize);
  const index = x + y * board.gridWidth;
  board.checkBlock(index);
  nextBtn.focus();
});
