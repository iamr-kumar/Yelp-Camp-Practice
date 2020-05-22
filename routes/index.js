app.get("/", function(req, res){
    res.render("landing");
});


// --------Auth routes-----------

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// Login form

app.get("/login", function(req, res){
    res.render("login");
})

// Login logic

app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){   
});

// -----------Logout route-----------

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
})

// --------Auth routes-----------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}