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
    autoAttack(enemyGameBoard) {
      if (this.isAI) {
        const attackCoordinates = huntAndTargetAI(enemyGameBoard)
        const attackResult = enemyGameBoard.receiveAttack(attackCoordinates)
        if (attackResult) {
          console.log('AI player: Successful hit:', attackCoordinates)
        } else {
          console.log('AI player: Missed attack:', attackCoordinates)
        }
        return { attackCoordinates, attackResult }
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
        return 'Player 1'
      } else if (this.gameBoard.areAllShipsSunk()) {
        return 'Player 2'
      }
      return null
    },
  }
}

function huntAndTargetAI(enemyGameBoard) {
  let hitCoordinates = [] // for storing successful hits coordinates
  let potentialTargets = [] // for storing potential target coordinates
  let direction = null // for storing the direction of the ship

  // Check for any successful hits that haven't been fully explored
  for (const cell in enemyGameBoard.grid) {
    if (
      enemyGameBoard.grid[cell] &&
      enemyGameBoard.grid[cell].hit &&
      !enemyGameBoard.grid[cell].ship.isSunk()
    ) {
      const [row, col] = cell.split('-').map(Number)
      hitCoordinates.push({ row, col })
    }
  }

  // If there are at least two successful hits, determine the direction
  if (hitCoordinates.length >= 2) {
    const [hit1, hit2] = hitCoordinates
    if (hit1.row === hit2.row) {
      direction = 'horizontal'
    } else if (hit1.col === hit2.col) {
      direction = 'vertical'
    }
  }

  // If there are successful hits, explore adjacent cells
  while (hitCoordinates.length > 0) {
    const { row, col } = hitCoordinates.shift()
    const adjacentCells = []

    if (direction === 'horizontal') {
      adjacentCells.push(
        { row, col: col - 1 }, // Left
        { row, col: col + 1 } // Right
      )
    } else if (direction === 'vertical') {
      adjacentCells.push(
        { row: row - 1, col }, // Up
        { row: row + 1, col } // Down
      )
    } else {
      adjacentCells.push(
        { row: row - 1, col }, // Up
        { row: row + 1, col }, // Down
        { row, col: col - 1 }, // Left
        { row, col: col + 1 } // Right
      )
    }

    // Filter out invalid and already attacked coordinates
    const validAdjacentCells = adjacentCells.filter(({ row, col }) => {
      const cell = `${row}-${col}`
      return (
        row >= 0 &&
        row < 10 &&
        col >= 0 &&
        col < 10 &&
        !enemyGameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        ) &&
        !(enemyGameBoard.grid[cell] && enemyGameBoard.grid[cell].hit)
      )
    })

    // Add valid adjacent cells to potential targets
    potentialTargets.push(...validAdjacentCells)
  }

  // If there are potential targets, return the first one
  if (potentialTargets.length > 0) {
    return potentialTargets.shift()
  }

  // If no potential targets, randomly select an unattacked cell
  const unattackedCells = []
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = `${row}-${col}`
      if (
        !enemyGameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        ) &&
        !(enemyGameBoard.grid[cell] && enemyGameBoard.grid[cell].hit)
      ) {
        unattackedCells.push({ row, col })
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * unattackedCells.length)
  return unattackedCells[randomIndex]
}
// ES6 export syntax
export { createShip, createGameBoard, createPlayer }

// CommonJS export syntax
// module.exports = {
//   createShip,
//   createGameBoard,
//   createPlayer,
// }
