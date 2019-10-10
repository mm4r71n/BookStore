const express = require('express')
const router = express.Router()
const Book = require('../models/book')


//All books Home Page
router.get('/', async (req, res) => {
    
    //added this
const mongoose = require('mongoose')
const db = mongoose.connection.db
const col = db.collection('books')
bookMap = [];

books = col.find({});
    for (let book = await books.next(); book != null; book = await books.next()){
        //console.log(book);
        bookMap.push(book);
    }
    console.log(bookMap) 
    
    res.render('books/index.ejs')
    
    //res.send('All books')
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