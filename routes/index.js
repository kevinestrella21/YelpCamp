const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Campground = require("../models/campground");
const middleware = require("../middleware");


router.get("/", function(req, res){
    res.render("landing");
});

//===================================================================
//AUTH ROUTES
//===================================================================


//REGISTER
router.get("/register", middleware.isLoggedOut, function(req, res){
    res.render("register");
});

router.post("/register", middleware.isLoggedOut, function(req, res){
    let newUser = new User({username: req.body.username});
    if(req.body.password!==req.body.confirm_password){
        req.flash("error", "Password did not match!");
        return res.redirect("register");
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", `Welcome to YelpCamp with lots of pugs ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});


//LOGIN
router.get("/login", middleware.isLoggedOut, function(req, res){
    res.render("login");
});

router.post("/login", middleware.isLoggedOut, passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

//LOGOUT
router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


//PROFILE
router.get("/profile", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        } else{
            Campground.find({'author.id': foundUser.id}, (err, campgrounds) => {
                if(err) {
                    console.log(err);
                } else {

                    res.render("something/profile", {user: foundUser, campgrounds: campgrounds});
                }
                });   
        }
    });
})

// //change password
// router.get("/password", middleware.isLoggedIn, function(req, res){
//     res.render("something/password");
// });

// router.put("/password", middleware.isLoggedIn, function(req, res){
    
// });




module.exports = router;