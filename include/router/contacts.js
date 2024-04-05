const express = require('express');
const routerContacts = express.Router();
const Contact = require('../model/contacts'); // Change variable name to Contact
const User = require('../model/signup');

// Import bcrypt for password hashing

routerContacts.post('/suggestion', async (req, res) => {
    try {
        const { name, email, suggestion } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const newContact = new Contact({ name, email, suggestion }); // Change variable name to newContact
            await newContact.save(); // Save the new contact instance
            console.log('Contact posted successfully', email);
            return res.status(201).json({ message: 'Contact posted successfully' }); // Return success message
        } else {
            return res.status(404).json({ error: "You don't have an account, sign up first" });
        }
    } catch (error) {
        console.error('Error posting contact', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

routerContacts.get('/contacts', async (req, res) => {
    try {
        const contact = await Contact.find();
        return res.status(200).json({ contact, message: "Contacts fetched successfully" }); // Correct syntax for returning contacts with a message
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching contacts from the database" }); // Correct error handling syntax
    }
});
routerContacts.delete('/contacts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteContacts = await Contact.findByIdAndDelete(id);
        if (!deleteContacts) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({deleteContacts});
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = routerContacts;
