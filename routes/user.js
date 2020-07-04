const campgrounds = require('../models/campgrounds');

var express = require('express'),
    router = express.Router({mergeParams: true}),
    passport = require('passport'),
    User = require('../models/user'),
    Campgrounds = require('../models/campgrounds');


router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        }
        else{
            if(!foundUser){
                req.flash("error", "User not found!");
                req.redirect("/campgorunds");
            }
            else{
                Campgrounds.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
                    if(err){
                        req.flash("error", "Something went wrong!");
                        req.redirect("/campgorunds");
                    }
                    else{
                        res.render("user/profile", {user: foundUser, campgrounds: campgrounds});
                    }
                });
            }
        }
    })
});

module.exports = router;