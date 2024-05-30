const express = require('express')
const lessonsRouter = express.Router()


// get the collection name
lessonsRouter.param('collectionName', (req, res, next, collectionName) => {
    if (!req.db) {
        return next(new Error('Database connection not established'));
    }
    req.collection = req.db.collection(collectionName);
    console.log('Collection Name:', collectionName);
    next();
});

lessonsRouter
.route('/:collectionName')
    .get(  (req, res) => {
            res.send(`connect to database ${req.params.collectionName}`)
            console.log('connection successful')
        })
   

module.exports = lessonsRouter

