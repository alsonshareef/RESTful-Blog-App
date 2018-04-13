const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
// BLOG Schema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

// USER Schema
const userSchema = new mongoose.Schema({
    email: String,
    name: String
});

const User = mongoose.model("User", userSchema);

// POST Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);

// RESTful ROUTES ========================================================

// ROOT
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){  
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log("ERROR");
        } else {
            res.render("index.ejs", {blogs: blogs});
        }
    });
});

// NEW
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

// CREATE
app.post("/blogs", function(req, res){
    // Create blog
    req.body.blog.body = req.sanitize(req.body.blog.body); // Sanitization code
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render("new.ejs");
        } else {
            // Then, redirect to index.ejs
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", {blog: foundBlog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
});

// UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); // Sanitization code
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

// EMBEDDED DATA =========================================================
// Users
let newUser = new User({
    email: "alson.shareef@gmail.com",
    name: "Alson Shareef"
});

newUser.save(function(err, user){
    if (err) {
        console.log(err);
    } else {
        console.log(user);
    }
});

// Posts

// =======================================================================

app.listen(3000, function(){
    console.log("Blog App server is now running on port 3000!");
});