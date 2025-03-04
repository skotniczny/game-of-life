function qS(id) {
  return document.getElementById(id);
}

/* Make array of booleans */
function makeGrid(checkboxes) {
  return checkboxes.map(() => Math.random() < 0.25);
}

export {
  qS,
  makeGrid
}