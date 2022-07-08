const mongoose= require('mongoose');
const articleSchema= require('./article');

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article"
        }
    ]
})

module.exports= mongoose.model('User', userSchema);