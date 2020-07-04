var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


router.get("/", function(req, res){
    res.render("landing");
});


// --------Auth routes-----------

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    const firstName = req.body.firstName,
          lastName = req.body.lastName,
          email = req.body.email,
          username = req.body.username,
          password = req.body.password,
          confirmPassword = req.body.confirmPassword;

    // Verify Fields 
    var errors = [];
    if(!username || !email || !firstName || !lastName || !password || !confirmPassword){
        errors.push({message: 'Please fill in all the fields!'});
    }

    // Check Password Match

    if(password !== confirmPassword){
        errors.push({message: 'Passwords do not match!'});
    }

    // Check Password length

    if(password.length < 8){
        errors.push({message: 'Password should be atleast 8 characters!'})
    }

    // Check for errors

    if(errors.length > 0){
        res.render("register", {
            errors,
            firstName,
            lastName,
            email,
            username
        });
    }

    else{

        // Check if username or email taken
        User.findOne().or([{username: username}, {email: email}])
            .then(user => {
                if(user){
                    if(user.email === email){
                        errors.push({message: 'Email already taken!'});
                    }
                    else if(user.username === username){
                        errors.push({message: 'Username already taken!'});
                    }
                    res.render("register", {
                        errors,
                        firstName,
                        lastName,
                        email,
                        username
                    });                
                }
                else{
                    // Create new user
                    const newUser = new User({
                        username: username,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: password
                    });

                    // Register user
                    User.register(newUser, req.body.password, function(err, user){
                        if(err){
                            req.flash("error", err.message);
                            return res.render("register");
                        }
                        passport.authenticate("local")(req, res, function(){
                            req.flash("success", "Successully signed in!")
                            res.redirect("/campgrounds");
                        });
                    });
                }

            })
    }

    
});

// Login form

router.get("/login", function(req, res){
    res.render("login");
})

// Login logic

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: 'Invalid username or password!'
    }), function(req, res){   
});

// -----------Logout route-----------

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
})

// --------Auth routes-----------

module.exports = router;