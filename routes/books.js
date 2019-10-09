const express = require('express')
const router = express.Router()
const Book = require('../models/book')


//All books Home Page
router.get('/', async (req, res) => {
    res.send('All books')
})

//new book route
router.get('/new', (req, res) => {
    const book = new Book()
    res.render('books/new', {
        book: book
    })
})

//create book route
router.post('/', async (req, res) => {
    res.send('Create new book')
})

//Show detail of the book
router.get('/', (req, res) => {
    res.render('books/bookDetails')
})

module.exports = router