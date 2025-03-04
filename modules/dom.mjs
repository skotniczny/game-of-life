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

export default board;
