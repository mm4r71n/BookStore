const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
