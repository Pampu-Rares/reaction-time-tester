import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    try {
        const getLeaderboard = db.prepare(`
            SELECT * from stopwatch_tester_leaderboard
            ORDER BY achieved_time ASC, time_target DESC
            LIMIT 20
            `)
        const leaderboard = getLeaderboard.all()
        res.status(200).json({ leaderboard })
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    } 
})

router.post('/', (req, res) => {
    try {
        const addEntry = db.prepare(`
            INSERT INTO stopwatch_tester_leaderboard(username, time_target, achieved_time) VALUES(?, ?, ?)
            `)
        const result = addEntry.run(req.body.username, Number(req.body.timeTarget), Number(req.body.achievedTime))
        res.status(200).json({ message: "succes" , id: result.lastInsertRowid})
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

router.post('/:id', (req, res) => {
    try {
        const updateRecord = db.prepare(`
                UPDATE stopwatch_tester_leaderboard SET username = ?, time_target = ?, achieved_time = ? WHERE id = ?
            `)
        updateRecord.run(req.body.username, Number(req.body.timeTarget), Number(req.body.achievedTime), req.params.id)
        res.status(200).json({ message: "succes" })
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

export default router