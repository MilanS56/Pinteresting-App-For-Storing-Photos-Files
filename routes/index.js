var express = require('express');
var router = express.Router();
const fs=require("fs");
const path= require("path");
const passport= require("passport");
const userModel= require("./users");
const postModel= require("./posts");
const upload= require("./multer");

const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup',function(req,res,next){
  res.render("signup");
});
router.get('/profile',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  res.render("profile",{user});
})
 // Register, Login, Logout Functionality
router.post('/register',function(req,res){
  const {username,email,fullname}=req.body;
  const userData=new userModel({username,email,fullname});

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile");
    })
  })
});

router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
  failureFlash:true
}),function(req,res){  
});
router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect("/");
  });
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated())return next();
  res.redirect("/");
};

// Upload Functionality
router.post("/upload",isLoggedIn, upload.single("file"), async function(req,res, next){
  if(!req.file){
    return res.status(404).send("File Not Found!");
  }
  const user=await userModel.findOne({username:req.session.passport.user});
  const post= await postModel.create({
    image:req.file.filename,
    imageText:req.body.caption,
    user:user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
  console.log("Saved File",req.file);
});

//Download Functionality
router.get("/download/:id", isLoggedIn, async function(req,res){
  try{
    const post=await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("No File Available!");

    const filePath=filePath.join(_dirname, "../public/images/uploads",post.image);
    res.download(filePath, post.image); //This will download the file
  } 
  catch(err){
    console.error(err);
    res.status(500).send("Kuchh to Internal Gadbad hai Daya");
  }
});

// Delete Functionality

router.post("/delete/:id", isLoggedIn, async function(req, res){
  try{
    const post=await postModel.findById(req.params.id);

    if(!post) {return res.status(404).send("No File Available!")};
    //This line below delete the post from our public/images/uploads folder.
    const filePath=path.join(__dirname,"../public/images/uploads", post.image);
    console.log("Deleting File At:", filePath);
    fs.unlink(filePath, (err)=>{
      if (err) { console.error("Error deleting this file: ",err);}
    });
    //This line deletes the post from our Database
    await postModel.findByIdAndDelete(req.params.id);

    //To remove the file also from user.posts
    await userModel.updateOne(
      {_id:post.user},
      {$pull:{posts:req.params.id}}
    );

    res.redirect("/profile");
  }
  catch(err){
    console.error(err);
    res.status(500).send("Kuchh to Internal Gadbad hai Daya");
  }
});


module.exports = router;
