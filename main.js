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

function createGameBoard() {}

module.exports = {
  createShip,
  createGameBoard,
}
