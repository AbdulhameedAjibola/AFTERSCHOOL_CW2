const express = require('express');
const morgan = require('morgan');
const connectDB = require('./middleware/dbMiddleware')
const lessonsRouter = require('./routes/lessonsRouter');
const ordersRouter = require('./routes/ordersRouter'); 
const PORT = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://akoredeajibola091:FirstDB@cluster0.ovcqnha.mongodb.net/afterschoolstore';
const app = express();
var path = require('path');
const corsMiddleware = require('./middleware/corsMiddleware')


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectDB)
app.use(corsMiddleware)


     // // Routes
     app.use('/lessons', lessonsRouter);
     app.use('/orders', ordersRouter);

     // Start the server only after DB connection
     app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
     });