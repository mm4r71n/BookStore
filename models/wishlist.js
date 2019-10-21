const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
