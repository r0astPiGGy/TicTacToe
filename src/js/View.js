const gridView = document.querySelector("#grid")
const messageListView = document.querySelector("#messages")
const stateMessageView = document.querySelector("#current-state")
const playerListView = document.querySelector("#player-list")

const startButton = document.querySelector("#start-button")

const playersInput = document.querySelector("#players")
const combinationInput = document.querySelector("#combination")
const boardSizeInput = document.querySelector("#board-size")

const errorView = document.querySelector("#error")

const viewModel = ViewModel()

function start() {
    viewModel.setStateUpdateListener(onViewStateUpdated)
    viewModel.setGameParams(3, 3, 2)

    startButton.addEventListener("click", handleStartButtonPress)
    document.addEventListener("keydown", handleKeyPress)
}

function handleStartButtonPress() {
    errorView.innerHTML = "&nbsp;"

    try {
        const combination = getIntegerFromInput(combinationInput)
        const players = getIntegerFromInput(playersInput)
        const size = getIntegerFromInput(boardSizeInput)

        viewModel.setGameParams(size, combination, players)
    } catch (e) {
        errorView.textContent = e
    }
}

function handleKeyPress(event) {
    let shouldCancelEvent = true

    switch (event.key) {
        case "ArrowUp": viewModel.onMove(UP); break;
        case "ArrowDown": viewModel.onMove(DOWN); break;
        case "ArrowRight": viewModel.onMove(RIGHT); break;
        case "ArrowLeft": viewModel.onMove(LEFT); break;
        case "Escape": viewModel.onDeselect(); break;
        case "Enter":
        case " ":
            viewModel.onSelectedInteract()
            break;
        default:
            shouldCancelEvent = false;
            break;
    }

    if (shouldCancelEvent) {
        event.preventDefault()
    }
}

function onViewStateUpdated(viewState) {
    updateGrid(viewState)
    updateMessages(viewState)
    updatePlayerList(viewState)
    updateInputFields(viewState)
}

function updateGrid(viewState) {
    gridView.innerHTML = ""

    viewState.grid.forEach((row, y) => {
        const cells = row.map((cell, x) => createCell(cell, x, y))
        gridView.append(createRow(cells))
    })
}

function updateMessages(viewState) {
    stateMessageView.innerHTML = `Ход ${viewState.round + 1}. Очередь ${viewState.nextPlayer}`
    messageListView.innerHTML = ""
    Array.from({ length: viewState.round }, (v, i) => {
        const msg = `Ход ${i + 1} сделал ${viewState.players[i % viewState.players.length]}`

        const p = document.createElement("p")
        p.innerHTML = msg

        messageListView.append(p)
    })
}

function updatePlayerList(viewState) {
    if (viewState.currentPlayer !== null) return

    const playerList = viewState.players.join(", ")
    playerListView.innerHTML = `Игроки: ${playerList}`
}

function updateInputFields(viewState) {
    if (viewState.round > 0) return

    boardSizeInput.value = viewState.grid.length
    playersInput.value = viewState.players.length
    combinationInput.value = viewState.combination
}

function createCell(state, x, y) {
    const cell = document.createElement("div")

    cell.classList.add("cell")
    cell.dataset.x = x
    cell.dataset.y = y

    if (state.selected) {
        cell.classList.add("selected")
    }

    cell.innerHTML = `
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 64 64" 
            preserveAspectRatio="xMinYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            >
            <text
                x="50%"
                y="50%"
                dominant-baseline="central"
                text-anchor="middle"
                font-size="32"
                fill="black"
            >${state.content}</text>
      </svg>
    `
    cell.addEventListener("click", () => viewModel.onCellClick(x, y))

    return cell
}

function createRow(cells) {
    const row = document.createElement("div")
    row.classList.add("row")

    cells.forEach(it => row.append(it))

    return row
}

start()