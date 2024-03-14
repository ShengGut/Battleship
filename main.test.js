const { createShip, createGameBoard } = require('./main')

describe('Test createShip factory function and the resulting object', () => {
  let ship
  const length = 3

  beforeEach(() => {
    ship = createShip(length) // arrange
  })

  test('should create an object with the correct attributes', () => {
    // assert
    expect(ship).toHaveProperty('length', length)
    expect(ship).toHaveProperty('hitCount', 0)
    expect(ship).toHaveProperty('isSunk')
    expect(ship).toHaveProperty('hit')
  })

  test('should not be be sunk initially', () => {
    const isSunk = ship.isSunk() // act
    expect(isSunk).toBe(false) // assert
  })

  test('should increment counter when hit', () => {
    ship.hit() // act
    expect(ship.hitCount).toBe(1) // assert
  })

  test('should not be sunk until hitCount equals length', () => {
    ship.hit() // act
    expect(ship.isSunk()).toBe(false) // assert

    ship.hit() // act
    expect(ship.isSunk()).toBe(false) // assert

    ship.hit() // act
    expect(ship.isSunk()).toBe(true) // assert
  })
})

describe('Test createGameBoard factory function and the resulting object', () => {
  let gameboard
  const ships = createShip()

  beforeEach(() => {
    gameBoard = createGameBoard() // arrange
  })
  test('should create an object with the correct attributes', () => {})
})
