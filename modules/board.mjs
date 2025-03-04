import Block from "./block.mjs";

class Board {
  constructor(element) {
    this.blockSize = 8;
    this.gridWidth = Math.floor(element.width / this.blockSize);
    this.gridHeight = Math.floor(element.height / this.blockSize);

    /* Create Board */
    this.arrayOfBlocks = makeBoard(element, this.gridWidth, this.gridHeight, this.blockSize);
    this.grid = makeGrid(this.arrayOfBlocks);

    /* Loop and Timer */
    this.boardSpeed = 50;
    this.stop = false;
  }

  /* Calculate next generation */
  countNeighbours(x, y) {
    const directions = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
    let neighbours = 0;
    for (let i = 0; i < 8; i++) {
      const dir = directions[i];
      const dirX = x + dir.x;
      const dirY = y + dir.y;
      if (dirX >= 0 && dirX < this.gridWidth && dirY >= 0 && dirY < this.gridHeight) {
        const index = dirX + (dirY * this.gridWidth);
        neighbours += this.grid[index] ? 1 : 0;
      }
    }
    return neighbours;
  }

  nextGeneration() {
    this.grid = this.grid.map((item, index) => {
      const x = index % this.gridWidth;
      const y = (index - x) / this.gridWidth;
      const neighbours = this.countNeighbours(x, y);
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
  updateBoard() {
    this.arrayOfBlocks.forEach((checkbox, index) => {
      const color = (this.grid[index]) ? "#335B5C" : "#ffffff";
      checkbox.draw(color);
    });
  }

  newGrid() {
    this.grid = makeGrid(this.arrayOfBlocks);
    this.updateBoard();
  }

  clearBoard() {
    this.grid = this.grid.map(() => false);
    this.updateBoard();
    this.pause()
  }

  checkBlock(index) {
    this.grid[index] = !this.grid[index];
    this.updateBoard();
  }

  step() {
    this.nextGeneration();
    this.updateBoard();
  }

  play() {
    this.stop = false;
    const loop = () => {
      this.step();
      if (!this.stop) {
        setTimeout(loop, this.boardSpeed);
      }
    }
    loop()
  }

  pause() {
    this.stop = true;
  }

  speed(value) {
    this.boardSpeed = value;
  }
}

/* Make array of booleans */
function makeGrid(checkboxes) {
  return checkboxes.map(() => Math.random() < 0.25);
}

/* Make array of Block objects */
function makeBoard(element, width, height, blockSize) {
  const blocks = [];
  var size = width * height;

  for (let i = 0; i < size; i += 1) {
    const col = i % width;
    const row = (i - col) / width;
    blocks.push(new Block(element.getContext("2d"), col, row, blockSize));
  }
  return blocks;
}

export default Board
