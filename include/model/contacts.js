const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    }
});

const Contacts = mongoose.model('contacts', contactsSchema); // Changed the model name to 'User'
module.exports = Contacts ; //