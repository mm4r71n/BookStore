const express = require('express')
const router = express.Router()

//All books Home Page
router.get('/', (req, res) => {
    res.render('books/index')
})

//Show detail of the book
router.get('/', (req, res) => {
    res.render('books/bookDetails')
})

module.exports = router