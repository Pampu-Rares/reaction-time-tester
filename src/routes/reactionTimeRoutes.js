import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    try {
        const getLeaderboard = db.prepare(`
            SELECT * from reaction_time_leaderboard
            ORDER BY time ASC
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
        if(req.time <= 0.12) {
            res.status(403).json({ message: "It is impossible for the player to have had such good reaction"})
        }
        const addEntry = db.prepare(`
            INSERT INTO reaction_time_leaderboard(username, time) VALUES(?, ?)
            `)
        const result = addEntry.run(req.body.username, Number(req.body.time))
        res.status(200).json({ message: "succes" , id: result.lastInsertRowid})
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

router.post('/:id', (req, res) => {
    try {
        const updateRecord = db.prepare(`
                UPDATE reaction_time_leaderboard SET username = ?, time = ? WHERE id = ?
            `)
        updateRecord.run(req.body.username, req.body.time, req.params.id)
        res.status(200).json({ message: "succes" })
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

export default router