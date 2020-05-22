app.get("/campgrounds", function(req, res){
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

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
   var newCampground = {name: name, image: image, description: description};
   Campground.create(newCampground, function(err, newCamp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
   });

});

app.get("/campgrounds/new", function(req, res){
    res.render("./campgrounds/new"); 
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});