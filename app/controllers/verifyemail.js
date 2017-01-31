var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var jwt = require('jsonwebtoken');
var config = require('../../config/config.js');
var sectretKey = config.secretKey;
var path = require('path');

module.exports.verifyemail = function (req, res) {
  var token = req.query.token;
  jwt.verify(token, sectretKey, function (err, decoded) {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
      }
      else if (err.name === 'TokenExpiredError') {
        res.sendFile(path.join(__dirname, '../../public', 'tokenexpired.html'));
      }
      
    }
    else {
      console.log(decoded);
      if (decoded.email) {
        User.findOneAndUpdate({ 'email': decoded.email }, { $set: { isActive: true } }, { new: true }, function (err, user) {
          console.log(user);
          res.sendFile(path.join(__dirname, '../../public', 'emailverification.html'));
        });
      }
      else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
      }
    }

  });
};
