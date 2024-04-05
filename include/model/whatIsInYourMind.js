const express=require('express');
const mongoose=require('mongoose');
const whatInYourMind=mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
        default:Date.now,
    }
},{timestamps:true});

const minds=mongoose.model('minds',whatInYourMind);
module.exports=minds;
