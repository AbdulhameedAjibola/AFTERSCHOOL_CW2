const express = require('express')
const router = express.Router()

router.get('/', async (req, res) =>{
    try {
        const lessons = await req.db.collection('lessons').find().toArray()
        res.json(lessons)
    } catch (error) {
        res.status(500).send("Error retrieving lessons")
    }
})


module.exports = router;