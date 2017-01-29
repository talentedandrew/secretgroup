var express = require('express'),
    server = express(),
    path = require('path'),
    logger = require('morgan') 
    cookieParser = require('cookie-parser'), 
    session = require('express-session'),
    bodyParser = require('body-parser'),
    config = require("./config/config.js"),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    passport = require('passport'),  
    LocalStrategy = require('passport-local').Strategy;  

server.listen(process.env.PORT || 3000, function () {
    console.log('server is listening in port 3000!');
})
console.log(config.dbURL);
mongoose.connect(config.dbURL);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection to database is established!');
});
server.use(logger('dev'));  
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({ 
    secret: config.secretKey,
    resave: false,
      saveUninitialized: true,
  cookie: { secure: true }
 }));
server.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
server.use('/', express.static(path.join(__dirname, 'public'))) ; 
var api = require('./app/routes/api.js');
require('./app/config/passport.js');

server.use(passport.initialize());  
server.use(passport.session());   
// Catch unauthorised errors
server.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
server.use('/api', api);