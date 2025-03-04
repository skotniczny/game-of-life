import { makeGrid } from "./dom-utils.mjs";

class Board {
  constructor(element, makeBoardFn, { width, height, block = 0, speed = 50 }) {
    this.gridWidth = width;
    this.gridHeight = height;
    this.blockSize = block;

    /* Create Board */
    this.arrayOfBlocks = makeBoardFn(element, this.gridWidth, this.gridHeight, this.blockSize);
    this.grid = makeGrid(this.arrayOfBlocks);

    /* Loop and Timer */
    this.boardSpeed = speed;
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
      checkbox.draw(this.grid[index]);
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


export default Board
