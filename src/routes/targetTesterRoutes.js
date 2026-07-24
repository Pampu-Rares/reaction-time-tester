import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    try {
        const getLeaderboard = db.prepare(`
            SELECT * from target_tester_leaderboard
            ORDER BY difficulty DESC, targets_missed ASC, time ASC
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
            INSERT INTO target_tester_leaderboard(username, time, difficulty, targets_missed) VALUES(?, ?, ?, ?)
            `)
        const result = addEntry.run(req.body.username, Number(req.body.time), parseInt(req.body.difficulty), parseInt(req.body.targets_missed))
        res.status(200).json({ message: "succes" , id: result.lastInsertRowid})
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

router.post('/:id', (req, res) => {
    try {
        const updateRecord = db.prepare(`
                UPDATE target_tester_leaderboard SET username = ?, time = ?, difficulty = ?, targets_missed = ? WHERE id = ?
            `)
        updateRecord.run(req.body.username, Number(req.body.time), parseInt(req.body.difficulty), parseInt(req.body.targets_missed), req.params.id)
        res.status(200).json({ message: "succes" })
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})


//to delete wrong entries
router.delete('/:id', (req, res) => {
    try {
        const deleteRecord = db.prepare(`
                DELETE FROM target_tester_leaderboard WHERE id = ?
            `)
        deleteRecord.run(req.params.id)
        res.status(200).json({ message: "succes" })
    } catch(err) {
        console.log('ERROR: ' + err.message)
        res.status(500)
    }
})

export default router