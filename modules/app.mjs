import { qS as $ } from './dom-utils.mjs'

export default function(board) {
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
}