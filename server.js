const express = require('express')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient;
const app = express();
const lessonsRouter = require('./routes/lessonsRouter')
const orderRouter = require('./routes/ordersRouter')

app.use(express.json())
app.set('port', 3000)

app.use(morgan('dev'))

app.use(express.static('public'))

app.listen('3000', () =>{
    console.log('Server is running on port 3000')
})


