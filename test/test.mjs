import { qS as $ } from '../modules/dom-utils.mjs'
import Board from '../modules/board.mjs'
import { testGrid as testGrid2_5k } from './test-grid-2.5k.mjs'
import { testGrid as testGrid10k } from './test-grid-10k.mjs'

const Block = () => {
  const cell = { live: '■', dead: '□' }
  const proto = {
    draw(isChecked) {
      this.element.textContent = isChecked ? cell.live : cell.dead
    }
  }
  return Object.create(proto, {
    element: {
      value: document.createElement('span')
        .appendChild(document.createTextNode(cell.dead))
    }
  })
}

const makeBoard = (element, width, height) => {
  const size = width * height
  const nodes = []
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < size; i += 1) {
    if (i % width === 0) fragment.appendChild(document.createTextNode("\n"))
    const block = Block()
    nodes.push(block)
    fragment.appendChild(block.element)
  }
  element.appendChild(fragment)
  return nodes
}

const test = async (board, iterations) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.time("timer")
      const start = performance.now()
      for (var i = 0; i < iterations; i++) {
        board.nextGeneration()
      }
      const stop = performance.now()
      console.timeEnd("timer")
      resolve(`${iterations} iterations time: ${stop - start}ms`)
    }, 0)
  })
}

const runTest = async (el, board, iterations) => {
  const pending = document.createTextNode(`\nPending ${iterations} iterations…`)
  el.appendChild(pending)
  const result = await test(board, iterations)
  el.appendChild(document.createTextNode(`\n${result}`))
  pending.remove()
  board.updateBoard()
}

const el1 = $("board2_5k")
const board2_5K = new Board(el1, makeBoard, { width: 50, height: 50 })
board2_5K.grid = testGrid2_5k

const el2 = $("board10k")
const board10k = new Board(el2, makeBoard, { width: 100, height: 100 })
board10k.grid = testGrid10k

board2_5K.updateBoard()
board10k.updateBoard()

runTest(el1, board2_5K, 1000)
runTest(el2, board10k, 230)
