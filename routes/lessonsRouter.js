const express = require('express')
const ObjectId = require('mongodb').ObjectId;
const router = express.Router()

router.get('/', async (req, res) =>{
    try {
        const lessons = await req.db.collection('lessons').find().toArray()
        res.json(lessons)
    } catch (error) {
        res.status(500).send("Error retrieving lessons")
    }
})

router.get('/search', async (req, res) => {
    try {
        const { subject, location } = req.query;
        const query = {};

        if (subject) {
            query.subject = { $regex: new RegExp(subject, 'i') }; // Case-insensitive search
        }

        if (location) {
            query.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive search
        }

        const lessons = await req.db.collection('lessons').find(query).toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).send('Error retrieving lessons');
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ msg: 'Invalid ID' });
        }

        const result = await req.db.collection('lessons').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { upsert: false }
        );

        if (result.matchedCount === 1) {
            res.send({ msg: 'success' });
        } else {
            res.send({ msg: 'error' });
        }
    } catch (err) {
        next(err);
    }
});






module.exports = router;




module.exports = router;