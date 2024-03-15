const { createShip, createGameBoard } = require('./main')

describe("Test createShip factory function and the object public's properties and method", () => {
  let ship
  const length = 3

  beforeEach(() => {
    ship = createShip(length) // arrange
  })

  test('should create an object with the correct public properties and methods', () => {
    // assert
    expect(ship).toHaveProperty('length', length)
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
  const ships = createShip()

  beforeEach(() => {
    gameBoard = createGameBoard() // arrange
  })
  test('should create an object with the correct attributes', () => {
    // expect(gameBoard).toHaveProperty()
  })
})
