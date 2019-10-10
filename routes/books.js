const express = require('express')
const router = express.Router()
const Book = require('../models/book')


//All books Home Page
router.get('/', async (req, res) => {
    
    //added this
//const express = require('express')
const mongoose = require('mongoose')

//dbName ='Bookstore'
const db = mongoose.connection

const col = db.collection('books')

col.find({}, function(err, books) {
    counter = 0;
    bookMap = [];
    books.forEach(function(book) {
        bookMap[counter] = book;
        console.log(bookMap[counter].title);
        counter = counter + 1;
    });

    res.render('books/index', {bookMap: bookMap, var: counter});
});
//console.log(col)

//res.render('books/index')
//to here
    
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