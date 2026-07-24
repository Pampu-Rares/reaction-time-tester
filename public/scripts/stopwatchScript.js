const appContainer = document.getElementById("app-container")
const minigameArea = document.getElementById("minigame-container")
const timeSpan = document.getElementById("time-span")
const infoSpan = document.getElementById("info-span")
const playerTurn = document.getElementById("player")

const screenOverlay = document.getElementById("screen-overlay")
const modeSelector = document.getElementById("mode-selector-container")
const singlePlayerBtn = document.getElementById("single-player")
const twoPlayerBtn = document.getElementById("2-player")

const selectModeBtn = document.getElementById("select-mode")

const bestAttemptSpan = document.getElementById("best-attempt")
const currentAttemptSpan = document.getElementById("current-attempt")

const winnerDialog = document.getElementById("winner-dialog")

const changeGamemodeBtn = document.getElementById("change-gamemode")

const scoreboard = document.getElementById("scoreboard")
const playersScores = document.getElementById("players-scores")
const playerOneScore = document.getElementById("player-1-score")
const playerTwoScore = document.getElementById("player-2-score")

const timeSelector = document.getElementById("time-selector")

let roundStarted = false
let chosenTime = 10.000, startTime, endTime, elapsedTime
let player = 1//, playerOneWins = 0, playerTwoWins = 0
let timerInterval
let winner

function startTimer() {
    elapsedTime = 0
    startTime = null
    timeSpan.innerText = '0.000'
    timeSpan.style.opacity = '1';
    function update(currentTime) {
        if(startTime === null) startTime = currentTime
        elapsedTime = currentTime - startTime
        timeSpan.innerText = (elapsedTime/1000).toFixed(3)
        if(timeSpan.innerText >= 3.900) timeSpan.style.opacity = '0'
        if(timeSpan.innerText.split('.')[0] < 5)
            timerInterval = requestAnimationFrame(update)
    }
    timerInterval = requestAnimationFrame(update)
}

function playGame() {
    if(!roundStarted) {
        infoSpan.innerText = `Click at ${chosenTime}.000`
        startTimer()
        roundStarted = true
    }
    else endRound()
}

function endRound() {
    cancelAnimationFrame(timerInterval)
    endTime = performance.now()
    if(singlePlayer) {
        currentAttemptSpan.innerText = (Math.abs(chosenTime - ((endTime - startTime)/1000))).toFixed(3)
        if(!bestAttemptSpan.innerText || bestAttemptSpan.innerText > currentAttemptSpan.innerText)
            bestAttemptSpan.innerText = currentAttemptSpan.innerText
    } else {
        if(player === 1) {
            playerOneScore.innerText = (Math.abs(chosenTime - ((endTime - startTime)/1000))).toFixed(3) + 's'
        }
        else {
            playerTwoScore.innerText = (Math.abs(chosenTime - ((endTime - startTime)/1000))).toFixed(3) + 's'
        }  
    } 
    roundStarted = false
    winnerDialog.style.display = 'flex'
    winnerDialog.innerHTML = `
        <button id="close" onClick="${player === 2 ? 'showWinner()' : 'resetGame()'}">X</button>
        <h2 style="color: var(--text-color);">${singlePlayer ? 'See your' : 'Player ' + player} stats</h2>
        <div id="stats">
            <p style="color: var(--text-color);">Stopped At:</p>
            <p>${((endTime - startTime) / 1000).toFixed(3)}s</p>
            <p style="color: var(--text-color);">Delay:</p>
            <p>${singlePlayer ? currentAttemptSpan.innerText : player === 1 ? playerOneScore.innerText : playerTwoScore.innerText}</p>
        </div>
    `
    if(!singlePlayer) {
        if(player === 1) player = 2
        else player = 1
    }
    screenOverlay.style.display = 'flex'
    screenOverlay.style.opacity = '1'
    screenOverlay.style.pointerEvents = 'auto'
    appContainer.classList.add('blurred')
}

function resetGame(isFullReset = false) {
    appContainer.classList.remove('blurred')
    cancelAnimationFrame(timerInterval)
    roundStarted = false
    infoSpan.innerText = 'Press to Play'
    timeSpan.innerText = '0.000'
    timeSpan.style.opacity = '1'
    screenOverlay.style.opacity = '0'
    screenOverlay.style.pointerEvents = 'none'
    if(!singlePlayer) {
        if(player === 2 && !isFullReset)
            playerTurn.innerText = 'Player 2'
        else {
            player = 1
            playerTurn.innerText = 'Player 1'
            playerOneScore.innerText = 'TBD'
            playerTwoScore.innerText = 'TBD'
        }
    } else {
        playerTurn.innerText = ''
        if(!isFullReset)
            askForLeaderboardEntry((Math.abs(chosenTime - ((endTime - startTime)/1000))).toFixed(3), chosenTime)
    }

    setTimeout(() => {
        modeSelector.style.display = 'none'
        winnerDialog.style.display = 'none'
        screenOverlay.style.display = 'none'
    }, 301)
}

function closePopup() {
    appContainer.classList.remove("blurred")
    timeSpan.innerText = '0.000'
    timeSpan.style.opacity = '1'
    screenOverlay.style.opacity = '0' // I'll see later if i broke something
    screenOverlay.style.pointerEvents = 'none'
    playerTurn.innerText = 'Player 1'
    roundStarted = false
    minigameArea.style.backgroundColor = 'var(--secondary-color)'
    minigameArea.style.color = 'black'
    infoSpan.innerText = 'Press to play'
    if(winner == 1) askForLeaderboardEntry(playerOneScore.innerText.slice(0, -1), chosenTime)
    else askForLeaderboardEntry(playerTwoScore.innerText.slice(0, -1), chosenTime)
    playerOneScore.innerText = ''
    playerTwoScore.innerText = ''
    resetGame()
    setTimeout(() => {
        winnerDialog.style.display = 'none'
    }, 301)
}

function showWinner() {
    winner = 1
    if(playerOneScore.innerText == playerTwoScore.innerText) winner = null
    else if(playerOneScore.innerText.slice(0, playerOneScore.innerText.length - 1) > playerTwoScore.innerText.slice(0, playerTwoScore.innerText.length - 1)) winner = 2
    winnerDialog.style.display = 'flex'
    winnerDialog.innerHTML = `
        <button id="close" onClick="closePopup()">X</button>
        <h2>${!winner ? 'No one' : winner === 1 ? 'Player 1' : 'Player 2'} wins!</h2>
        <div id="stats">
            <p style="${winner === 1 ? 'color: green;' : ''}">Player 1</p>
            <p style="${winner === 1 ? 'color: green;' : ''}">${playerOneScore.innerText}</p>
            <p style="${winner === 2? 'color: green;' : ''}">Player 2</p>
            <p style="${winner === 2 ? 'color: green;' : ''}">${playerTwoScore.innerText}</p>
        </div>
    `
    screenOverlay.style.opacity = '1'
    screenOverlay.style.pointerEvents = 'auto'
    appContainer.classList.add("blurred")

    playerTurn.innerText = ''
    bestAttemptSpan.innerText = ''
    currentAttemptSpan.innerText = ''
}

minigameArea.addEventListener("click", () => {
    playGame()
})

window.addEventListener("keydown", (e) => {
    if(e.key === ' ' && screenOverlay.style.opacity == '0' && !newEntryDialog.hasAttribute('open')) {
        e.preventDefault()
        playGame()
    }
})

function hideMainDialog() {
    appContainer.classList.remove("blurred")
    screenOverlay.style.opacity = '0'
    screenOverlay.style.pointerEvents = 'none'
    infoSpan.innerText = 'Press to play'
    timeSpan.innerText = '0.000'
    timeSpan.style.opacity = '1'
    roundStarted = false
    player = 1

    if(singlePlayer) {
        playerTurn.innerText = ''
        playersScores.style.display = 'none'
        bestAttemptSpan.innerText = ''
        currentAttemptSpan.innerText = ''
        scoreboard.style.display = 'grid'
    }
    else {
        scoreboard.style.display = 'none'
        playerTurn.innerText = `Player 1`
        playersScores.style.display = 'grid'
        playerOneScore.innerText = 'TBD'
        playerTwoScore.innerText = 'TBD'
    }
    setTimeout(() => {
        modeSelector.style.display = 'none'
    }, 301)
}

singlePlayerBtn.addEventListener("click", () => {
    singlePlayer = true
    hideMainDialog()
})

twoPlayerBtn.addEventListener("click", () => {
    singlePlayer = false
    hideMainDialog()
})

selectModeBtn.addEventListener("click", () => {
    appContainer.classList.add("blurred")
    modeSelector.style.display = 'flex'
    cancelAnimationFrame(timerInterval)

    screenOverlay.style.display = 'flex'
    screenOverlay.style.opacity = '1'
    screenOverlay.style.pointerEvents = 'auto'
})

changeGamemodeBtn.addEventListener("click", () => {
    window.location = './index.html'
})

timeSelector.addEventListener("change", () => {
    chosenTime = Number(timeSelector.value)
    resetGame(true)
})