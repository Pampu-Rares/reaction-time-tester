const leaderboardDiv = document.getElementById("leaderboard")
const newEntryDialog = document.querySelector("dialog")
const timeSpan = document.getElementById("time-span")
const submitEntryBtn = document.getElementById("submit-leaderboard-entry")
const nameInput = document.getElementById("new-entry-name")
const exitEntryDialog = document.getElementById("close-leaderboard-entry-container")

let leaderboardEntries = []
let reactionTesterRecordId = sessionStorage.getItem("reactionTesterRecordId") || null

async function getLeaderboard() {
    try {
        let htmlTableString = '<tbody>'
        leaderboardEntries = await fetch('/reactionTime/')
        leaderboardEntries = await leaderboardEntries.json()
        leaderboardEntries = leaderboardEntries.leaderboard
        leaderboardEntries.forEach((position, index) => {
        htmlTableString += `
        <tr>
            <th>${index + 1}</th>
            <td>${position.username}</td>
            <td>${position.time.toFixed(3)}s</td>
        </tr>`
        })
        htmlTableString += '</tbody>'
        leaderboardDiv.innerHTML += htmlTableString
    } catch(err) {
        leaderboardDiv.innerHTML = '<p>' + err.message + '</p'
    }
}

async function enterNewRecord(username, time) {
    leaderboardDiv.innerHTML = ''
    fetch('/reactionTime/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            time
        })
    }).then(res => res.json())
    .then(data => {
        sessionStorage.setItem("reactionTesterRecordId", data.id)
        reactionTesterRecordId = data.id
        getLeaderboard()
    })
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function editRecord(username, time) {
    leaderboardDiv.innerHTML = ''
    fetch('/reactionTime/' + reactionTesterRecordId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            time
        })
    }).then(() => {getLeaderboard()})
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function enterEntry() {
    if(!(String(nameInput.value).trim().length)) {
        alert("You need to fill in your name")
    } else {
        if(!reactionTesterRecordId) enterNewRecord(nameInput.value, timeSpan.innerText)
            else editRecord(nameInput.value, timeSpan.innerText)
        newEntryDialog.close()
    }
}

function askForLeaderboardEntry(time) {
    if(time < leaderboardEntries[leaderboardEntries.length - 1].time || leaderboardEntries.length < 20) {
        if(!reactionTesterRecordId || (reactionTesterRecordId && timeSpan.innerText > time)) {
            timeSpan.innerText = time
            newEntryDialog.showModal()
        }
    }
}


submitEntryBtn.addEventListener("click", enterEntry)

exitEntryDialog.addEventListener("click", () => {
    newEntryDialog.close()
})

getLeaderboard()