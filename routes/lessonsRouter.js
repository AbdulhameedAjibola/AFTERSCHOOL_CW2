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


outer.put('/:id', async (req, res, next) => {
    try {
        const lessonId = new ObjectId(req.params.id);
        console.log('Lesson ID:', lessonId); // Debug: Log lessonId
        const decrementValue = req.body.decrementValue;
        console.log('Decrement Value:', decrementValue); // Debug: Log decrementValue
        const update = { $inc: { availability: -decrementValue } };
        console.log('Update:', update); // Debug: Log update operation
        const result = await req.db.collection('lessons').updateOne({ _id: lessonId }, update);

        if (result.matchedCount === 1) {
            res.send({ msg: 'Lesson availability updated successfully' });
        } else {
            res.status(404).send({ msg: 'Lesson not found' });
        }
    } catch (err) {
        console.error('Error updating lesson availability:', err);
        res.status(500).send({ msg: 'Error updating lesson availability' });
        next(err);
    }
});




module.exports = router;




// module.exports = router;