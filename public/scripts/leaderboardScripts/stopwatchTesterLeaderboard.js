const leaderboardDiv = document.getElementById("leaderboard")
const newEntryDialog = document.querySelector("dialog")
const achievedTimeSpan = document.getElementById("achieved-time-span")
const timeTargetSpan = document.getElementById("time-target-span")
const submitEntryBtn = document.getElementById("submit-leaderboard-entry")
const nameInput = document.getElementById("new-entry-name")
const exitEntryDialog = document.getElementById("close-leaderboard-entry-container")

let leaderboardEntries = []
let stopwatchRecordId = sessionStorage.getItem("stopwatchRecordId") || null

async function getLeaderboard() {
    try {
        let htmlTableString = `
            <thead>
                <th>Place</th>
                <th>Name</th>
                <th>Time</th>
                <th>Target</th>
            </thead>
            <tbody>
        `
        leaderboardEntries = await fetch('/stopwatchTester/')
        leaderboardEntries = await leaderboardEntries.json()
        leaderboardEntries = leaderboardEntries.leaderboard
        console.log(leaderboardEntries)
        leaderboardEntries.forEach((position, index) => {
        htmlTableString += `
        <tr>
            <th>${index + 1}</th>
            <td>${position.username}</td>
            <td>${position.achieved_time.toFixed(3)}s</td>
            <td>${position.time_target}s</td>
        </tr>`
        })
        htmlTableString += '</tbody>'
        leaderboardDiv.innerHTML += htmlTableString
    } catch(err) {
        leaderboardDiv.innerHTML = '<p>' + err.message + '</p'
    }
}

async function enterNewRecord(username, achievedTime, timeTarget) {
    leaderboardDiv.innerHTML = ''
    fetch('/stopwatchTester/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            achievedTime,
            timeTarget
        })
    }).then(res => res.json())
    .then(data => {
        sessionStorage.setItem("stopwatchRecordId", data.id)
        stopwatchRecordId = data.id
        getLeaderboard()
    })
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function editRecord(username, achievedTime, timeTarget) {
    leaderboardDiv.innerHTML = ''
    fetch('/stopwatchTester/' + stopwatchRecordId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            achievedTime,
            timeTarget
        })
    }).then(() => {getLeaderboard()})
    .catch(err => leaderboardDiv.innerHTML = '<p>' + err.message + '</p>')
}

async function enterEntry() {
    if(!(String(nameInput.value).trim().length)) {
        alert("You need to fill in your name")
    } else {
        if(!stopwatchRecordId) enterNewRecord(nameInput.value, achievedTimeSpan.innerText, timeTargetSpan.innerText)
            else editRecord(nameInput.value, achievedTimeSpan.innerText, timeTargetSpan.innerText)
        newEntryDialog.close()
    }
}

function askForLeaderboardEntry(time, targetTime) {
    if( leaderboardEntries.length < 20 || time < leaderboardEntries[leaderboardEntries.length - 1].time || (time == leaderboardEntries[leaderboardEntries.length - 1].time && targetTime > leaderboardEntries[leaderboardEntries.length - 1].achieved_time) ) {
        let oldRecord
        if(stopwatchRecordId)
            oldRecord = leaderboardEntries.find(record => record.id == stopwatchRecordId)
        if(!stopwatchRecordId || (stopwatchRecordId && (targetTime > oldRecord.time_target || oldRecord.achieved_time > time))) {
        achievedTimeSpan.innerText = time
        timeTargetSpan.innerText = targetTime
        newEntryDialog.showModal()

        }
    }
}


submitEntryBtn.addEventListener("click", enterEntry)

exitEntryDialog.addEventListener("click", () => {
    newEntryDialog.close()
})

getLeaderboard()