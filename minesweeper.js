document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {}
var easyNumCells = 9
var mediumNumCells = 16
var hardNumCells = 25

var numCells = easyNumCells

generateBoard(numCells)
displayBoardInConsole()

function generateBoard (numCells) {
  board.cells = [numCells]

  index = 0
  for(var i = 0; i < Math.sqrt(numCells); i++) {
    for(var j = 0; j < Math.sqrt(numCells); j++) {
      temp = {row: i+1, col: j+1, isMine: false, isMarked: false, hidden: true }
      board.cells[index] = temp;
      index++
    }
  }
  generateMines(numCells)
}

// This function changes the difficulty level of the game (the number of cells in the board)
//It then call the function reset board to get a new board
function changeDifficulty() {

  if(document.getElementById('easyLevel').checked) {
    numCells = easyNumCells
  }
  if(document.getElementById('intermediateLevel').checked) {
    numCells = mediumNumCells
  }
  if(document.getElementById('difficultLevel').checked) {
    numCells = hardNumCells
  }

  resetBoard()

}

// This function generates a random number of mines between a minimum of sq root of total cells
// and half number of cells, it then randomly selects a cell to place a mine, reselecting if that cell
// has been previously chosen
function generateMines (numCells) {
  minNumMines = Math.sqrt(numCells)
  maxNumMines = Math.floor(numCells/2)

  numMines = Math.floor((Math.random() * (maxNumMines - minNumMines + 1)) + minNumMines);

  for (var x = 0; x < numMines; x++) {
    var keepSearching = true
    while(keepSearching) {
      var randCell = Math.floor( (Math.random() * numCells) )
      if(board.cells[randCell].isMine === false) {
        board.cells[randCell].isMine = true;
        keepSearching = false
      }
    }
  }
}

//This will reset the board by deleting the children (the cells) from the board parent node
//It will then recreate the cells and call the startGame func
function resetBoard() {

  var oldBoard = document.getElementsByClassName('board')[0]
  while(oldBoard.firstChild) {
    oldBoard.removeChild(oldBoard.firstChild)
  }
  board.cells = []
  generateBoard(numCells)
  startGame()
  displayBoardInConsole()
}

function startGame () {
  // Don't remove this function call: it makes the game work!
  for (var i = 0; i < board.cells.length; i++) {
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i])
  }
  lib.initBoard()

  document.addEventListener('click', checkForWin)
  document.addEventListener('contextmenu', checkForWin)
  document.getElementById('newGame').addEventListener('click', resetBoard)
  document.getElementById('difficultyLevel').addEventListener('click', changeDifficulty)
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {

  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  for (var i = 0; i < board.cells.length; i++) {
    if(board.cells[i].isMine &&  !board.cells[i].isMarked === true) {
      return
    }
    if(board.cells[i].hidden === true && board.cells[i].isMine === false) {
      return
    }
  }
  lib.displayMessage('You win!')
  lib.playWinningSound()
}

// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`:
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  var surrounding = lib.getSurroundingCells(cell.row, cell.col)
  var count = 0
  for (var i = 0; i < surrounding.length; i++) {
    if(surrounding[i].isMine === true) {
      count++
    }
  }
  return count
}

//This function will display an ascii representation of the board with mines shown in X's
function displayBoardInConsole() {
  var boardDisplay = ""
  var rowLength = Math.ceil(Math.sqrt(numCells))

  for (var i = 1; i <= numCells; i++) {
    if(board.cells[i-1].isMine === true) {
      boardDisplay += "[X]"
    }
    else {
      if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        boardDisplay += "[ ]"
      }
      else {
        boardDisplay += "[  ]"
      }

    }
    if(i % rowLength === 0) {
      boardDisplay += "\n"
    }
  }
  console.log(boardDisplay)
}
