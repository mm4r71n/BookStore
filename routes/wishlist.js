const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
  try {
    const wishes = await Wishlist.find({
      userId: ObjectId('5da9fbd86c2ebb1128a8eab0')
    })
      .populate('user')
      .exec((err, books) => {
        console.log('BOOKS INSIDE ---->', books);
      });
    // console.log('BOOKS --->', wishes);
    // Pending the query filtering by logged user
    // const wishes = await Wishlist.find({}); // Pending the query filtering by logged user
    res.render('wishlist', { wishes: wishes });
  } catch (error) {
    console.log('error on list', error);
  }
});

router.get('/:bookId/:userId', async (req, res) => {
  console.log('PARAM', req.params.bookId);
  // Save the bookId and the login to the wishlist collection
  const wishlist = new Wishlist({
    userId: req.params.userId,
    bookId: req.params.bookId
  });
  try {
    const newWishlist = await wishlist.save();
    const wishes = await Wishlist.find({});
    res.render('wishlist', { wishes: wishes });
  } catch (error) {
    // renderNewPage(res, wishlist, true);
    console.log('error on list', error);
  }
});

router.get('/list', async (req, res) => {
  const wishes = await Wishlist.find({
    userId: ObjectId('5da9fbd86c2ebb1128a8eab0')
  });
  console.log('BOOKS --->', wishes);
  res.render('wishlist/list', { wishes: wishes });
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
