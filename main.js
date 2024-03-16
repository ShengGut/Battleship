function createShip(length = 3, hitCount = 0) {
  return {
    length: length,
    hitCount: hitCount,
    isSunk() {
      return this.hitCount >= this.length
    },
    hit() {
      this.hitCount++
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
        else grid[cell] = { ship, index: i - col, hit: false } // Add 'hit' property to each cell
      }
    },
    receiveAttack(coordinates) {
      const { row, col } = coordinates
      const cell = `${row}-${col}`
      if (grid[cell] && grid[cell].ship) {
        const ship = grid[cell].ship
        ship.hit()
        grid[cell].hit = true // Set the 'hit' property of the attacked cell to true

        // Update the hitCount for all cells containing the same ship
        for (const cell in grid) {
          if (grid[cell] && grid[cell].ship === ship) {
            grid[cell].ship.hitCount = ship.hitCount
          }
        }
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
    gameBoard: createGameBoard(),
    generateRandomCoordinates(enemyGameBoard) {
      const attackedCoordinates = new Set()

      for (const cell in enemyGameBoard.grid) {
        if (enemyGameBoard.grid[cell].hit) {
          const [row, col] = cell.split('-').map(Number)
          attackedCoordinates.add(`${row}-${col}`)
        }
      }

      for (const missedAttack of enemyGameBoard.missedAttacks) {
        const { row, col } = missedAttack
        attackedCoordinates.add(`${row}-${col}`)
      }

      let row, col
      do {
        row = Math.floor(Math.random() * 10)
        col = Math.floor(Math.random() * 10)
      } while (attackedCoordinates.has(`${row}-${col}`))

      return { row, col }
    },
    attack(attackCoordinates, enemyGameBoard) {
      if (this.isAI) {
        attackCoordinates = this.generateRandomCoordinates(enemyGameBoard)
      }
      if (this.isValidAttack(attackCoordinates, enemyGameBoard)) {
        enemyGameBoard.receiveAttack(attackCoordinates)
      }
    },
    isValidAttack(attackCoordinates, enemyGameBoard) {
      const { row, col } = attackCoordinates
      const cell = `${row}-${col}`
      return (
        row >= 0 &&
        row < 10 &&
        col >= 0 &&
        col < 10 &&
        !enemyGameBoard.missedAttacks.includes(cell) &&
        !(
          enemyGameBoard.grid[cell] &&
          enemyGameBoard.grid[cell].ship &&
          enemyGameBoard.grid[cell].hit
        )
      )
    },
    checkForWinner(enemyGameBoard) {
      if (enemyGameBoard.areAllShipsSunk()) {
        return 'Winner'
      } else if (this.gameBoard.areAllShipsSunk()) {
        return 'Loser'
      }
      return null
    },
  }
}

module.exports = {
  createShip,
  createGameBoard,
  createPlayer,
}
