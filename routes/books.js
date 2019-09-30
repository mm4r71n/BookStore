const express = require('express')
const router = express.Router()
const Book = require('../models/book')


//All books Home Page
router.get('/', async (req, res) => {
    res.render('books/index')
})

//Show detail of the book
router.get('/', (req, res) => {
    res.render('books/bookDetails')
})

module.exports = router