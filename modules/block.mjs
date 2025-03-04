class Block {
  constructor(ctx, col, row, size) {
    this.col = col;
    this.row = row;
    this.blockSize = size;
    this.ctx = ctx;
  }

  draw(color) {
    const x = this.col * this.blockSize;
    const y = this.row * this.blockSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 1, this.blockSize - 1);
  }
}

export default Block;