const jwt=require("jsonwebtoken")
const {Jwt_Secret}=require("../keys")
const mongoose=require("mongoose")
const User=mongoose.model("User")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    
    if(!authorization){
        return res.status(401).json({error:"You must have logged in 1"})
    }

    const token=authorization.replace("Bearer ","")
    
    jwt.verify(token,Jwt_Secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must have logged in 2"})
        }

        const {_id}=payload
        
        User.findById(_id).then(userData=>{
            
            req.user=userData
            next()
        })
    })
   
}