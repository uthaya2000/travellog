var Place = require("../models/places");
var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
		return next();
	}
	else{
		//console.log("login")
		req.flash("error", "Please Login");
		res.redirect("/")
	}
}

middleware.checkOwner = function(req,res,next){
	if(req.isAuthenticated()){
		Place.findById(req.params.id,function(err,place){
			if(err){
				res.redirect("back");
			}
			else{
				if(place.id.equals(req.user._id)){
					return next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		res.redirect("back");
	}
}

module.exports = middleware;