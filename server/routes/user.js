const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User=mongoose.model("User")
const Post = mongoose.model("Post")
const requireLogin = require("../middleware/requireLogin");

//get user profile
router.get("/user/:id",async(req,res)=>{
   
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        console.log("User:", user);
    
        if (user) {
            const post = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id").exec();
            console.log("Post:", post);
    
            if (!post) {
                return res.status(422).json({ error: "Posts Not Found" });
            }
            
            res.status(200).json({ user, post });
        } else {
            return res.status(404).json({ error: "User Not Found" });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        
        
        let result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true });

        // Update following
        
        result = await User.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true });
        
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});
//to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
       
        console.log("heelo2")
        let result = await User.findByIdAndUpdate(req.body.followId, { $pull: { followers: req.user._id } }, { new: true });

        // Update following
        

        result = await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.followId } }, { new: true });
        console.log(result);
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

//to upload profile pic
router.put("/uploadProfilePic",requireLogin,async(req,res)=>{
    try{
    const result= await User.findByIdAndUpdate(req.user._id,{
        $set:{Photo:req.body.pic}
    },{new:true})
    
    return res.status(400).json({result})
}catch(err){
    res.status(422).json({error:err})
}
    


})


module.exports=router;