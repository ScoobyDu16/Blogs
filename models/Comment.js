const mongoose= require('mongoose');

const commentSchema= new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
})

module.exports= mongoose.model('Comment', commentSchema);