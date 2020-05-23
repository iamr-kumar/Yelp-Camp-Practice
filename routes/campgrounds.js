var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");


router.get("/campgrounds", function(req, res){
    // Get all campgrounds...
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("./campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
   var newCampground = {name: name, image: image, description: description, author: author};
   Campground.create(newCampground, function(err, newCamp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
   });

});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
    Campground.findById(req.param.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.render("./campgrounds/new", {campground: foundCampground}); 
        }
    });
});

router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campground Route

router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.render("./campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("/login");
    }
}

module.exports = router;