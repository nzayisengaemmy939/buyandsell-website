const express=require('express');
const Seller=require('../model/sell');
const buyRouter=express.Router();

buyRouter.get('/buy/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        await Seller.findById(id)
        .then((result)=>{
            res.render('buy',{Seller:result});
        })
        
    }catch(error){
console.error(error);
res.status(500).send('error occured when fecting data');
    }
})
module.exports=buyRouter;
    