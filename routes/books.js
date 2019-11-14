const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

//All books Home Page
router.get('/', async (req, res) => {
  try {
    books = await Book.find({});
    const authors = await Author.find({});
    
      if(typeof req.params.filter !== 'undefined'){
        console.log(String(req.params.filter));
        books = books.filter(function(book){
          return book.genre == String(req.params.filter);
        });
      }
    res.render('books/index', {
      books: books,
      authors: authors,
      searchOptions: req.query
    });
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/show-books/:filter?', async (req, res) => {
  try {
    books = await Book.find({});
    const authors = await Author.find({});
    
      if(typeof req.params.filter !== 'undefined'){
        console.log(String(req.params.filter));
        books = books.filter(function(book){
          return book.genre == String(req.params.filter);
        });
      }
    res.render('books/index', {
      books: books,
      authors: authors,
      searchOptions: req.query
    });
  } catch (error) {
    res.redirect('/');
  }
});

//new book route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

//create book route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publisher: req.body.publisher,
    publishDate: new Date(req.body.publishDate),
    description: req.body.description,
    price: req.body.price,
    genre: req.body.genre
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect('books');
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

// update rating
router.post('/rate/:bookID', async (req, res) => {
  const book = await Book.findOne({ _id: req.params.bookID })
  const newRating = parseInt(req.body.stars)
  const prevCount = book.numratings || 0
  const prevAvg = book.rating || 0
  // cumulative moving average equation to calculate new rating (average) 
  // given the previous number of ppl who rated, the previous rating,
  // and the rating that has just been made by the user
  const newAvg = (newRating + prevCount * prevAvg) / (prevCount + 1)
  book.rating = Math.round(newAvg)
  book.numratings = prevCount + 1
  await book.save()
  res.redirect(`/books/${req.params.bookID}`)

})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    };
    if (hasError) params.errorMessage = 'Error creating Book';
    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
}

//Show detail of the book
router.get('/:bookID', async (req, res) => {
  const book = await Book.find({ _id: req.params.bookID });
  res.render('books/bookDetails', { book: book[0] });
});
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.param.id)
      .populate('author')
      .exec();
    res.render('books/booksDetails', {
      book: book
    });
  } catch (e) {
    res.redirect('/');
  }
});
function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

module.exports = router;
