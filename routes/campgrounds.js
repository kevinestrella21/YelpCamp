const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const methodOverride = require("method-override");
const middleware = require("../middleware");


//INDEX PAGE -- display all campgrounds
router.get("/", function(req, res){
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
        });
    });


    //DISPLAY A FORM TO CREATE A NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
 
    
//CREATE NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
    let name = req.body.campName,
        image = req.body.image,
        desc = req.body.description,
        author = {
        id: req.user._id,
        username: req.user.username
    };

    let newCampground = {name: name, image:image, description: desc, author: author};
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "New Campground created!");
            res.redirect("/campgrounds");
        }
    });

});


//DISPLAY ONLY ONE OF THE CAMPGROUNDS
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT PAGE FOR CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground) {
            res.render("campgrounds/edit", {campgrounds: foundCampground});  
    });
});

//UPDATING THE CAMPGROUND FROM THE EDIT PAGE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            console.log(err);
            req.flash("error", "There was an error editing your campground.");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground edited successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DELETING A CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "There was an error deleting your campground!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully!");
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;