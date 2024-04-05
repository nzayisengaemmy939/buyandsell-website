const express = require('express');
const Seller = require('../model/sell');
const detailRouter = express.Router(); // You missed the function invocation here

detailRouter.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sellerId = req.params.id;
    const userId=req.session.userId;
    Seller.findById(id).populate('comments').then((result) => {
        res.render('detail', { Seller: result,userId:userId});
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Error occurred while fetching data');
    });
});

module.exports = detailRouter;
