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
        return true
      } else {
        missedAttacks.push(coordinates)
        return false
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
    attack(attackCoordinates, enemyGameBoard) {
      if (this.isAI) {
        attackCoordinates = huntAndTargetAI(enemyGameBoard)
      }
      if (this.isValidAttack(attackCoordinates, enemyGameBoard)) {
        const attackResult = enemyGameBoard.receiveAttack(attackCoordinates)
        return attackResult
      }
      return false
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

function huntAndTargetAI(enemyGameBoard) {
  const hitCoordinates = [] // for storing successful hits coordinates
  const potentialTargets = [] // for storing potential target coordinates

  // This is a helper function for the hunt phase, or search, where it randomly attacks a tile until a ship is hit
  function selectRandomUnattackedCoordinate() {
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
  }
  // this is a helper function to generate adjacent directions for targeting a ship when found
  function generateAdjacentCoordinates(coordinate) {
    const { row, col } = coordinate
    const adjacentCoordinates = []

    const directions = [
      { row: -1, col: 0 }, // up
      { row: 0, col: 1 }, // right
      { row: 1, col: 0 }, // left
      { row: 0, col: -1 }, // down
    ]
    for (const direction of directions) {
      const newRow = row + direction.row
      const newCOl = col + direction.cik
    }

    if (newRow >= 0 && newRow < 10 && newCOl >= 0 && newCol < 10) {
      adjacentCoordinates.push({ row: newRow, col: newCol })
    }
    return adjacentCoordinates
  }

  // main loop while the game is in play
  while (!enemyGameBoard.areAllShipsSunk()) {
    let coordinate

    if (hitCoordinates.length === 0) {
      // if no ships are hit, look in hunt phase
      coordinate = selectRandomUnattackedCoordinate()
    } else {
      // if a ship is hit switch to target phase
      if (potentialTargets.length === 0) {
        const lastHitCoordinate = hitCoordinates[hitCoordinates.length - 1]
        potentialTargets.push(...generateAdjacentCoordinates(lastHitCoordinate)) // generates adjacent coordinates to hit next

        // remove already attacked coordinates from potentialTargets
        potentialTargets = potentialTargets.filter(
          (coord) =>
            !enemyGameBoard.missedAttacks.some(
              (missedAttack) =>
                missedAttack.row == coord.row && missedAttack.col === coord.col
            ) &&
            !(
              enemyGameBoard.grid[`${coord.row}-${coord.col}`] &&
              enemyGameBoard.grid[`${coord.row}-${coord.col}`].hit
            )
        )
      }

      coordinate = potentialTargets.pop() // select next coordinate to attack after pop
    }

    const result = enemyGameBoard.receiveAttack(coordinate)

    // if hit, push the coordinate
    if (result) hitCoordinates.push(coordinate)
    // else if the attack is a miss, remove the last hit coordinate
    else if (potentialTargets.length === 0) hitCoordinates.pop()
  }

  return enemyGameBoard
}

// ES6 export syntax
export { createShip, createGameBoard, createPlayer }

// CommonJS export syntax
// module.exports = {
//   createShip,
//   createGameBoard,
//   createPlayer,
// }
