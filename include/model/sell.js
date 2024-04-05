const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    // Other fields in your schema
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],
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
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    username: String,
    nameCloth: String,
    description: String,
    file: String, // You may need to adjust this field based on how you handle file uploads (e.g., store file path)
  // Add updatedAt field
},{timestamps:true});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
