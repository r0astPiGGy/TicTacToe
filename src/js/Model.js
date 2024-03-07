
const EMPTY = ' '

const UP = [0, -1]
const DOWN = [0, 1]
const RIGHT = [1, 0]
const LEFT = [-1, 0]

const EMOJI_RANGE = [128513, 128591]
const STANDARD_PLAYERS = ['X', 'O']

const GameState = {
    PLAYING: 0,
    DRAW: 1,
    PLAYER_WON: 2,
}

function createPlayers(size) {
    if (size <= STANDARD_PLAYERS.length) return STANDARD_PLAYERS

    const emojiSize = EMOJI_RANGE[1] - EMOJI_RANGE[0]
    const emojis = Array.from({ length: emojiSize }, (v, i) => `&#${i + EMOJI_RANGE[0]};`)

    return STANDARD_PLAYERS.concat(shuffle(emojis).slice(0, size - STANDARD_PLAYERS.length))
}

function pointOf(x, y) {
    return { x: x, y: y }
}

function viewStateOf(grid, players) {
    return {
        grid: grid,
        combination: 0,
        players: players,
        winner: null,
        isDraw: false,
        round: 0,
        currentPlayer: null,
        nextPlayer: null,
        selectedPoint: null
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