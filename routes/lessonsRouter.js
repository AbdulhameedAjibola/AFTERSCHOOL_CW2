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


router.put('/:id', async (req, res) => {
    
        try {
          req.db.collection('lessons')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
            .then((results) => {
              res.send(results);
            });
        } catch (error) {
          console.log(error);
        }
    
});




module.exports = router;




// module.exports = router;