const reactionTimeRedirectBtn = document.getElementById("reaction-time")
const targetTesterRedirectBtn = document.getElementById("target-tester")
const stopwatchTestRedirect = document.getElementById("stopwatch-test")

reactionTimeRedirectBtn.addEventListener("click", () => {
    window.location = './reactionTester.html'
})

targetTesterRedirectBtn.addEventListener("click", () => {
    window.location = './targetTester.html'
})

stopwatchTestRedirect.addEventListener("click", () => {
    window.location = './stopwatchTester.html'
})