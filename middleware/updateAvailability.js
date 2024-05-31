const updateLessons = (req, res, next) =>{
    try {
        req.db('lessons').updateMany({}, {$set: {availability: 10}})
    } catch (error) {
        res.status(400).send('Error parsing request')
    }
    next();
}

module.exports = updateLessons;