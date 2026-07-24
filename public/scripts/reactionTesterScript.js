const appContainer = document.getElementById("app-container")
const minigameArea = document.getElementById("minigame-container")
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
const twoPRound = document.getElementById("2-p-round")

let roundStarted = false, doNotPress = false, isResetting = false
let waitingInterval
let startTime, endTime
let player = 1, playerOneWins = 0, playerOneInterval, playerTwoWins = 0, playerTwoInterval, playsCount = 0
let winner

function singlePlayerMode() {
    if(!roundStarted) {
        infoSpan.innerText = 'Click when the color turns blue'
        minigameArea.style.backgroundColor = 'var(--primary-color)'
        minigameArea.style.color = 'var(--background-color)'
        roundStarted = true
        doNotPress = true
        const timeToWait = (Math.random() * 5000) + 2001
        waitingInterval = setTimeout(() => {
            minigameArea.style.backgroundColor = 'var(--secondary-color)'
            minigameArea.style.color = 'black'
            infoSpan.innerText = 'Click'
            doNotPress = false
            startTime = performance.now()
        }, timeToWait)
    }
    else if(doNotPress) {
        isResetting = true
        infoSpan.innerText = 'You pressed too soon'
        currentAttemptSpan.innerText = 'early'
        setTimeout(() => {
            minigameArea.style.backgroundColor = 'var(--secondary-color)'
            minigameArea.style.color = 'black'
            infoSpan.innerText = 'Click'
            doNotPress = false
            roundStarted = false
            isResetting = false
        }, 2000)
        clearTimeout(waitingInterval)
    }
    else {
        endTime = performance.now()
        timeInterval = ((endTime - startTime)/1000).toPrecision(3)
        infoSpan.innerText = timeInterval + ' seconds. Click again when ready'
        currentAttemptSpan.innerText = timeInterval
        if(bestAttemptSpan.innerText === '' || Number(bestAttemptSpan.innerText) > timeInterval) {
            bestAttemptSpan.innerText = timeInterval
            askForLeaderboardEntry(bestAttemptSpan.innerText)  
        }
        roundStarted = false
    }
}

function closePopup() {
    appContainer.classList.remove("blurred")
    screenOverlay.style.opacity = '0'
    screenOverlay.style.pointerEvents = 'none'
    if(winner) {
        if(winner === 1) {
            nameInput.value = 'Player 1'
            askForLeaderboardEntry(playerOneInterval)
        } else {
            nameInput.value = 'Player 2'
            askForLeaderboardEntry(playerTwoInterval)
        }
    }
    playerTurn.innerText = 'Player 1'
    twoPRound.innerText = 'Round 0/3'
    playsCount = 0
    doNotPress = false
    roundStarted = false
    playerOneInterval = undefined
    playerTwoInterval = undefined
    minigameArea.style.backgroundColor = 'var(--secondary-color)'
    minigameArea.style.color = 'black'
    infoSpan.innerText = 'Press to play'
    playerOneScore.innerText = ''
    playerTwoScore.innerText = ''


    setTimeout(() => {
        winnerDialog.style.display = 'none'
    }, 301)
}

function showWinner() {
    if(playerOneInterval == playerTwoInterval || (!playerOneInterval && !playerTwoInterval)) winner = null
    else if(playerOneInterval < playerTwoInterval || !playerTwoInterval) winner = 1
    else winner = 2
    winnerDialog.style.display = 'flex'
    winnerDialog.innerHTML = `
        <button id="close" onClick="closePopup()">X</button>
        <h2>${!winner ? 'No one' : winner === 1 ? 'Player 1' : 'Player 2'} wins!</h2>
        <div id="stats">
            <p style="${winner === 1 ? 'color: green;' : ''}">Player 1</p>
            <p style="${winner === 1 ? 'color: green;' : ''}">${playerOneInterval}</p>
            <p style="${winner === 2 ? 'color: green;' : ''}">Player 2</p>
            <p style="${winner === 2 ? 'color: green;' : ''}">${playerTwoInterval}</p>
        </div>
    `
    screenOverlay.style.opacity = '1'
    screenOverlay.style.pointerEvents = 'auto'
    appContainer.classList.add("blurred")

    playerTurn.innerText = ''
    bestAttemptSpan.innerText = ''
    currentAttemptSpan.innerText = ''
}

function twoPlayerMode() {
    if(playsCount < 3) playerTurn.innerText = `Player 1`
    else playerTurn.innerText = `Player 2`
    if(!roundStarted) {
        playsCount++
        if(playsCount <= 3) {
            twoPRound.innerText = `Round ${playsCount}/3`
        } else if(playsCount == 4) {
            bestAttemptSpan.innerText = ''
            currentAttemptSpan.innerText = ''
            twoPRound.innerText = `Round ${playsCount - 3}/3`
        } else {
            twoPRound.innerText = `Round ${playsCount - 3}/3`
        } 
        
        infoSpan.innerText = 'Click when the color turns blue'
        minigameArea.style.backgroundColor = 'var(--primary-color)'
        minigameArea.style.color = 'var(--background-color)'
        roundStarted = true
        doNotPress = true
        const timeToWait = (Math.random() * 5000) + 2001
        waitingInterval = setTimeout(() => {
            minigameArea.style.backgroundColor = 'var(--secondary-color)'
            minigameArea.style.color = 'black'
            infoSpan.innerText = 'Click'
            doNotPress = false
            startTime = performance.now()
        }, timeToWait)
    }
    else if(doNotPress) {
        isResetting = true
        infoSpan.innerText = 'You pressed too soon'
        currentAttemptSpan.innerText = 'early'
        setTimeout(() => {
            minigameArea.style.backgroundColor = 'var(--secondary-color)'
            minigameArea.style.color = 'black'
            infoSpan.innerText = 'Click'
            doNotPress = false
            roundStarted = false
            isResetting = false
        }, 2000)
        clearTimeout(waitingInterval)
        if(playsCount == 3)
            playerTurn.innerText = "It is now player 2's turn"
        else if(playsCount == 6) showWinner()
    }
    else {
        endTime = performance.now()
        roundStarted = false
        timeInterval = ((endTime - startTime)/1000).toPrecision(3)
        if(playsCount == 3) {
            playerTurn.innerText = "It is now player 2's turn. Click when ready"
            infoSpan.innerText = timeInterval + ' seconds.'
        } else infoSpan.innerText = timeInterval + ' seconds. Click again when ready'
        
        currentAttemptSpan.innerText = timeInterval
        if(bestAttemptSpan.innerText === '' || Number(bestAttemptSpan.innerText) > timeInterval) {
            bestAttemptSpan.innerText = timeInterval
            if(playsCount <=3) {
                playerOneInterval = timeInterval
                playerOneScore.innerText = timeInterval
            } 
            else {
                playerTwoInterval = timeInterval
                playerTwoScore.innerText = timeInterval
            } 
        }
        if(playsCount == 6) showWinner()
    }
}

minigameArea.addEventListener("click", () => {
    if(!isResetting) {
        if(!singlePlayer) twoPlayerMode()
            else singlePlayerMode()
    }
})

window.addEventListener("keydown", (e) => {
    if(e.key === ' ' && screenOverlay.style.opacity == '0' && !newEntryDialog.hasAttribute('open')) {
        e.preventDefault()
        if(!singlePlayer) twoPlayerMode()
        else singlePlayerMode()
    }
})

function hideMainDialog() {
    appContainer.classList.remove("blurred")
    screenOverlay.style.opacity = '0'
    screenOverlay.style.pointerEvents = 'none'
    minigameArea.style.backgroundColor = 'var(--secondary-color)'
    minigameArea.style.color = 'black'
    infoSpan.innerText = 'Click'
    roundStarted = false
    doNotPress = false

    if(singlePlayer) {
        twoPRound.style.display = 'none'
        playerTurn.innerText = ''
        playersScores.style.display = 'none'
        bestAttemptSpan.innerText = ''
        currentAttemptSpan.innerText = ''
        scoreboard.style.display = 'grid'
    }
    else {
        twoPRound.style.display = 'inline-block'
        twoPRound.innerText = 'Round 1/3'
        scoreboard.style.display = 'none'
        playerTurn.innerText = `Player 1`
        playerOneScore.innerText = ''
        playerTwoScore.innerText = ''
        playersScores.style.display = 'grid'
        playsCount = 0
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

    screenOverlay.style.opacity = '1'
    screenOverlay.style.pointerEvents = 'auto'
})

changeGamemodeBtn.addEventListener("click", () => {
    window.location = 'index.html'
})