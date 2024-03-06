
const EMPTY = ' '

const UP = [0, -1]
const DOWN = [0, 1]
const RIGHT = [1, 0]
const LEFT = [-1, 0]

function pointOf(x, y) {
    return { x: x, y: y }
}

function viewStateOf(grid) {
    return {
        grid: grid,
        winner: null,
        isDraw: false,
        round: 0,
        currentPlayer: null,
        selectedPoint: null,
        players: []
    }
}

function cellStateOf() {
    return {
        content: EMPTY,
        selected: false
    }
}

function isEmpty(cellState) {
    return cellState.content === EMPTY
}