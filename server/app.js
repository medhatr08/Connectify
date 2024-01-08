const express=require("express");
const app=express();
const cors=require("cors")
const mongoose=require("mongoose")
const PORT=5000;
const {mongoUrl}=require("./keys");

app.use(cors())
require("./models/User")
require("./models/Post")

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))



mongoose.connect(mongoUrl).then(res => {
    console.log("Database connected");
}).catch(err => {
    console.log("Database not connected")
});



app.listen(PORT,(err)=>{
    
    console.log("Server Started...")
})