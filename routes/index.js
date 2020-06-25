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

    // console.log(username);
    
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

        User.findOne({username: username})
            .then(user => {
                if(user){
                    // if(users[0].email === email){
                    //     errors.push({message: 'Email already taken!'});
                    // }
                    // else if(users[0].username === username){
                    //     errors.push({message: 'Username already taken!'});
                    // }
                    errors.push({message: 'Username already taken!'});
                    res.render("register", {
                        errors,
                        firstName,
                        lastName,
                        email,
                        username
                    });                
                }
                else{
                    const newUser = new User({
                        username: username,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: password
                    });
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
        failureRedirect: "/login"
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