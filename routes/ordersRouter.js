const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const result = await req.db.collection('orders').insertOne(req.body);
        console.log('Insert Result:', result); // Log the result object
        // Retrieve the inserted document by its ID
            const insertedOrder = await req.db.collection('orders').findOne({ _id: result.insertedId });
            res.send({ msg: 'Order placed successfully', order: insertedOrder });
        
    } catch (err) {
        res.send({ msg: 'Error placing order' });
        next(err);
    }
});


router.get('/', async (req, res) =>{
    try {
        const orders = await req.db.collection('orders').find().toArray()
        res.json(orders)
    } catch (error) {
        res.status(500).send("Error retrieving lessons")
    }
})




module.exports = router;