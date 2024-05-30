const express = require('express');
const morgan = require('morgan');
const connectDB = require('./middleware/dbMiddleware')
const lessonsRouter = require('./routes/lessonsRouter');
const ordersRouter = require('./routes/ordersRouter'); // Ensure correct name here
const PORT = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://akoredeajibola091:FirstDB@cluster0.ovcqnha.mongodb.net/afterschoolstore';
const app = express();
var path = require('path');


// Set up CORS headers
app.use((req, res, next) => {
  
});
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(connectDB)


     // // Routes
     app.use('/lessons', lessonsRouter);
     // app.use('/api/orders', ordersRouter);

     // Start the server only after DB connection
     app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
     });