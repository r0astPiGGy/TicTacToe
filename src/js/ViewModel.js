const ViewModel = function() {

    let viewState = null
    let stateUpdateListener = null

    function getCellStateAt(x, y) {
        return viewState.grid[y][x]
    }

    function getWidth() {
        return viewState.grid[0].length
    }

    function getHeight() {
        return viewState.grid.length
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

        const xOffset = +direction[0]
        const yOffset = +direction[1]

        let point = viewState.selectedPoint

        if (point === null) {
            point = pointOf(0, 0)
        } else {
            point = pointOf(point.x, point.y)
        }

        point.x += xOffset
        point.y += yOffset

        if (point.x < 0 || point.x >= getWidth() || point.y < 0 || point.y >= getHeight()) {
            return
        }

        const prevPoint = viewState.selectedPoint

        if (prevPoint !== null) {
            getCellStateAt(prevPoint.x, prevPoint.y).selected = false
        }

        viewState.selectedPoint = point
        getCellStateAt(point.x, point.y).selected = true

        fireStateUpdate()
    }

    function onSelectedInteract() {
        const point = viewState.selectedPoint
        if (point === null) return

        onCellClick(point.x, point.y)
    }

    function onDeselect() {
        const point = viewState.selectedPoint

        if (point === null) return

        viewState.selectedPoint = null

        getCellStateAt(point.x, point.y).selected = false
        fireStateUpdate()
    }

    return {
        setGridSize: setGridSize,
        setStateUpdateListener: setStateUpdateListener,
        onMove: onMove,
        onSelectedInteract: onSelectedInteract,
        onDeselect: onDeselect,
        onCellClick: onCellClick
    }
}