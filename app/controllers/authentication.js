var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js').user;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
     var user = new User({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            username: req.body.userName,
            email: req.body.email,
            age: req.body.age,
            password: req.body.password,
            contact: req.body.contact
        });
        user.save(function(err){
            if(err){
                res.send(err);
                return;
            }
             var token;
            token = user.generateJwt();
            res.json({success:true,message:"user save successfully", token : token})
        });

};

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info){
    

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      var token;
      token = user.generateJwt();  
      res.json({success:true, token : token , user:user})
    } else {
      res.json({success:false,message:"No such user found in our database entry"})
    }
  })(req, res);

};