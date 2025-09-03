const dotenv=require("dotenv");
dotenv.config();
var express = require('express');
var router = express.Router();
const mongoose=require("mongoose");
const plm=require("passport-local-mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/PinterestingApp"); This is the code for local mongodb server.
//For deploying 

mongoose.connect(process.env.MONGO_URI + "/pinteresting")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.error("MongoDB Connection Error: ", err)); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const userSchema=new mongoose.Schema(
  {
    username:{
      type:String,
      required:true,
      unique:true
    },
    fullname:{
      type:String,
      required:true
    },
    password:{
      type:String,
      minLength:6
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true
    },
    posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
    }]
},
{timestamps:true}
);
userSchema.plugin(plm);

module.exports =mongoose.model("User",userSchema)
