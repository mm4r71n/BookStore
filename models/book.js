const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    bookCover:{
        type: String,
    },
    author: {
        type: String,
        require: true
    },
    bio: {
        type: String
    },
    description: {
        type: String,
    },
    genre: {
        type: String,
        require: true
    },
    publisher: {
        type: String,
        reuqire: true
    },
    publishDate: {
        type: Date,
        require: true
    },
})

module.exports = mongoose.model('Book', bookSchema)