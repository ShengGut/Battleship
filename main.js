function createShip(length = 3, hitCount = 0) {
  return {
    length: length,
    hitCount: hitCount,
    isSunk() {
      return this.hitCount >= this.length
    },
    hit() {
      return this.hitCount++
    },
  }
}

function createGameBoard() {
  const grid = []
  const missedAttacks = []

  return {
    grid,
    missedAttacks,
    placeShip(coordinates, shipLength) {
      const { row, col } = coordinates

      // Check if the ship fits within the grid boundaries
      if (row < 0 || row >= 10 || col < 0 || col + shipLength > 10)
        throw new Error('Ship placement is out of bounds')

      const ship = createShip(shipLength)
      // Check if the ship overlaps with any existing ships. If not, place ship on grid.
      for (let i = col; i < col + shipLength; i++) {
        const cell = `${row}-${i}` // grid stores the location in the string format 'row-col'
        if (grid[cell]) throw new Error('Ship overlaps with another ship')
        else grid[cell] = { ship, index: i - col }
      }
    },
    receiveAttack(coordinates) {
      const { row, col } = coordinates
      const cell = `${row}-${col}`
      if (grid[cell] && grid[cell].ship) {
        const ship = grid[cell].ship
        ship.hit()
      } else {
        missedAttacks.push(coordinates)
      }
    },
    getMissedAttacks() {
      return missedAttacks
    },
    areAllShipsSunk() {
      const ships = new Set() // Set for handling uniqueness of each ships

      for (const cell in grid)
        if (grid[cell] && grid[cell].ship) ships.add(grid[cell].ship)

      for (const ship of ships) if (!ship.isSunk()) return false

      return true
    },
  }
}

function createPlayer(isAI = false) {
  return {
    isAI,
    generateRandomCoordinates(enemyGameBoard) {
      // helper function for AI
      let row, col
      let cell
      do {
        row = Math.floor(Math.random() * 10)
        col = Math.floor(Math.random() * 10)
        cell = `${row}-${col}`
      } while (
        enemyGameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        ) ||
        enemyGameBoard.grid[cell]
      )
      return { row, col }
    },
    takeTurn(attackCoordinates, enemyGameBoard) {
      if (this.isAI) {
        attackCoordinates = this.generateRandomCoordinates(enemyGameBoard)
      }
      if (this.isLegalMove(attackCoordinates, enemyGameBoard)) {
        enemyGameBoard.receiveAttack(attackCoordinates)
      }
    },
    isLegalMove(attackCoordinates, enemyGameBoard) {
      const { row, col } = attackCoordinates
      const cell = `${row}-${col}`
      return (
        row >= 0 &&
        row < 10 &&
        col >= 0 &&
        col < 10 &&
        !enemyGameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        ) &&
        !enemyGameBoard.grid[cell]
      )
    },
  }
}

module.exports = {
  createShip,
  createGameBoard,
  createPlayer,
}

// Public interfaces/properties? -> is it player's turn to attack?
//-> can player make valid move attacking coordinate on enemy gameBoard?
//-> test if player make invalid move attacking invalid move? (should check missedAttacks in createGameBoard)
//-> Takes turn attacking enemy gameBoard
//-> Test when player attacks a coordinate, receiveAttack is correctly called
// Test that player receives feedback whether the attack was a hit or miss

// fetches coordinates
// check if isAI === true
// check if Math.random coordinates has been hit or not
// if it is hit, re-generate and recursively call attackCoordinates?
// if it is not hit, call receiveAttack with Math.random coordinates
// Give feedback if attack was a hit or a miss
// set playerTurn to false so next player e.g. player2 can start their turn.
// else if isAI === false
// check if coordinate has been hit or not
// if it is hit, make it invalid and tell the user it is not a valid move
// if it is not hit, call receiveAttack() with player-fed coordinates
// give feedback if attack was a hit or a miss
// set playerTurn to false so next player e.g. player2 can start their turn.
