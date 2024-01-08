const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const {Jwt_Secret}=require("../keys");


router.get("/", (req, res) => {

})



router.post("/signup", (req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with this email or username" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new User({
                name,
                userName,
                email,
                password: hashedPassword
            })
            user.save().then(user => {
                res.json({ message: "Registered successfully" })
            }).catch(err => {
                console.log(err)
            })
        })

    })

})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(442).json({ error: "Please add email or password" })
    }

    User.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(442).json({ error: "Please login with current credentials" })

        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {

                // return res.status(200).json({ message: "Signed in Successfully" })
                const token=jwt.sign({_id:savedUser._id},Jwt_Secret)
                const {_id,name,email,userName}=savedUser
                res.json({token,user:{_id,name,email,userName}})
            }
            else {
                return res.status(442).json({ error: "Please login with current credentials" })

            }
        })
        }).catch(err => {
            console.log(err)
    })
})
module.exports = router;