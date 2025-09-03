const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Pinterest App running on Vercel 🚀");
});

// Export handler (Vercel needs this)
module.exports = app;
