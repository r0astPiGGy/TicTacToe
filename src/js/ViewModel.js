const ViewModel = function() {

    let viewState = null
    let stateUpdateListener = null

    function getCellStateAt(x, y) {
        return viewState.grid[y][x]
    }

    function setStateUpdateListener(listener) {
        stateUpdateListener = listener
    }

    function fireStateUpdate() {
        if (stateUpdateListener === null) return

        stateUpdateListener(viewState)
    }

    function setGridSize(size) {
        const grid = Array
            .from(
                {length: size},
                () => Array.from({length: size}, () => cellStateOf())
            )

        viewState = viewStateOf(grid)

        fireStateUpdate()
    }

    function onCellClick(x, y) {
        const state = getCellStateAt(x, y)

        if (!isEmpty(state)) return

        state.content = ['X', '0'][(viewState.round++) % 2]

        fireStateUpdate()
    }

    function onMove(direction) {
        if (direction.length === undefined || direction.length !== 2) return

        const xOffset = direction[0]
        const yOffset = direction[1]
    }

    return {
        setGridSize: setGridSize,
        setStateUpdateListener: setStateUpdateListener,
        onMove: onMove,
        onCellClick: onCellClick
    }
}