class Block {
  constructor(id) {
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    el.id = id;
    this.checkbox = el
  }

  draw(isChecked) {
    this.checkbox.checked = isChecked;
  }
}

export default Block;