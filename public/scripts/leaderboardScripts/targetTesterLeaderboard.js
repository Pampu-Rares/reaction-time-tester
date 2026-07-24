const leaderboardDiv = document.getElementById("leaderboard")
const newEntryDialog = document.querySelector("dialog")
const achievedTimeSpan = document.getElementById("achieved-time-span")
const difficultySpan = document.getElementById("difficulty-span")
const targetsMissedRecordSpan = document.getElementById("targets-missed-record-span")
const submitEntryBtn = document.getElementById("submit-leaderboard-entry")
const nameInput = document.getElementById("new-entry-name")
const exitEntryDialog = document.getElementById("close-leaderboard-entry-container")

let leaderboardEntries = []
let targetTesterRecordId = sessionStorage.getItem("targetTesterRecordId") || null

const difficulties = {
    "1": "Easy",
    "2": "Medium",
    "3": "Hard"
}

async function getLeaderboard() {
    try {
        let htmlTableString = `
            <thead>
                <th>Place</th>
                <th>Name</th>
                <th>Time</th>
                <th>Missed</th>
                <th>Difficulty</th>
            </thead>
            <tbody>
        `
        leaderboardEntries = await fetch('/targetTester/')
        leaderboardEntries = await leaderboardEntries.json()
        leaderboardEntries = leaderboardEntries.leaderboard
        leaderboardEntries.forEach((position, index) => {
        htmlTableString += `
        <tr>
            <th>${index + 1}</th>
            <td>${position.username}</td>
            <td>${position.time.toFixed(3)}s</td>
            <td>${position.targets_missed}</td>
            <td>${difficulties[position.difficulty]}</td>
        </tr>`
        })
        htmlTableString += '</tbody>'
        leaderboardDiv.innerHTML += htmlTableString
    } catch(err) {
        leaderboardDiv.innerHTML = '<p>' + err.message + '</p'
    }
}

async function enterNewRecord(username, time, difficulty, missed) {
    leaderboardDiv.innerHTML = ''
    fetch('/targetTester/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            time,
            difficulty,
            targets_missed: missed
        })
    }).then(res => res.json())
    .then(data => {
        sessionStorage.setItem("targetTesterRecordId", data.id)
        targetTesterRecordId = data.id
        getLeaderboard()
    })
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function editRecord(username, time, difficulty, missed) {
    leaderboardDiv.innerHTML = ''
    fetch('/targetTester/' + targetTesterRecordId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            time,
            difficulty,
            targets_missed: missed
        })
    }).then(() => {getLeaderboard()})
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function enterEntry() {
    if(!(String(nameInput.value).trim().length)) {
        alert("You need to fill in your name")
    } else {
        if(!targetTesterRecordId) enterNewRecord(nameInput.value, achievedTimeSpan.innerText, getKeyByValue(difficulties, difficultySpan.innerText), targetsMissedRecordSpan.innerText)
            else editRecord(nameInput.value, achievedTimeSpan.innerText, getKeyByValue(difficulties, difficultySpan.innerText), targetsMissedRecordSpan.innerText)
        newEntryDialog.close()
    }
}

function askForLeaderboardEntry(time, difficulty, missed) {
    if( leaderboardEntries.length < 20 || time < leaderboardEntries[leaderboardEntries.length - 1].time || (time == leaderboardEntries[leaderboardEntries.length - 1].time && getKeyByValue(difficulties, difficulty) > leaderboardEntries[leaderboardEntries.length - 1].difficulty) ) {
        const oldRecord = leaderboardEntries.find(entry => entry.id == targetTesterRecordId)
        if(!targetTesterRecordId || (targetTesterRecordId && (difficulty > oldRecord.difficulty || (difficulty == oldRecord.difficulty && (oldRecord.time > time || oldRecord.targets_missed > missed))))) {
            achievedTimeSpan.innerText = time
            difficultySpan.innerText = difficulties[difficulty]
            targetsMissedRecordSpan.innerText = missed
            newEntryDialog.showModal()
        }
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key =>
        object[key] === value);
}

submitEntryBtn.addEventListener("click", enterEntry)

exitEntryDialog.addEventListener("click", () => {
    newEntryDialog.close()
})

getLeaderboard()