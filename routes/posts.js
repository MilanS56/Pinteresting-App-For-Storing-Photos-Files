const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    image:{
        type:String,
    },
    imageText:{
        type:String,
        required:true
    },imageUrl:{
        type:String,
        required: true
    },
    imagePublicId:{
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Post", postSchema);