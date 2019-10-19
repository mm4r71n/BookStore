const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');

router.get('/', (req, res) => {
  res.render('wishlist/index');
});

router.get('/:bookId', (req, res) => {
  console.log('PARAM', req.params.bookId);
  // Save the bookId and the login to the wishlist collection
  // Get all wishlist records
  // Display on the browse this wishlist with an add to cart link
  res.render('wishlist/add', { id: req.params.bookId });
});

router.post('/', async (req, res) => {
  console.log('POSTING WISHLIST', req.body);
  const wishlist = new Wishlist({
    userId: req.body.userId,
    bookId: req.body.bookId
  });
  try {
    const newWishlist = await wishlist.save();
    res.redirect('/wishlist');
  } catch (error) {
    renderNewPage(res, wishlist, true);
  }
});

module.exports = router;
