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

/* What property should createGameBoard have?
It should be able to place ships at specific coordinates on a 10x10 grid 
by calling createShip().
should have a receiveAttack() function that takes a pair of coordinates, determines if an attack hit a ship or not
and then sends the hit() function to the correct ship, or record the coordinates of the missed shot.
Keeps track of missed shots so they can be displayed properly
Should be able to check if all ships are sunk or not
Public properties should be: tracker for missed shots, check if all ship sunk, receiveAttack(), placing ship
*/
