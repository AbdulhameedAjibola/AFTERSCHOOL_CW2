const express = require("express")
ordersRouter = express.Router()

ordersRouter.get('/', (req, res) => {
    res.send("Welcome to the orders page");
})

module.exports = ordersRouter;