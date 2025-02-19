const Campground = require("../models/campground");
const Comment = require("../models/comments");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "You are not authorized to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "You need to be logged in to do that!");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You are not authorized to do that!");
        res.redirect("back");
    }
}


middlewareObj.isLoggedOut = function(req, res, next){
    if(!(req.isAuthenticated())){
        return next();
    }
    req.flash("error", "You have to be logged out first to do that.");
    res.redirect("/campgrounds");
}


module.exports = middlewareObj;