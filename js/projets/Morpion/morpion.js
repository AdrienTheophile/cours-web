//CONST ET VAR

const cells = document.querySelectorAll(".cell")
const statusText = document.querySelector("#statusText")
const restartBtn = document.querySelector("#restartBtn")
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = [ "", "", "", "", "", "", "", "", ""]
let currentPlayer = "X"
let startingPlayer = "X"
let running = false

let scoreX = 0
let scoreO = 0

//FONCTIONS

init()

function init(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
    restartBtn.addEventListener("click", restart)
    statusText.textContent = `Au tour de ${currentPlayer}`
    updateScoreboard()
    running = true
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex")

    if( options[cellIndex] != "" | !running ) return

    updateCell(this, cellIndex)
    checkWinner()
}

function updateCell( cell, index){
    options[index] = currentPlayer
    cell.textContent = currentPlayer
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X"
    statusText.textContent = `Au tour de ${currentPlayer}`
}

function checkWinner(){
    let roundWon = false

    for ( let i=0; i<winConditions.length; i++ ) {
        const condition = winConditions[i]
        const cellA = options[condition[0]]
        const cellB = options[condition[1]]
        const cellC = options[condition[2]]

        if ( cellA == "" || cellB == "" || cellC == "" ) continue

        if ( cellA == cellB && cellB == cellC ) {
            roundWon = true
            break
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} a GAGNÉ !`
        running = false

        if (currentPlayer === "X") scoreX++
        else scoreO++
        updateScoreboard()

    } else if ( !options.includes("") ) {
        statusText.textContent = `ÉGALITÉ !`
        running = false

    } else {
        changePlayer()
    }
}

function updateScoreboard() {
    document.querySelector("#scoreX").textContent = `X : ${scoreX}`
    document.querySelector("#scoreO").textContent = `O : ${scoreO}`
}

function restart(){
    startingPlayer = (startingPlayer === "X") ? "O" : "X"
    currentPlayer = startingPlayer

    options = ["", "", "", "", "", "", "", "", ""]
    statusText.textContent = `Au tour de ${currentPlayer}`
    cells.forEach(cell => cell.textContent = "")
    running = true
}
