const express=require('express');
const minds=express.Router();
const mindsModel=require('../model/whatIsInYourMind');
minds.get('/minds',async(req,res)=>{
  try{
    const mind= await mindsModel.find().sort({createdAt:-1});
    res.json(mind);
  }
  catch(error){
    console.log(error);
    return res.status(500).json({error:"to fectch comment from database"});

  }

})
minds.post('/minds',async(req,res)=>{
   try{ 
    const {text}=req.body;
    const minds=new mindsModel({ text, date: new Date() });
    await minds.save();
    return res.status(200).json(minds);
   }
    catch (error) {
        res.status(400).json({ message: 'Failed to create comment', error: error.message });
    }
})
module.exports=minds;