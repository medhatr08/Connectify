const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post")




//get all post

router.get("/allposts", requireLogin, (req, res) => {
    Post.find().populate("postedBy", "_id userName").populate("comments.postedBy","_id userName").then(posts => res.json(posts)).catch(err => console.log(err))
})

//Route to create apost
router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic } = req.body;

    if (!pic || !body) {
        return res.status(422).json({ error: "please add all the fields" })
    }

    const post = new Post({
        body,
        photo: pic,
        postedBy: req.user,
    })
    post.save().then((result) => {
        return res.status(200).json({ post: result })
    }).catch(err => {
        console.log(err)
    })

})
//to get my posts
router.get("/myposts", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id }).populate("postedBy", "_id userName").populate("comments.postedBy","_id userName").then(myposts => {
        res.json(myposts)
    })
})
//like route
router.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy","_id userName").exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ "error": err.message });
    }
});

//unlike route
router.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy","_id userName").exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ "error": err.message });
    }

})

router.put("/comment", requireLogin, async (req, res)=>{
    
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id
        }
        const result = await Post.findByIdAndUpdate(req.body.postId, {
            $push:{comments: comment}
        }, { 
            new: true 
        }).populate("comments.postedBy","_id userName").populate("postedBy","_id userName").exec()
        res.status(200).json( result )
    } catch (err) {
        res.status(422).json({ "error": err.message });
    }
})

//delete post

router.delete("/deletePost/:postId",requireLogin,async(req,res)=>{
    try {
        const post = await Post.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id")
            .exec();

        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.deleteOne();
            res.status(200).json({ message: "Post is deleted" });
        } else {
            res.status(401).json({ error: "You are not authorized to delete this post" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
   
})



module.exports = router;