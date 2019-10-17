const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

//All books Home Page
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    const authors = await Author.find({});
    res.render('books/index', {
      books: books,
      authors: authors,
      searchOptions: req.query
    });
  } catch {
    res.redirect("/");
  }
});
//new book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

//create book route
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publisher: req.body.publisher,
    publishDate: new Date(req.body.publishDate),
    description: req.body.description,
    price: req.body.price
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect("books");
  } catch {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    };
    if (hasError) params.errorMessage = "Error creating Book";
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

//Show detail of the book
router.get('/:bookID', async (req, res) => {
  const book = await Book.find({"_id": req.params.bookID})
  //console.log('Book details...')
  //console.log(book)
  res.render('books/bookDetails', {book: book[0]})
})

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
