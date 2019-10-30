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

wishlistSchema.virtual('_wishlist', {
  ref: 'Book',
  localField: 'bookId',
  foreignField: '_id'
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
