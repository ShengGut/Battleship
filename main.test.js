const {} = require('./main')

test('Create ship (1)', () => {
  expect(createShip()).toEqual({ length: 5, hitCount: 0, isSunk: false })
})
