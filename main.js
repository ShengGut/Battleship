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

function handleCellClick(
  event,
  player,
  enemyPlayer,
  playerBoardElement,
  enemyBoardElement
) {
  const cell = event.target
  const row = cell.parentNode.rowIndex
  const col = cell.cellIndex
  const attackCoordinates = { row, col }

  if (player.isValidAttack(attackCoordinates, enemyPlayer.gameBoard)) {
    const attackResult = player.attack(attackCoordinates, enemyPlayer.gameBoard)
    renderBoard(enemyBoardElement, enemyPlayer.gameBoard)

    if (attackResult) {
      console.log('Successful hit!')
    } else {
      console.log('Missed attack.')
    }

    const winner = player.checkForWinner(enemyPlayer.gameBoard)
    if (winner) {
      alert(`${winner} wins!`)
      // Reset the game or perform any other necessary actions
    } else if (player.isAI) {
      // AI player's turn
      player.attack(null, enemyPlayer.gameBoard)
      renderBoard(playerBoardElement, player.gameBoard)

      const winner = player.checkForWinner(enemyPlayer.gameBoard)
      if (winner) {
        alert(`${winner} wins!`)
        // Reset the game or perform any other necessary actions
      }
    }
  }
}

function renderBoard(boardElement, gameBoard) {
  const boardTable = document.createElement('table')

  for (let row = 0; row < 10; row++) {
    const tableRow = document.createElement('tr')

    for (let col = 0; col < 10; col++) {
      const tableCell = document.createElement('td')
      const cell = gameBoard.grid[`${row}-${col}`]

      if (cell && cell.ship) {
        tableCell.classList.add('ship')
        tableCell.style.backgroundColor = `hsl(${cell.ship.length * 60}, 100%, 50%)`
      }

      if (cell && cell.hit) {
        tableCell.classList.add('hit')
        tableCell.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'
        tableCell.style.backgroundImage =
          'linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.7) 55%, transparent 55%)'
      } else if (
        gameBoard.missedAttacks.some(
          (coord) => coord.row === row && coord.col === col
        )
      ) {
        tableCell.classList.add('miss')
        tableCell.textContent = '•'
      }

      tableRow.appendChild(tableCell)
    }
    boardTable.appendChild(tableRow)
  }

  boardElement.innerHTML = ''
  boardElement.appendChild(boardTable)
}

const player1Board = document.querySelector('.board.p1')
const player2Board = document.querySelector('.board.p2')

const player1 = createPlayer()
const player2 = createPlayer(true) // AI player

// Place ships on the game boards (you can use predetermined coordinates for now)
player1.gameBoard.placeShip({ row: 0, col: 0 }, 5)
player1.gameBoard.placeShip({ row: 2, col: 2 }, 4)
player1.gameBoard.placeShip({ row: 5, col: 5 }, 3)
player1.gameBoard.placeShip({ row: 8, col: 1 }, 3)
player1.gameBoard.placeShip({ row: 9, col: 6 }, 2)

player2.gameBoard.placeShip({ row: 1, col: 1 }, 5)
player2.gameBoard.placeShip({ row: 3, col: 3 }, 4)
player2.gameBoard.placeShip({ row: 6, col: 6 }, 3)
player2.gameBoard.placeShip({ row: 7, col: 2 }, 3)
player2.gameBoard.placeShip({ row: 9, col: 8 }, 2)

renderBoard(player1Board, player1.gameBoard)
renderBoard(player2Board, player2.gameBoard)

player2Board.addEventListener('click', (event) =>
  handleCellClick(event, player1, player2, player1Board, player2Board)
)
