/** get the packages we need */ 
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var request     = require('request');
var Schema = mongoose.Schema;  
var jsonpatch   =require('json-patch');
var path = __dirname + '/views/';

var MongoClient = require('mongodb').MongoClient;

var jimp=require("jimp");
var mongoose = require('mongoose');

var jwt    = require('jsonwebtoken'); /** used to create, sign, and verify tokens */
var config = require('./config'); /** get our config file*/

var imgpath=__dirname +"/public/"; /**Where the image is stored */


var logger=require("./log");
logger.info("log to file");


  
var MONGO_URL = 'mongodb://monchy18:1234@ds135534.mlab.com:35534/tokenuser';
/** configuration ===*/
// =================================================================

var port = process.env.PORT || 8080; 
//mongoose.connect(config.database); /** connect to database */
app.set("superSecret", config.secret); /** secret variable */


/** use body parser so we can get info from POST and/or URL parameters*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

/** use morgan to log requests to the console */
app.use(morgan('dev'));

/** Giving out the token on entereing username and password */

mongoose.connect(MONGO_URL,{ useMongoClient: true });


MongoClient.connect(MONGO_URL,  {}, function(err, db) {
	if(!err)
	{
		console.log("Connected correctly to server");
		db.close();
	}
	else
	{
		console.log("error occured in connection");
	}
});

// todos  
var UsersShema = new Schema({  
	name: {  
		type: String,  
		required: true  
	},  
	password: {  
		type: String,
		required: true   
	}  
});  

var Todos = mongoose.model('todos', UsersShema);  


mongoose.connection.on("error", function(ref) {
	console.log("Could not Connected to mongo server.",ref);
});


var gtoken="";
app.post('/tokeninfo', function(req, res) {


/* 
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for 
 * plenty of time in most operating environments.
 */
 

	var tdos = new Todos({  
		name: req.body.name,  
		password: req.body.password  
	});  
	tdos.save(function(err, todos) {   
		if (!err) {  
			console.log("user saved successfully",todos);  
		} 
		else{  
			res.statusCode = 500;  
			res.json({  
				error: 'Server error'  
			});
		}  
	});  

	var options = {
		url: 'http://localhost:8080/authenticate',
		method: 'POST',
		'User-Agent': 'Super Agent/0.0.1',
		'Content-Type': 'application/x-www-form-urlencoded',
		form: {'name': req.body.name, 'password':req.body.password}
	};
	request(options, function (error, response) {
		if (!error && response.statusCode == 200) {
			Todos.findOne({
				name: req.body.name
			}, function(err, user) 
			{
				if (err) throw err;
				/** if user is found and password is right
				 create a token */
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});
				gtoken=token;
				res.render('index',{token:token});
			});	
		}
	});
});


// ---------------------------------------------------------
/** get an instance of the router for api routes */
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
/** authentication (no middleware necessary since this isnt authenticated) */
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate

apiRoutes.post('/authenticate', function(req, res) {

	/** find the user*/
	Todos.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;
		/** if user is found and password is right */
		/** create a token */
				
		var token = jwt.sign(user, app.get('superSecret'), {
			expiresIn: 86400 // expires in 24 hours
		});
		res.render('index',{token:token,'success':'done'});		
	});    
   
});


/**public endpoint*/
/** Home Page */
apiRoutes.get('/',function(req,res)
{
	res.redirect('/login');
});


apiRoutes.get('/login', function(req, res) {
	res.sendFile(path + "login.html");
});


/** request to thumbnail request with the small size image */
apiRoutes.post('/thumbnailresult',function(req,res)
{
	var imgurl=req.body.imgurl;

	var options = {
		url: 'http://localhost:8080/llk',
		method: 'get',
		headers: {
			'User-Agent': 'Super Agent/0.0.1',
			'Content-Type': 'application/x-www-form-urlencoded',
			'x-access-token':gtoken
		}
	};

	request(options,function(error,response)
	{

	}).on('data',function(){
  
		//res.render('thumbnailresult');
		jimp.read(imgurl,function(err,image)
		{
			if(err)
			{
				res.json("error occured",err);
			}
			else if(image==null)
			{
				res.json('not a valid url');
			}
			else
			{
				image.resize(50,50); 
				var file = "new_name1." + image.getExtension();
				var s = imgpath+file;
				image.write(s);
				res.render('thumbnailresult',{rImgsize:file});
			}
		});
	});
});

// ---------------------------------------------------------
/** route middleware to authenticate and check token*/
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	/** check header or url parameters or post parameters for token*/
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		/** verifies secret and checks exp */
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				/** if everything is good, save to request for use in other routes */
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		/**  if there is no token return an error */
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});		
	}
	
});

// ---------------------------------------------------------
/**authenticated routes*/
// ---------------------------------------------------------

/**Protected endpint*/
apiRoutes.get('/jsonpatch',function(req,res)
{
	res.render('jsonpatch',{token:gtoken});
});
apiRoutes.get('/jsonpatchresult',function(req,res)
{
	var a = {
		"baz": "qux",
		"rol": "bar"};
	jsonpatch.apply(a, [{op: 'add', path: '/foo', value: 'foobar'}]);
	res.render('jsonpatchresult',{patchvalue:a});
});

apiRoutes.get('/thumbnail',function(req,res)
{
	res.render('thumbnail',{token:gtoken});
});

app.use('/', apiRoutes);

// =================================================================
/**start the server ======================*/
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

module.exports=app;