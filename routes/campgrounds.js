var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware") // go to index defaultly

//index show all campgrounds
router.get("/", function(req, res){
    // 很奇怪，login之后req中会带着user信息
    // get all camps from db
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds:campgrounds});
});

//create add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // res.send("now in post route")
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // console.log(req.user);
    // campgrounds.push(newCampground);
    // instead create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//new show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//show shows more info about one campground
router.get("/:id", function(req, res) {
    // res.send("camp profile");
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect show page
});

// destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;