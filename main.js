import './style.css'
import { createShip, createGameBoard, createPlayer } from './gameLogic.js'
// prettier-ignore
const gameBoard = () => {
    return [
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '']
}

let gameOver = false

function handleCellClick(
  event,
  player,
  enemyPlayer,
  playerBoardElement,
  enemyBoardElement
) {
  if (gameOver) return
  const cell = event.target
  const row = cell.parentNode.rowIndex
  const col = cell.cellIndex
  const attackCoordinates = { row, col }

  if (cell.getAttribute('data-attacked') !== 'true') {
    if (player.isValidAttack(attackCoordinates, enemyPlayer.gameBoard)) {
      const attackResult = player.attack(
        attackCoordinates,
        enemyPlayer.gameBoard
      )
      renderBoard(enemyBoardElement, enemyPlayer.gameBoard, false)

      let attackListP1 = document.querySelector('.attack-list.p1')
      const attackCoordStr = `[${row}, ${col}], `
      const attackElement = document.createElement('span')

      attackElement.textContent = attackCoordStr

      if (attackResult) {
        attackElement.classList.add('hit')
        console.log('Successful hit!')
      } else {
        console.log('Missed attack:')
      }

      if (player === player1 && attackListP1) {
        attackListP1.appendChild(attackElement)
      }
      const winner = player.checkForWinner(enemyPlayer.gameBoard)
      if (winner) {
        alert(`${winner} wins!`)
        gameOver = true
        player2Board.removeEventListener('click', handleCellClick)
      } else {
        // Switch turns
        setTimeout(() => {
          const { attackCoordinates, attackResult } = enemyPlayer.autoAttack(
            player.gameBoard
          )
          renderBoard(playerBoardElement, player.gameBoard, true)

          let attackListP2 = document.querySelector('.attack-list.p2')
          const { row, col } = attackCoordinates
          const attackCoordString = `[${row}, ${col}]`
          const attackElement = document.createElement('span')
          attackElement.textContent = attackCoordString

          if (attackResult) {
            attackElement.classList.add('hit')
          }

          if (attackListP2) {
            attackListP2.appendChild(attackElement)
          }

          const winner = enemyPlayer.checkForWinner(player.gameBoard)
          if (winner) {
            alert(`${winner} wins!`)
            renderBoard(enemyBoardElement, enemyPlayer.gameBoard, true)
            gameOver = true
            player2Board.removeEventListener('click', handleCellClick)
          }
        }, 500) // delay the AI player's turn by 500ms for better user experience
      }
    }
  }
}

function renderBoard(boardElement, gameBoard, isPlayerBoard) {
  const boardTable = document.createElement('table')

  for (let row = 0; row < 10; row++) {
    const tableRow = document.createElement('tr')

    for (let col = 0; col < 10; col++) {
      const tableCell = document.createElement('td')
      const cell = gameBoard.grid[`${row}-${col}`]

      if (isPlayerBoard && cell && cell.ship) {
        tableCell.classList.add('ship')
        tableCell.style.backgroundColor = `hsl(${cell.ship.length * 60}, 100%, 50%)`
      }

      if (cell && cell.hit) {
        tableCell.classList.add('hit')
        tableCell.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'
        tableCell.style.backgroundImage =
          'linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.7) 55%, transparent 55%)'
        tableCell.setAttribute('data-attacked', 'true')
      } else if (
        gameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        )
      ) {
        tableCell.classList.add('miss')
        tableCell.textContent = '•'
        tableCell.setAttribute('data-attacked', 'true')
      }

      tableRow.appendChild(tableCell)
    }
    boardTable.appendChild(tableRow)
  }

  boardElement.innerHTML = ''
  boardElement.appendChild(boardTable)
}

// This function prompts the player to place ships
function placingShips() {
  const ships = [
    { name: 'carrier', length: 5 },
    { name: 'battleship', length: 4 },
    { name: 'submarine', length: 3 },
    { name: 'submarine', length: 3 },
    { name: 'destroyer', length: 2 },
  ]

  let currentShipIndex = 0
  const playerBoard = document.querySelector('.board.p1')
  const messageContainer = document.querySelector('.message-container')

  function displayMessage(message) {
    messageContainer.textContent = message
  }

  function handleCellClick(event) {
    const row = event.target.parentNode.rowIndex
    const col = event.target.cellIndex
    const ship = ships[currentShipIndex]

    if (
      row < 0 ||
      row >= 10 ||
      col < 0 ||
      col + ship.length > 10 ||
      !canPlaceShip(player1.gameBoard, { row, col }, ship.length, 'horizontal')
    ) {
      displayMessage('Invalid placement. Please try again.')
      return
    }

    player1.gameBoard.placeShip({ row, col }, ship.length)
    renderBoard(playerBoard, player1.gameBoard, true)

    currentShipIndex++

    if (currentShipIndex === ships.length) {
      playerBoard.removeEventListener('click', handleCellClick)
      displayMessage(
        'All ships placed! Click the enemy board to start the game.'
      )
    } else {
      const shipName = ships[currentShipIndex].name
      displayMessage(
        `Place your ${shipName} (length ${ships[currentShipIndex].length}).`
      )
    }
  }

  playerBoard.addEventListener('click', handleCellClick)
  displayMessage('Place your carrier (length 5).')
}

// Helper function to check if a ship can be placed at the given coordinates
function canPlaceShip(gameBoard, coordinates, shipLength, orientation) {
  const { row, col } = coordinates

  if (orientation === 'horizontal') {
    if (col + shipLength > 10) return false

    for (let i = col; i < col + shipLength; i++) {
      const cell = `${row}-${i}`
      if (gameBoard.grid[cell]) return false
    }
  } else {
    if (row + shipLength > 10) return false

    for (let i = row; i < row + shipLength; i++) {
      const cell = `${i}-${col}`
      if (gameBoard.grid[cell]) return false
    }
  }

  return true
}

function placeAIShips(gameBoard) {
  const ships = [
    { name: 'carrier', length: 5 },
    { name: 'battleship', length: 4 },
    { name: 'submarine', length: 3 },
    { name: 'submarine', length: 3 },
    { name: 'destroyer', length: 2 },
  ]

  for (const ship of ships) {
    let validCoordinates = false
    let row, col

    while (!validCoordinates) {
      row = Math.floor(Math.random() * 10)
      col = Math.floor(Math.random() * (10 - ship.length + 1)) // ensure ship fits within bounds

      if (canPlaceShip(gameBoard, { row, col }, ship.length, 'horizontal')) {
        validCoordinates = true
        gameBoard.placeShip({ row, col }, ship.length)
      }
    }
  }
}

function getShipCoordinates(row, col, length, orientation) {
  const coordinates = []

  if (orientation === 'horizontal') {
    for (let i = col; i < col + length; i++) {
      coordinates.push(`${row}-${i}`)
    }
  } else {
    for (let i = row; i < row + length; i++) {
      coordinates.push(`${i}-${col}`)
    }
  }

  return coordinates
}

const player1Board = document.querySelector('.board.p1')
const player2Board = document.querySelector('.board.p2')

const player1 = createPlayer()
const player2 = createPlayer(true) // AI player

placingShips()
placeAIShips(player2.gameBoard)

// player2.gameBoard.placeShip({ row: 1, col: 1 }, 5)
// player2.gameBoard.placeShip({ row: 3, col: 3 }, 4)
// player2.gameBoard.placeShip({ row: 6, col: 6 }, 3)
// player2.gameBoard.placeShip({ row: 7, col: 2 }, 3)
// player2.gameBoard.placeShip({ row: 9, col: 8 }, 2)

renderBoard(player1Board, player1.gameBoard, true)
renderBoard(player2Board, player2.gameBoard, true)

player2Board.addEventListener('click', (event) =>
  handleCellClick(event, player1, player2, player1Board, player2Board)
)
