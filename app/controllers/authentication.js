var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var nodemailer = require('nodemailer');
var config = require('../../config/config.js');
var knox = require('knox');
var fs = require('fs');
var client = knox.createClient({
  key: config.S3AccessKey,
  secret: config.S3Secret,
  bucket: config.S3Bucket
});

/////Creating email template
var creatEmailTemplate = function (token) {
  var template = '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<title>MY SECRET 12</title>' +
    '<style>' +
    '@import url("https://fonts.googleapis.com/css?family=Cabin:400,500,600,700");' +
    'body,html{width: 100%;height: 100%;}' +
    '.thankyouContainer{width: 100%;height: 100%;background: url("http://35.154.61.215/images/loginbg.jpg") no-repeat fixed;display: block;position: relative;}' +
    '.thankyouContainer h1{width: 100%;height: 300px;font-size: 32px;color: #ffffff;text-align: center;font-family: "Cabin", sans-serif!important;position: relative;margin: 0;position: absolute;top: 30%;}' +
    '.thankyouContainer a{width: 100%;height: 80px;font-size: 27px;color: #ffffff;text-align: center;font-family: "Cabin", sans-serif!important;margin: 0 auto;display: block;position: absolute;top: 50%;text-decoration: none;cursor: pointer;}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="thankyouContainer">' +
    '<h1>Thank you for registering with us.Please verify your email Id by clicking on this link <a href="http://35.154.61.215/api/verify?token=' + token + '">Verify</a></h1>' +
    '</div>   ' +
    '</body>' +

    '</html>';

  return template;

}



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
    html: creatEmailTemplate(token) // html body
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
      res.json({ success: false, message: "Sorry , you cannot register at this moment. Please try again after some time" })
      return;
    }
    var token = user.generateJwt();
    transporter.sendMail(mailOptions(user.email, token), function (error, info) {
      if (error) {
        res.json({ success: false, message: "Sorry , you cannot register at this moment. Please try again after some time" })
      }
      else {
        console.log(info);
        res.json({ success: true, message: "To complete the process , please confirm your email" })
      }
    });


  });

};

module.exports.login = function (req, res) {
  passport.authenticate('local', function (err, user, info) {


    // If Passport throws/catches an error
    if (err) {
      res.status(404).json({ success: false, message: "Something went wrong . Please try again after sometime!", token: null, user: null });
      return;
    }

    // If a user is found
    if (user) {
      if (user.isActive) {
        var token;
        token = user.generateJwt();
        user = user.toObject();
        delete user.password;
        res.json({ success: true, token: token, user: user, message: "successfully logged in!" });
      }
      else if (!user.isActive) {
        res.json({ success: false, message: "Please verify your email", token: null, user: null });
      }
      else {
        res.json({ success: false, message: "No such user found in our database entry", token: null, user: null });
      }
    }
    else {
      res.json({ success: false, message: "Please verify your email", token: null, user: null });
    }

  })(req, res);

};

module.exports.testImage = function (req, res) {
  var file = "../mySectretGroup/app/images/F1.jpg";
  var stream = fs.createReadStream(file)
  var upload_name = "upload_" + file
  fs.stat(file, function (error, stat) {
    if (error) { res.json({ success: false, message: "Upload unsuccessfull" }); }
    var sendFile = client.putStream(stat, upload_name, { "Content-Type": "image/jpeg", 'Content-Length': stat.size }, function (err, result) {
      if (err != null) {
        console.log(err)
        res.json({ success: false, message: "Upload unsuccessfull" });
      } else {
        console.log(result.statusCode)
        console.log(result)
        res.json({ success: true, message: "Upload successfull" });
      }
    });
    // sendFile.on('response', function (result) {
    //   if (result.statusCode == HTTPStatus.OK) {
    //     res.json('url: ' + result.url)
    //   } else {
    //     res.json({ success: false, message: "Upload unsuccessfull" });
    //   }
    // });
  });


}