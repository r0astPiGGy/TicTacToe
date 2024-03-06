const grid = document.querySelector("#grid")
const viewModel = ViewModel()

function start() {
    viewModel.setStateUpdateListener(onViewStateUpdated)
    viewModel.setGridSize(4)

    document.addEventListener("keydown", handleKeyPress)
}

function onViewStateUpdated(viewState) {
    updateGrid(viewState)
}

function createRow(cells) {
    const row = document.createElement("div")
    row.classList.add("row")

    cells.forEach(it => row.append(it))

    return row
}

function createCell(state, x, y) {
    const cell = document.createElement("div")

    cell.classList.add("cell")
    cell.dataset.x = x
    cell.dataset.y = y

    if (state.selected) {
        cell.classList.add("selected")
    }

    cell.textContent = state.content

    cell.addEventListener("click", handleCellClick)

    return cell
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

function handleCellClick(event) {
    const x = +event.target.dataset.x;
    const y = +event.target.dataset.y;

    viewModel.onCellClick(x, y)
}

function updateGrid(viewState) {
    grid.innerHTML = ""

    viewState.grid.forEach((row, y) => {
        const cells = row.map((cell, x) => createCell(cell, x, y))
        grid.append(createRow(cells))
    })
}

start()