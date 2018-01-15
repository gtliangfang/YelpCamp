var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name: "Sunset",
        image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
        description: "Sunset is beautiful!"
    },
    
    {
        name: "Friends",
        image: "https://farm3.staticflickr.com/2580/3942698066_9157ac5123.jpg",
        description: "Friends are cool!"
    },
    {
        name: "Forest Camp",
        image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg",
        description: "A quiet place!"
    }
]

// create函数放在remove的callback里面，保证执行顺序，否则seedDB里不知道哪个先执行
function seedDB(){
    // remove
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("remove all campgrounds");
        // add
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
              if (err) {
                  console.log(err);
              } else {
                  console.log("added a campground!");
                  Comment.create({
                      text: "This place is very good!",
                      author: "Homer"
                  }, function(err, comment) {
                      if (err) {
                          console.log(err);
                      } else {
                          campground.comments.push(comment);
                          campground.save();
                          console.log("save a comment to a camp");
                      }
                  });
              }
            });
        });
    });
}

module.exports = seedDB;

