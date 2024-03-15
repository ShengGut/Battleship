const { createShip, createGameBoard } = require('./main')

describe("Test createShip factory function and the object public's properties and method", () => {
  let ship
  const shipLength = 3

  beforeEach(() => {
    ship = createShip(shipLength) // arrange
  })

  test('should create an object with the correct public properties and methods', () => {
    // assert
    expect(ship).toHaveProperty('length', shipLength)
    expect(ship).toHaveProperty('isSunk')
    expect(ship).toHaveProperty('hit')
  })

  test('should not be sunk initially', () => {
    const isSunk = ship.isSunk() // act
    expect(isSunk).toBe(false) // assert
  })

  test('should not be sunk after being hit fewer times than its length', () => {
    ship.hit() // act
    expect(ship.isSunk()).toBe(false) // assert

    ship.hit() // act
    expect(ship.isSunk()).toBe(false) // assert
  })

  test('should be sunk after being hit a number of times equal to its length', () => {
    ship.hit() // act
    ship.hit() // act
    ship.hit() // act
    expect(ship.isSunk()).toBe(true) // assert
  })
})

describe("Test createGameBoard factory function and the object public's properties and method", () => {
  let gameboard
  const shipLength = 3

  beforeEach(() => {
    gameBoard = createGameBoard() // arrange
  })
  test('should create an object with the correct attributes', () => {
    expect(gameboard).toHaveProperty('placeShip')
    expect(gameboard).toHaveProperty('receiveAttack')
    expect(gameboard).toHaveProperty('AreAllShipsSunk')
    expect(gameboard).toHaveProperty('getMissedAttacks')
  })

  test('should be able to place a ship at specific coordinates', () => {
    const coordinates = { row: 0, col: 0 }
    const ship = gameBoard.placeShip(coordinates, shipLength)
    expect(ship.coordinates).toBe(coordinates)
  })

  test('should record missed attacks', () => {
    const missedCoordinates = { row: 0, col: 0 }
    gameBoard.receiveAttack(missedCoordinates)
    const missedAttacks = gameBoard.getMissedAttacks()
    expect(missedAttacks).toContainEqual(missedCoordinates)
  })

  test('should send the hit function to the correct ship when attacked', () => {
    const missedCoordinates = { row: 0, col: 0 }
    const ship = gameBoard.placeShip(coordinates, shipLength)
    gameBoard.receiveAttack(missedCoordinates)
    expect(ship.hitCount).toBe(1)
  })

  test('should report when all ships have been sunk', () => {
    const coordinates1 = { row: 0, col: 0 }
    const coordinates2 = { row: 1, col: 0 }
    const ship1 = gameBoard.placeShip(coordinates1, shipLength)
    const ship2 = gameBoard.placeShip(coordinates2, shipLength)

    // sink ship1
    gameBoard.receiveAttack(coordinates1)
    gameBoard.receiveAttack({ row: 0, col: 1 })
    gameBoard.receiveAttack({ row: 0, col: 2 })

    // sink ship2
    gameBoard.receiveAttack(coordinates2)
    gameBoard.receiveAttack({ row: 1, col: 1 })
    gameBoard.receiveAttack({ row: 1, col: 2 })

    expect(gameBoard.areAllShipsSunk()).toBe(true)
  })
})
