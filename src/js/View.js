const gridView = document.querySelector("#grid")
const messageListView = document.querySelector("#messages")
const stateMessageView = document.querySelector("#current-state")
const playerListView = document.querySelector("#player-list")
const viewModel = ViewModel()

function start() {
    viewModel.setStateUpdateListener(onViewStateUpdated)
    viewModel.setGameParams(3, 3, 9)

    document.addEventListener("keydown", handleKeyPress)
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

    stateMessageView.innerHTML = `Ход ${viewState.round + 1}. Очередь ${viewState.nextPlayer}`

    if (viewState.currentPlayer !== null) {
        const msg = `Ход ${viewState.round} сделал ${viewState.currentPlayer}`

        const p = document.createElement("p")
        p.innerHTML = msg

        messageListView.append(p)
    } else {
        messageListView.innerHTML = ""
    }

    const playerList = viewState.players.join(", ")
    playerListView.innerHTML = `Игроки: ${playerList}`
}

function updateGrid(viewState) {
    gridView.innerHTML = ""

    viewState.grid.forEach((row, y) => {
        const cells = row.map((cell, x) => createCell(cell, x, y))
        gridView.append(createRow(cells))
    })
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