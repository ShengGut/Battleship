const { createShip, createGameBoard, createPlayer } = require('./main')

describe("Test createShip factory function and the object public's properties and methods", () => {
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

describe("Test createGameBoard factory function and the object public's properties and methods", () => {
  let gameBoard
  const shipLength = 3

  beforeEach(() => {
    gameBoard = createGameBoard() // arrange
  })
  test('should create an object with the correct attributes', () => {
    expect(gameBoard).toHaveProperty('placeShip')
    expect(gameBoard).toHaveProperty('receiveAttack')
    expect(gameBoard).toHaveProperty('areAllShipsSunk')
    expect(gameBoard).toHaveProperty('getMissedAttacks')
  })

  test('should be able to place a ship at specific coordinates', () => {
    const coordinates = { row: 0, col: 0 }
    gameBoard.placeShip(coordinates, shipLength)

    expect(gameBoard.grid['0-0']).toEqual({
      ship: expect.any(Object),
      index: 0,
      hit: false,
    })
    expect(gameBoard.grid['0-1']).toEqual({
      ship: expect.any(Object),
      index: 1,
      hit: false,
    })
    expect(gameBoard.grid['0-2']).toEqual({
      ship: expect.any(Object),
      index: 2,
      hit: false,
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

describe("Test createPlayer factory function and the object's public properties and methods", () => {
  let player1
  let player2 // AI player

  beforeEach(() => {
    player1 = createPlayer()
    player2 = createPlayer(true)
  })

  test('should create an object with the correct properties', () => {
    expect(player1).toHaveProperty('isAI')
    expect(player1).toHaveProperty('gameBoard')
    expect(player1).toHaveProperty('generateRandomCoordinates')
    expect(player1).toHaveProperty('attack')
    expect(player1).toHaveProperty('isValidAttack')
  })

  test('should be able to take a turn and attack the enemy gameboard', () => {
    const attackCoordinates = { row: 0, col: 0 }
    player1.attack(attackCoordinates, player2.gameBoard)
    expect(player2.gameBoard.getMissedAttacks()).toContainEqual(
      attackCoordinates
    )
  })

  test('should not allow attacking the same coordinates twice', () => {
    const attackCoordinates = { row: 0, col: 0 }
    player2.gameBoard.placeShip(attackCoordinates, 3)
    player1.attack(attackCoordinates, player2.gameBoard)
    expect(player1.isValidAttack(attackCoordinates, player2.gameBoard)).toBe(
      false
    )
  })

  test('should generate valid random attack coordinates for AI player', () => {
    const randomCoordinates = player2.generateRandomCoordinates(
      player1.gameBoard
    )
    expect(player2.isValidAttack(randomCoordinates, player1.gameBoard)).toBe(
      true
    )
  })

  test('should update the enemy gameboard when attacking a ship', () => {
    const attackCoordinates = { row: 0, col: 0 }
    player2.gameBoard.placeShip(attackCoordinates, 3)
    player1.attack(attackCoordinates, player2.gameBoard)
    expect(player2.gameBoard.grid['0-0'].ship.hitCount).toBe(1)
  })

  test("should correctly determine the winner when player1 sinks all of player2's ships", () => {
    // Place ships for player1
    player1.gameBoard.placeShip({ row: 0, col: 0 }, 5) // Carrier
    player1.gameBoard.placeShip({ row: 2, col: 0 }, 4) // Battleship
    player1.gameBoard.placeShip({ row: 4, col: 0 }, 3) // Cruiser
    player1.gameBoard.placeShip({ row: 6, col: 0 }, 2) // Destroyer

    // Place ships for player2
    player2.gameBoard.placeShip({ row: 0, col: 0 }, 5) // Carrier
    player2.gameBoard.placeShip({ row: 2, col: 0 }, 4) // Battleship
    player2.gameBoard.placeShip({ row: 4, col: 0 }, 3) // Cruiser
    player2.gameBoard.placeShip({ row: 6, col: 0 }, 2) // Destroyer

    // Player1 attacks and sinks all of player2's ships
    for (let i = 0; i < 5; i++) {
      player1.attack({ row: 0, col: i }, player2.gameBoard)
    }
    for (let i = 0; i < 4; i++) {
      player1.attack({ row: 2, col: i }, player2.gameBoard)
    }
    for (let i = 0; i < 3; i++) {
      player1.attack({ row: 4, col: i }, player2.gameBoard)
    }
    for (let i = 0; i < 2; i++) {
      player1.attack({ row: 6, col: i }, player2.gameBoard)
    }

    expect(player1.checkForWinner(player2.gameBoard)).toBe('Winner')
    expect(player2.checkForWinner(player1.gameBoard)).toBe('Loser')
  })

  test("should correctly determine the loser when player2 sinks all of player1's ships", () => {
    // Place ships for player1
    player1.gameBoard.placeShip({ row: 0, col: 0 }, 5) // Carrier
    player1.gameBoard.placeShip({ row: 2, col: 0 }, 4) // Battleship
    player1.gameBoard.placeShip({ row: 4, col: 0 }, 3) // Cruiser
    player1.gameBoard.placeShip({ row: 6, col: 0 }, 2) // Destroyer

    // Place ships for player2
    player2.gameBoard.placeShip({ row: 0, col: 0 }, 5) // Carrier
    player2.gameBoard.placeShip({ row: 2, col: 0 }, 4) // Battleship
    player2.gameBoard.placeShip({ row: 4, col: 0 }, 3) // Cruiser
    player2.gameBoard.placeShip({ row: 6, col: 0 }, 2) // Destroyer

    // Player2 attacks and sinks all of player1's ships
    for (let i = 0; i < 5; i++) {
      player2.attack({ row: 0, col: i }, player1.gameBoard)
    }
    for (let i = 0; i < 4; i++) {
      player2.attack({ row: 2, col: i }, player1.gameBoard)
    }
    for (let i = 0; i < 3; i++) {
      player2.attack({ row: 4, col: i }, player1.gameBoard)
    }
    for (let i = 0; i < 2; i++) {
      player2.attack({ row: 6, col: i }, player1.gameBoard)
    }
    console.debug(player1.gameBoard)
    expect(player2.checkForWinner(player1.gameBoard)).toBe('Winner')
    expect(player1.checkForWinner(player2.gameBoard)).toBe('Loser')
  })
})
