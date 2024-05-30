const express = require('express');
const morgan = require('morgan');
const { MongoClient } = require('mongodb'); // Destructure MongoClient
const lessonsRouter = require('./routes/lessonsRouter');
const ordersRouter = require('./routes/ordersRouter'); // Ensure correct name here
const PORT = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://akoredeajibola091:FirstDB@cluster0.ovcqnha.mongodb.net/afterschoolstore';
const app = express();

// Set up CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

let db;

// Connect to the database
MongoClient.connect(dbUrl)
    .then(client => {
        db = client.db('afterschoolstore');
        console.log('Connected to database');

        // Middleware to add db to req
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        // // Routes
        // app.use('/api/lessons', lessonsRouter);
        // app.use('/api/orders', ordersRouter);

        // Start the server only after DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    });
