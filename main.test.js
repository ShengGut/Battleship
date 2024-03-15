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
  let gameBoard
  const shipLength = 3

  beforeEach(() => {
    gameBoard = createGameBoard() // arrange
  })
  test('should create an object with the correct attributes', () => {
    expect(gameBoard).toHaveProperty('placeShip')
    // expect(gameboard).toHaveProperty('receiveAttack')
    // expect(gameboard).toHaveProperty('areAllShipsSunk')
    // expect(gameboard).toHaveProperty('getMissedAttacks')
  })

  test('should be able to place a ship at specific coordinates', () => {
    const coordinates = { row: 0, col: 0 }
    gameBoard.placeShip(coordinates, shipLength)

    expect(gameBoard.grid['0-0']).toEqual({
      ship: expect.any(Object),
      index: 0,
    })
    expect(gameBoard.grid['0-1']).toEqual({
      ship: expect.any(Object),
      index: 1,
    })
    expect(gameBoard.grid['0-2']).toEqual({
      ship: expect.any(Object),
      index: 2,
    })
  })

  test('should send the hit function to the correct ship when attacked', () => {
    const attackCoordinates = { row: 0, col: 0 }
    gameBoard.placeShip(attackCoordinates, shipLength)
    gameBoard.receiveAttack(attackCoordinates)
    expect(gameBoard.grid['0-0'].ship.hitCount).toBe(1) // Assert that the ship at the attacked coordinates has been hit
  })

  test('should record missed attacks', () => {
    const missedCoordinates = { row: 0, col: 0 }
    const trueCoordinates = { row: 3, col: 0 }
    gameBoard.placeShip(trueCoordinates, shipLength)
    gameBoard.receiveAttack(missedCoordinates)
    gameBoard.receiveAttack({ row: 0, col: 1 })
    gameBoard.receiveAttack({ row: 0, col: 2 })
    const missedAttacks = gameBoard.getMissedAttacks()
    expect(missedAttacks).toContainEqual(missedCoordinates) // Assert that missedAttack matches the missedCoordinate
  })

  test('should report when all ships have been sunk', () => {
    const coordinates1 = { row: 0, col: 0 }
    const coordinates2 = { row: 1, col: 0 }
    gameBoard.placeShip(coordinates1, shipLength)
    gameBoard.placeShip(coordinates2, shipLength)

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
