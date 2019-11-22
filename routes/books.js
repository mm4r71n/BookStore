const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Book = require('../models/book');
const Author = require('../models/author');
const Comment = require('../models/comment');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

//All books Home Page
router.get('/', async (req, res) => {
  try {
    books = await Book.find({}).limit(10);
    const authors = await Author.find({});
    
    res.render('books/index', {
      books: books,
      authors: authors,
      searchOptions: req.query
    });
  } catch (error) {
    res.redirect('/');
  }
});

//Using this to filter the books
router.get('/show-books/:filter?', async (req, res) => {
  try {
    books = await Book.find({}).limit(10);
    const authors = await Author.find({});
    
      if(typeof req.params.filter !== 'undefined'){
        books = books.filter(function(book){
          //if filter is for genre do this
          if(req.params.filter !== '0star' &&
          req.params.filter !== '1star' &&
          req.params.filter !== '2star' &&
          req.params.filter !== '3star' &&
          req.params.filter !== '4star' &&
          req.params.filter !== '5star'){
            return book.genre == String(req.params.filter);
          }
          //if filter is a rating, do this  
          else if(req.params.filter === '0star'){
            return (book.rating === 0);
          } 
          else if(req.params.filter === '1star'){
            return (book.rating === 1 ||
                    book.rating === 2 || book.rating === 3 ||
                    book.rating === 4 || book.rating === 5);
          }
          else if(req.params.filter === '2star'){
            return (book.rating === 2 ||
                    book.rating === 3 || book.rating === 4 ||
                    book.rating === 5);
          }
          else if(req.params.filter === '3star'){
            return (book.rating === 3 ||
                    book.rating === 4 || book.rating === 5);
          }
          else if(req.params.filter === '4star'){
            return (book.rating === 4 ||
                    book.rating === 5);
          }
          else if(req.params.filter === '5star'){
            return book.rating === 5;
          }
          else{
            return book;
          }
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

//pagination
router.get('/show-books/:filter?/:page?', async (req, res) => {
  try {
    if(parseInt(req.params.page) === 1){
      books = await Book.find({}).limit(10);
    }
    else{
      books = await Book.find({}).skip(10).limit(10);
    }
    const authors = await Author.find({});
    
      if(typeof req.params.filter !== 'undefined'){
        books = books.filter(function(book){
          //if filter is for genre do this
          if(req.params.filter !== '0star' &&
          req.params.filter !== '1star' &&
          req.params.filter !== '2star' &&
          req.params.filter !== '3star' &&
          req.params.filter !== '4star' &&
          req.params.filter !== '5star'){
            return book.genre == String(req.params.filter);
          }
          //if filter is a rating, do this 
          else if(req.params.filter === '0star'){
            return (book.rating === 0);
          } 
          else if(req.params.filter === '1star'){
            return (book.rating === 1 ||
                    book.rating === 2 || book.rating === 3 ||
                    book.rating === 4 || book.rating === 5);
          }
          else if(req.params.filter === '2star'){
            return (book.rating === 2 ||
                    book.rating === 3 || book.rating === 4 ||
                    book.rating === 5);
          }
          else if(req.params.filter === '3star'){
            return (book.rating === 3 ||
                    book.rating === 4 || book.rating === 5);
          }
          else if(req.params.filter === '4star'){
            return (book.rating === 4 ||
                    book.rating === 5);
          }
          else if(req.params.filter === '5star'){
            return book.rating === 5;
          }
          else{
            return book;
          }
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
    genre: req.body.genre,
    rating: req.body.rating
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

// post new comment
router.post('/comment/:bookID/:userID', async (req, res) => {
  console.log('switch value...')
  console.log(req.body.showusername)
  try {
    const user = await User.findOne({_id: req.params.userID})
    let newComment = new Comment(
      {
        authorID: user.id,
        authorUsername: 'placeholder_username',
        showUsername: req.body.showusername !== undefined,
        content: req.body.comment,
        bookID: req.params.bookID
      }
    )
    await newComment.save()
  } catch (error) {
    console.log(error)
  } finally {
    res.redirect(`/books/${req.params.bookID}`)
  }
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
  const comments = await Comment.find({ 'bookID': book[0].id });
  const user = await User.findOne({_id: req.user._id})
  res.render('books/bookDetails', { book: book[0], comments, userID: user.id });
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
