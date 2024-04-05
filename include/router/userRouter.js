const express = require('express');
const router = express.Router();
const User = require('../model/signup');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

router.post('/signup', async (req, res) => {
    try {
        const { firstName, secondName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        if (password.length < 4) {
            return res.status(400).json({ error: 'Your password should be at least 4 characters' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({ firstName, secondName, email, password: hashedPassword }); // Create new user instance
        await newUser.save(); // Save the new user instance
        res.redirect('/login');
    } catch (error) {
        console.error('Error signing up', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', { email, password });

        const user = await User.findOne({ email }); // Find user by email
        if (!user) { // If user not found
            console.log('User not found');
            return res.status(401).send('Invalid email or password');
        }
        
        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) { // If password doesn't match
            console.log('Incorrect password');
            return res.status(401).send('Invalid email or password');
        }

        req.session.userId = user._id; // Set user session
        console.log('User logged in:', user._id);
        res.redirect('/dashboard'); // Redirect to the dashboard or main page after successful login
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
});
router.get('/users',async(req,res)=>{
try{
    const users=await User.find();
    return res.json(users)
}
catch(err){
    console.error(err);
    return res.json({eror:"it becomes issue to fect all users in data base"})
}
})
router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});




module.exports=router;
