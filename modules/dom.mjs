import Board from "./board.mjs";
import Block from "./block-dom.mjs";
import { qS as $ } from "./dom-utils.mjs";

const config = {
  width: 50,
  height: 25,
  speed: 100
}

/* Make array of Block objects */
const makeBoard = (element, width, height) => {
  const nodes = [];
  const size = width * height;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < size; i += 1) {
    if (i % width === 0) {
      const br = document.createElement("br");
      fragment.appendChild(br);
    }

    const id = "box" + i;
    const label = document.createElement("label");
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

el.addEventListener("click", function(event) {
  const target = event.target;
  if (target.tagName === "LABEL") {
    const index = parseInt(target.htmlFor.substring(3), 10);
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

export default board;
