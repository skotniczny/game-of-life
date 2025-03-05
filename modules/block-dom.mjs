class Block {
  constructor(id) {
    const el = document.createElement("input");
    el.type = "checkbox";
    el.id = id;
    this.checkbox = el
  }

  draw(isChecked) {
    this.checkbox.checked = isChecked;
  }
}

export default Block;