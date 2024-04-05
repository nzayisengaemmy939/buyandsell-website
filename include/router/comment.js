// const express = require('express');
// const commentRouter = express.Router();
// const Comment = require('../model/Comment');
// const { requireLogin } = require('../app');


// // Route to fetch all comments
// commentRouter.get('/comments', async (req, res) => {
//     try {
//         const comments = await Comment.find();
//         res.json(comments);
//     } catch (error) {
//         console.error('Failed to fetch comments:', error);
//         res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
//     }
// });

// // Route to create a new comment
// commentRouter.post('/comments',requireLogin,async (req, res) => {
//     const { text } = req.body;

//     try {
//         const newComment = new Comment({ text });
//         const savedComment = await newComment.save();
//         res.status(201).json(savedComment);
//     } catch (error) {
//         console.error('Failed to create comment:', error);
//         res.status(400).json({ message: 'Failed to create comment', error: error.message });
//     }
// });

// // Route to add a reply to a comment
// commentRouter.post('/comments/:id/replies', async (req, res) => {
//     const commentId = req.params.id;
//     const { text } = req.body;

//     try {
//         const comment = await Comment.findById(commentId);
//         if (!comment) {
//             return res.status(404).json({ message: 'Comment not found' });
//         }

//         comment.replies.push({ text });
//         const savedComment = await comment.save();
//         res.status(201).json(savedComment);
//     } catch (error) {
//         console.error('Failed to add reply:', error);
//         res.status(400).json({ message: 'Failed to add reply', error: error.message });
//     }
// });

// // Route to like or unlike a comment
// // Route to like or unlike a comment
// commentRouter.post('/comments/:id/like', async (req, res) => {
//     const commentId = req.params.id;
//     const userId = req.session.userId; // Assuming you have userId in session

//     try {
//         const comment = await Comment.findById(commentId);
//         if (!comment) {
//             return res.status(404).json({ message: 'Comment not found' });
//         }

//         // Check if user already liked the comment
//         const likedIndex = comment.likedBy.indexOf(userId);
//         if (likedIndex === -1) {
//             // User has not liked the comment, add like
//             comment.likedBy.push(userId);
//         } else {
//             // User has already liked the comment, remove like
//             comment.likedBy.splice(likedIndex, 1);
//         }

//         await comment.save();
//         res.status(200).json({ message: 'Like toggled successfully', likesCount: comment.likedBy.length });
//     } catch (error) {
//         console.error('Failed to toggle like:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// module.exports = commentRouter;
