//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "This is a basic blog for daily life";
const aboutContent = "Nothing much to say about this blog.";
const contactContent = "Contact debasisb for more information.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connection to a local version of Mongo DB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

// Connection to Atlas using the connection string and **your own password**

//mongoose.connect("mongodb+srv://<Your MongoDB UID>:<YOUR-MONGODB-ATLAS PASSWORD>@cluster0-jycec.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

// create a Mongoose schema called postSchema with 5 string fields
const postSchema = {
    title: {
        type: String,
        required: true 
    },
    content: {
        type: String,
        required: true 
    },
    postDate: {
        type: Date,
        required: true 
    },
    postRating: {
            type: Number,
            required: true,
            min: [1, 'Too low'],
            max: [5, 'Too high']
    },
    postPhone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
};

// create an instance of a the schema or model to post the blog entries
const Post = mongoose.model("Post", postSchema);

// Create a collection called Posts, if new, and retrieve documents in Posts
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// Route Compose allows you to display page for new blog entries
app.get("/compose", function(req, res){
  res.render("compose");
});

// Route Compose allows you to create new blog entries
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


// UPDATED: Displays home if validation passes, else displays console errors 
  post.save(function(err){
    if (!err){
        res.redirect("/")}
    else console.log(err.message);
  });
});


// Special route /posts/:postID allows retrieval of specific posts by ID
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

// Route /about displays page about the blog
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

// Route /contact displays contact info about the blog
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// display listener server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
