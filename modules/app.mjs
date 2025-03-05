import { qS as $ } from './dom-utils.mjs'

export default function app(board) {
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
  nextBtn.addEventListener("click", () => board.step());
  
  /* New Button */
  const newBtn = $("new");
  newBtn.addEventListener("click", () => {
    board.newGrid();
    nextBtn.focus();
  });
  
  /* Clear Button */
  $("clear").addEventListener("click", () => {
    board.clearBoard();
    playBtn.textContent = "Play";
    newBtn.focus();
  });
  
  /* Speed control, min - 2 fps, max - 20 fps */
  const slider = $("speed");
  function logSlider(position) {
    const minp = slider.min;
    const maxp = slider.max;
    const minv = Math.log(500);
    const maxv = Math.log(50);
    const scale = (maxv - minv) / (maxp - minp);
    return Math.ceil(Math.exp(minv + scale * (position - minp)));
  }
  slider.addEventListener("input", function () {
    board.speed(logSlider(this.value));
  });
}