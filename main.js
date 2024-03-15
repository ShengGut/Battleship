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

module.exports = {
  createShip,
  createGameBoard,
}
