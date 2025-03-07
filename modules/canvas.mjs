import Board from "./board.mjs";
import Block from "./block.mjs";
import { qS as $ } from "./dom-utils.mjs";

const canvas = $("board");

/* Make array of Block objects */
const makeBoard = (element, width, height, blockSize) => {
  const blocks = [];
  const size = width * height;

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

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / board.blockSize);
  const y = Math.floor((event.clientY - rect.top) / board.blockSize);
  const index = x + y * board.gridWidth;
  board.checkBlock(index);
  board.updateBoard();
});

export default board;
