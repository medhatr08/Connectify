const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User=mongoose.model("User")
const Post = mongoose.model("Post")
const requireLogin = require("../middleware/requireLogin");

//get user profile
router.get("/user/:id",async(req,res)=>{
    try{
    const response=await User.findOne({_id:req.params.id}).select("-password")
    if(response){
       const post=await Post.find({postedBy:req.params.id}).populate("postedBy","_id").exec();
       if(!post)
       return res.status(422).json({error:"Not Found"})
       res.status(200).json({response,post})

    }
    }catch(err){
        if(err)
        res.status(404).json({error:err})
    }
})

//follow user
router.put("/follow",requireLogin,(req,res)=>{
    
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true })
    .then(result => {
        // Update following
        return User.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true });
    })
    .then(result => res.json(result))
    .catch(err => res.status(422).json({ error: err }));
    
 })

//to unfollow user
router.put("/unfollow",requireLogin,async(req,res)=>{
    User.findByIdAndUpdate(req.body.followId, { $pull: { followers: req.user._id } }, { new: true })
    .then(result => {
        // Update following
        return User.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.followId } }, { new: true });
    })
    .then(result => res.json(result))
    .catch(err => res.status(422).json({ error: err }));
})

module.exports=router;