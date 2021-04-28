if(process.env.NODE_ENV !== "production")
{
	require('dotenv').config();
}

var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	methodOverride 	= require("method-override"),
	mongoose 		= require("mongoose"),
	request 		= require("request"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local").Strategy,
	flash 			= require("connect-flash"),
	app 			= express();

//model
var User = require("./models/user")
var places= require("./models/places.js")

//RoutesImports
var authRoutes = require("./routes/auth")
var travelRoutes = require("./routes/travel")

//configuration

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(flash());
var session = require("express-session")({
	secret: "Love Towards Travel",
	resave: false,
	saveUninitialized: false
});

//Passport Config

app.use(session);
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(function(req,res,next){
	res.locals.curuser=req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
// 
app.use(methodOverride("_method"));

//Use Routes
app.use(travelRoutes)
app.use(authRoutes)





app.listen(process.env.PORT || 3000, function(){
	console.log("Travel Log Server Started");
})