const express = require('express')
const ObjectId = require('mongodb').ObjectId;
const router = express.Router()


router.get('/', async (req, res) => {
    try {
        
        //await req.db.collection('lessons').updateMany({}, { $set: { availability: 10 } });
        const lessons = await req.db.collection('lessons').find().toArray();
        res.json(lessons);
    } catch (error) {
        res.status(500).send("Error retrieving lessons");
    }
});


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


router.put('/:id', async (req, res) => {
    try {
        const lessonId = new ObjectId(req.params.id);
        

        const result = await req.db.collection('lessons')
            .updateOne({ _id: lessonId }, { $set:  req.body  });

        if (result.modifiedCount === 1) {
            res.status(200).send({ success: true, message: 'Lesson updated successfully.' });
        } else {
            res.status(404).send({ success: false, message: 'Lesson not found.' });
        }
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).send({ success: false, message: 'An error occurred while updating the lesson.' });
    }
});





module.exports = router;




// module.exports = router;