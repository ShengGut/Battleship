const { createShip } = require('./main')

describe('Test createShip factory function and the resulting object', () => {
  let ship
  const length = 3

  beforeEach(() => {
    ship = createShip(length)
  })

  test('should create an an object with the correct attributes', () => {
    expect(ship).toHaveProperty('length', length)
    expect(ship).toHaveProperty('hitCount', 0)
    expect(ship).toHaveProperty('isSunk')
    expect(ship).toHaveProperty('hit')
  })

  test('should not be be sunk initially', () => {
    expect(ship.isSunk()).toBe(false)
  })

  test('should increment counter when hit', () => {
    ship.hit()
    expect(ship.hitCount).toBe(1)
  })

  test('should not be sunk until hitCount equals length', () => {
    ship.hit()
    expect(ship.isSunk()).toBe(false)

    ship.hit()
    expect(ship.isSunk()).toBe(false)

    ship.hit()
    expect(ship.isSunk()).toBe(true)
  })
})
