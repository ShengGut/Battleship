import './style.css'

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

function handleCellClick(event) {
  const cell = event.target
}

function renderBoard(boardElement) {
  const boardTable = document.createElement('table')

  for (let row = 0; row < 10; row++) {
    const tableRow = document.createElement('tr')

    for (let col = 0; col < 10; col++) {
      const tableCell = document.createElement('td')
      tableCell.addEventListener('click', handleCellClick)
      tableRow.appendChild(tableCell)
    }
    boardTable.appendChild(tableRow)
  }
  boardElement.innerHTML = ''
  boardElement.appendChild(boardTable)
}

// Render the game boards
const player1Board = document.querySelector('.board.p1')
const player2Board = document.querySelector('.board.p2')
renderBoard(player1Board)
renderBoard(player2Board)
