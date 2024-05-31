// middlewares/dbMiddleware.js
const { MongoClient } = require('mongodb');

const dbUrl = 'mongodb+srv://akoredeajibola091:FirstDB@cluster0.ovcqnha.mongodb.net/afterschoolstore';
let db;

const connectToDb = async () => {
    if (!db) {
        const client = await MongoClient.connect(dbUrl);
        db = client.db('afterschoolstore');
        console.log('Connected to database');
    }
    return db;
};

const dbMiddleware = async (req, res, next) => {
    try {
        if (!db) {
            db = await connectToDb();
        }
        req.db = db;
        
        next();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        res.status(500).send('Database connection error');
    }
};

module.exports = dbMiddleware;
