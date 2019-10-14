const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
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
    rating: {
        type: String
    },
    price: {
        type: Number
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)