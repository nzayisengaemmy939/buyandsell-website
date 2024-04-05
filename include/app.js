// app.js

const express = require('express');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter=require('./router/userRouter');
const sellRouter=require('./router/sellRouter');
const detailRouter=require('./router/detail')
const commentRouter=require('./router/comment');
const buyRouter=require('./router/buy');
const mindsRouter=require('./router/minds');
const contactsRouter=require('./router/contacts');
const session = require('express-session');
const Comment=require('./model/comment');
// Importing User model correctly
const app = express();
/* db about USER*/
const mydb = "mongodb+srv://keend:222008443@cluster0.szawsdl.mongodb.net/buyandsell?retryWrites=true&w=majority";
mongoose.connect(mydb).then(() => {
    app.listen(5000, () => {
        console.log('connected to db');
    });
});


/* db about clothes*/
app.use(session({
    secret:'your-secret-key',
    resave:false,
    saveUninitialized:false,
}));

// Middleware function to check if user is logged in
// Middleware function to check if user is logged in
// middleware.js
const requireLogin = (req, res, next) => {
    console.log('Checking if user is logged in...');
    console.log('Session:', req.session);
    if (req.session && req.session.userId) {
        console.log('User is logged in.');
        next(); // User is logged in, continue to the next middleware
    } else {
        console.log('User is not logged in. Redirecting to login page.');
        // User is not logged in, redirect to the login page
        res.redirect('/login');
    }
};

app.use('/allProduct',requireLogin);
app.use('/image',express.static('image'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname);


app.use(userRouter);
app.use(sellRouter);
// app.use(commentRouter);
app.use(detailRouter);
app.use(buyRouter);
app.use(mindsRouter);
app.use(contactsRouter);




/*.....about import from router.............*/


app.get('/', (req, res) => {
    return res.redirect('/allProduct');
  }

);
app.get('/signup', (req, res) => {
    const message=req.query.message;
    const signup=req.query.message;
    res.render('signup',{message,signup});

});

app.get('/login',(req,res)=>{
    res.render('login');
})
/* .........about sell......*/
app.get('/sell',(req,res)=>{
    return res.render('sell');

})


app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error(err);
            return res.status(500).send("internal server error");
        }
  
    })
    res.redirect('/login');
})




/* -----------------about all product entered by user......................*/
// const comments = await Comment.find().populate('user');
app.post('/comments', requireLogin, async (req, res) => {
    const userId = req.session.userId; // Assuming you're using session-based authentication

    // Extract the sellerId from the request body
    const { text, sellerId } = req.body;

    try {
        // Check if the sellerId is provided
        if (!sellerId) {
            return res.status(400).json({ message: 'SellerId is required' });
        }

        // Create a new comment
        const comment = new Comment({
            text,
            user: userId,
            sellerId, // Associate the comment with the seller
            date: new Date(),
        });

        // Save the comment to the database
        const newComment = await comment.save();

        // Respond with the newly created comment
        res.status(201).json(newComment);
    } catch (err) {
        // Handle any errors that occur during comment creation
        res.status(400).json({ message: err.message });
    }
});


app.get('/comments', async (req, res) => {
    const { sellerId } = req.query;
    try {
        let comments;
        if (sellerId) {
            // Fetch comments for a specific sellerId
            comments = await Comment.find({ seller: sellerId }).populate('user').populate('seller');
        } else {
            // Fetch all comments
            comments = await Comment.find().populate('user').populate('seller');
        }
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// API endpoint to add a reply to a comment
app.post('/comments/:commentId/replies',requireLogin, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.replies.push({
            text: req.body.text
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// API endpoint to toggle like on a comment
app.post('/comments/:commentId/like', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user has already liked the comment
        const userId = req.session.userId; // Assuming you have userId in session
        const alreadyLiked = comment.likedBy.includes(userId);
        if (alreadyLiked) {
            // If already liked, remove like
            comment.likedBy.pull(userId);
        } else {
            // If not liked, add like
            comment.likedBy.push(userId);
        }

        // Save the updated comment
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (err) {
        console.error('Failed to toggle like:', err);
        res.status(500).json({ message: 'Failed to toggle like' });
    }
});

app.post('/comment/:CommentId/dislike', requireLogin, async (req, res) => {
    const commentId = req.params.CommentId;
    const userId = req.session.userId; // Assuming you're using session-based authentication

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const dislikeIndex = comment.dislikedBy.indexOf(userId);
        if (dislikeIndex === -1) {
            comment.dislikedBy.push(userId);
        } else {
            comment.dislikedBy.splice(dislikeIndex, 1);
        }

        await comment.save(); // Save the updated comment back to the database
        res.status(200).json({ message: "Disliked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

   
app.get('/dashboardAdmin',(req,res)=>{
    res.render('dashboardAdmin');
})
app.get('/contacts',(req,res)=>{
    res.render('contacts');
})

// module.exports = commentRouter;






