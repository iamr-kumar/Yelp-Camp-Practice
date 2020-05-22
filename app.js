const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campgrounds"),
      Comment = require("./models/comments"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      seedDB = require("./seeds");

seedDB();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://127.0.0.1:27017/Yelp_Camp_v3");

// Schema Setup


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// ------Passport Config--------------
app.use(require("express-session")({
    secret: "Nothing new is happening",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

// --------------------------------------

app.set("view engine", "ejs");



app.listen(3000, function(){
    console.log("YelpCamp has started!");
});