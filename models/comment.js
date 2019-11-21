const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    authorUsername: {
        type: String,
        require: true
    },
    showUsername: {
        type: Boolean,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
},
{timestamps: true}
)

module.exports = mongoose.model('Comment', commentSchema)