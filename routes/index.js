const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Cart = require('../models/cart');


router.get('/', async (req, res) => {
  let books;
  try {
    books = await Book.find({})
      .limit(10)
      .exec();
  } catch (e) {
    books = [];
    console.log(e);
  }
  res.render('index', {
    books: books
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
  var bookID = req.params.bookID
  var cart = new cart(req.session.cart ? req.session.cart: {})

  Book.findById(bookID, function(err, book) {
    if (err) {
      res.redirect('/')
    }
    cart.add(book, book.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

module.exports = router
