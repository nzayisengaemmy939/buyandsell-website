// model/signup.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signupSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', signupSchema); // Changed the model name to 'User'
module.exports = User ; // Exporting as an object
