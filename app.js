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


// =======================================================================

app.listen(3000, function(){
    console.log("Blog App server is now running on port 3000!");
});