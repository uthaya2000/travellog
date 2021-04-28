const express = require("express"),
	router = express.Router(),
	Place = require("../models/places"),
	middleware = require("../middleware");
const multer = require('multer');
const {cloudinary, storage} = require('../cloudinary')
var upload = multer({ storage })

//new form
router.get("/travellog/new", middleware.isLoggedIn ,function(req, res){
	res.render("newplace")
})

// index Routes
router.get("/travellog/:type",middleware.isLoggedIn, function(req, res){
	var type = req.params.type
	if(type === "visited"){
		Place.find({visited: true, username: req.user.username}, function(err, places){
			if(err){
				console.log(err)
			}
			else{
				res.render("travel.ejs",{places: places, type: type})
			}
		})
	}else{
		Place.find({bucket: true, username: req.user.username}, function(err, places){
			if(err){
				console.log(err)
			}
			else{
				res.render("travel.ejs",{places: places, type: type})
			}
		})
	}
	
})

//Create POST
router.post("/travellog",middleware.isLoggedIn, upload.single('image'),function(req,res){
		var newp = {
			name:req.body.name,
			image:req.file.path,
			fileName: req.file.filename,
			date: req.body.date,
			description:req.body.desc,
			visited: req.body.visited,
			bucket: req.body.bucket,
			id:req.user._id,
			username:req.user.username
		}
		Place.create(newp, function(err,place){
			if(err){
				console.log(err);
			}else{
				if(req.body.visited){
					req.flash("success", place.name+" added successfully");
					res.redirect("/travellog/visited")
				}
				if(req.body.bucket){
					req.flash("success", place.name+" added successfully");
					res.redirect("/travellog/bucket")
				}
				
			}
		});
});

router.get("/travellog/:id/edit", middleware.isLoggedIn,  function(req,res){
	Place.findById(req.params.id, function(err, place){
		res.render("edit",{place: place})
	})
})

router.put("/travellog/:id", middleware.checkOwner, upload.single('image'), function(req, res){
	var data = req.body.place;
	data.image = req.file.path;
	data.fileName= req.file.filename;
	console.log(data)
	Place.findById(req.params.id, (err, place)=>{
		cloudinary.uploader.destroy(place.fileName);
	})
	Place.findByIdAndUpdate(req.params.id,data,function(err,place){
		if(err){
			res.redirect("back");
		}
		else{
			if(place.visited){
				res.redirect("/travellog/visited")
			}else{
				res.redirect("/travellog/bucket")
			}
		}
	})
})
router.delete("/travellog/:id",middleware.checkOwner, function(req, res){
	Place.findById(req.params.id, function(err, place){
		if(err){
			console.log(err)
			res.redirect("/travellog/visited")
		}else{
			cloudinary.uploader.destroy(place.fileName);
			Place.findByIdAndRemove(req.params.id, function(err,place){
				if(err){
					console.log(err);
				}
				else{
					if(place.visited){
						res.redirect("/travellog/visited")
					}else{
						res.redirect("/travellog/bucket")
					}
				}
			})
		}
	})
})
module.exports = router;

