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

router.get('/add-to-cart/:id', function (req, res, next) {
  productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart: {})

  Book.findById(productId, function(err, book) {
    if (err) {
      return res.redirect('/')
    }
    cart.add(book, book.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('cart/shopping-cart', {
      books: null
    })
  }
  var cart = new Cart(req.session.cart)
  res.render('cart/shopping-cart', {
    books: cart.generateArray(),
    totalPrice: cart.totalPrice
  })
})

module.exports = router
