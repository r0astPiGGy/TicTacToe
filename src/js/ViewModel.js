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

    function fireStateUpdatedEvent() {
        if (stateUpdateListener === null) return

        stateUpdateListener(viewState)
    }

    function setGameParams(size, combination, players) {
        ;[size, combination, players].forEach(requirePositive)

        if (size > Constraints.MAX_GRID_SIZE) throw `Размер сетки не должен превышать ${Constraints.MAX_GRID_SIZE}`
        if (size < Constraints.MIN_GRID_SIZE) throw `Размер сетки должен быть больше ${Constraints.MIN_GRID_SIZE}`
        if (players < Constraints.MIN_PLAYERS) throw `Игроков должно быть не меньше ${Constraints.MIN_PLAYERS}`
        if (combination < Constraints.MIN_COMBINATION) throw `Комбинация должна быть больше ${Constraints.MIN_COMBINATION}`
        if (players > size) throw "Количество игроков не должно превышать размер сетки"
        if (combination > size) throw "Комбинация не должна превышать размер сетки"

        const playerList = createPlayers(players)

        const grid = Array
            .from(
                {length: size},
                () => Array.from({length: size}, () => cellStateOf())
            )

        viewState = viewStateOf(grid, playerList)
        viewState.combination = combination
        viewState.nextPlayer = viewState.players[0]

        fireStateUpdatedEvent()
    }

    function performHorizontalCheck(player) {
        return performHorizontalCheckIn(viewState.grid, player)
    }

    function performVerticalCheck(player) {
        return performHorizontalCheckIn(transpose(viewState.grid), player)
    }

    function performHorizontalCheckIn(grid, player) {
        const rowToCheck = player.repeat(viewState.combination)

        return grid
            .map(row => row.map(it => it.content).join(""))
            .some(it => it.includes(rowToCheck))
    }

    function performMainDiagonalCheck(player) {
        return performDiagonalCheck(player, (i, j) => i + 1 - getWidth() + j)
    }

    function performAntiDiagonalCheck(player) {
        return performDiagonalCheck(player, (i, j, extendedLength) => extendedLength - i - 1 - j)
    }

    function performDiagonalCheck(player, mutateIndexFn) {
        const grid = viewState.grid
        const rowToCheck = player.repeat(viewState.combination)

        const extendedLength = 2 * getWidth() - 1

        return Array.from({ length: extendedLength })
            .map((_, i) => grid.reduce((acc, row, j) => {
                const index = mutateIndexFn(i, j, extendedLength)
                if (index < 0 || index >= getWidth()) return acc

                return acc + row[index].content
            }, ""))
            .some(it => it.includes(rowToCheck))
    }

    function isWinner(player) {
        return [
            performMainDiagonalCheck(player),
            performAntiDiagonalCheck(player),
            performVerticalCheck(player),
            performHorizontalCheck(player)
        ].some(result => result)
    }

    function onCellClick(x, y) {
        if (isGameEnded(viewState)) return

        const state = getCellStateAt(x, y)

        if (!isEmpty(state)) return

        const players = viewState.players
        const clickedPlayer = players[(viewState.round) % players.length]

        state.content = clickedPlayer

        viewState.round++
        viewState.currentPlayer = clickedPlayer
        viewState.nextPlayer = players[(viewState.round) % players.length]
        viewState.winner = isWinner(clickedPlayer) ? clickedPlayer : null

        if (viewState.winner === null && viewState.round === getWidth() * getHeight()) {
            viewState.isDraw = true
        }

        fireStateUpdatedEvent()
    }

    function onMove(direction) {

        function setSelected(point, selected) {
            getCellStateAt(point.x, point.y).selected = selected
        }

        function select(point) {
            setSelected(point, true)
            viewState.selectedPoint = point
        }

        function deselect(point) {
            setSelected(point, false)
            viewState.selectedPoint = null
        }

        if (direction.length === undefined || direction.length !== 2) return

        if (viewState.selectedPoint === null) {
            select(pointOf(0, 0))
            fireStateUpdatedEvent()
            return
        }

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
            deselect(prevPoint)
        }

        select(point)

        fireStateUpdatedEvent()
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
        fireStateUpdatedEvent()
    }

    return {
        setGameParams: setGameParams,
        setStateUpdateListener: setStateUpdateListener,
        onMove: onMove,
        onSelectedInteract: onSelectedInteract,
        onDeselect: onDeselect,
        onCellClick: onCellClick
    }
}