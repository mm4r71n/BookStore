const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  bookId: mongoose.Schema.Types.ObjectId,
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  _id: {
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
