let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE MODEL CONFIG
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

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



// =======================================================================

app.listen(3000, function(){
    console.log("Blog App server is now running on port 3000!");
});