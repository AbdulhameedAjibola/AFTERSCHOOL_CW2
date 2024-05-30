const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const lessonsRouter = require('./routes/lessonsRouter'); // Import your router
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 
    next();
})


let db;
// Connect to the MongoDB database
MongoClient.connect('mongodb+srv://akoredeajibola091:FirstDB@cluster0.ovcqnha.mongodb.net/',  (err, client) => {
    if (err) {
        console.error('Failed to connect to the database. Error:', err);
        process.exit(1);
    }
    db = client.db('afterschoolstore');
    console.log('Connected to the database');
});
// Pass the database connection to the router
app.use((req, res, next) => {
    if (!db) {
        console.error('Database connection is not established');
        return res.status(500).send('Database connection not established');
    }
    req.db = db;
    next();
});

app.get('/', (req, res)=> {
    res.status(200).send("Dear customer, please navigate to /lessons to see available lessons")
})
app.use('/lessons', lessonsRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
