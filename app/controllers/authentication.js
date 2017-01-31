var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'officialtoanurag2@gmail.com',
    pass: 'DL2CV9757VN'
  },
    tls: {
        rejectUnauthorized: false
    }
});

// setup email data with unicode symbols
var mailOptions = function (member, token) {
  return {
    from: '"My Secret 12 👻" <officialtoanurag2@gmail.com>', // sender address
    to: member, // list of receivers
    subject: 'Email Verification', // Subject line
    text: 'Thank you for connecting with us.Please verify your email Id by clicking on the below link.', // plain text body
    html: '<html><body>Thank you for connecting with us.Please verify your email Id by clicking on this link <a href="http://35.154.61.215/api/verify?token=' + token + '">Verify</a></body></html>' // html body
  };
}


module.exports.register = function (req, res) {
  var user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    username: req.body.userName,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    contact: req.body.contact
  });
  user.save(function (err) {
    if (err) {
      res.json({ success: false, message: err})
      return;
    }
    var token = user.generateJwt();
    transporter.sendMail(mailOptions(user.email,token), function (error, info) {
      if (error) {
        res.json({ success: false, message: error})
      }
      else{
        console.log(info);
        res.json({ success: true, message: "user save successfully" })
      }
    });
    
    
  });

};

module.exports.login = function (req, res) {
  passport.authenticate('local', function (err, user, info) {


    // If Passport throws/catches an error
    if (err) {
      res.status(404).json({ success: false, message: err, token: null, user: null });
      return;
    }

    // If a user is found
    if (user.isActive) {
      var token;
      token = user.generateJwt();
      user = user.toObject();
      delete user.password;
      res.json({ success: true, token: token, user: user, message: "successfully logged in!" })
    }
    else if (!user.isActive){
      res.json({ success: false, message: "Please verify your email", token: null, user: null })
    } 
    else {
      res.json({ success: false, message: "No such user found in our database entry", token: null, user: null })
    }
  })(req, res);

};