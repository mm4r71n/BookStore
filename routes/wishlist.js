const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Book = require('../models/book');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    const wishes = await Wishlist.find({
      userId: ObjectId('5da9fbd86c2ebb1128a8eab0')
    })
      .populate('user')
      .exec((err, books) => {});
    res.render('wishlist', { wishes: wishes });
  } catch (error) {
    console.log('error on list', error);
  }
});

router.get('/:bookId/:userId/:wishlistNum', async (req, res) => {
  // Save the bookId and the login to the wishlist collection
  const wishlist = new Wishlist({
    _id: new mongoose.Types.ObjectId(),
    userId: req.params.userId,
    bookId: req.params.bookId,
    wishlistNum: req.params.wishlistNum
  });
  try {
    const newWishlist = await wishlist.save();
    res.redirect('/wishlist/list');
  } catch (error) {
    console.log('error on list', error);
  }
});

router.get('/list', async (req, res) => {
  var user = req.user;

  if (user) {
    const list = await Wishlist.aggregate([
      { $match: { userId: user._id } },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'newWishList'
        }
      }
    ]).exec(function(err, wishes) {
      if (err) {
        console.log('ERROR', err);
      }
      var wishlist1 = [];
      var wishlist2 = [];
      var wishlist3 = [];
      const newlist = wishes.map(wish => {
        if (wish.wishlistNum === 1) {
          wishlist1.push(wish);
        }
        if (wish.wishlistNum === 2) {
          wishlist2.push(wish);
        }
        if (wish.wishlistNum === 3) {
          wishlist3.push(wish);
        }
      });

      const newList = {
        wishlist1: wishlist1,
        wishlist2: wishlist2,
        wishlist3: wishlist3,
        user: user
      };

      res.render('wishlist/list', { wishes: newList });
    });
  } else {
    res.redirect('/user/signin');
  }
});

router.post('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
  const res1 = await Wishlist.deleteOne({ _id: req.params.id.trim() }, function(
    err
  ) {
    if (err) console.log(err);
    console.log('Successful deletion');
  });

  res.redirect('/wishlist/list');
});

module.exports = router;
