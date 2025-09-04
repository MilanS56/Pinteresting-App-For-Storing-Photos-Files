require("dotenv").config();
const multer=require("multer");
const {v2:cloudinary}= require("cloudinary");
const {CloudinaryStorage}= require("multer-storage-cloudinary");

//CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});
//MULTER-CLOUDINARY STPRAGE

const storage=new CloudinaryStorage({
  cloudinary:cloudinary,
  param:{
    folder:"pinteresting_uploads",
    allowed_formats:["jpg","jpeg", "png", "gif", "webp", "svg", "pdf"]
  }
});

const upload=multer({storage});

module.exports = upload;