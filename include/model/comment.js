const mongoose = require('mongoose');
const User=require('./signup');

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: true
    },
     // Reference to the User model
seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller', // Reference to the Seller model
},
    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    likedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    dislikedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    replies: [replySchema] // Array of replies
});

module.exports = mongoose.model('Comment', commentSchema);