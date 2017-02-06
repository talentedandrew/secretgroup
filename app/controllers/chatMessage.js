var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var Room = require('../models/users.js').room;
var Chat = require('../models/users.js').chat;
var jwt = require('jsonwebtoken');
var config = require('../../config/config.js');
var sectretKey = config.secretKey;
var path = require('path');

module.exports.showlastfewmessages = function (req,res) {
    var auth = req.headers['authorization'];
    if (auth) {
        var roomId = req.params.roomId;
        var token = auth.split(' ')[1];
        jwt.verify(token, sectretKey, function (err, decoded) {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
                }
                else if (err.name === 'TokenExpiredError') {
                    res.sendFile(path.join(__dirname, '../../public', 'tokenexpired.html'));
                }
                console.log(decoded);
            }
            else {
                Chat.find({'roomId':roomId}).populate('createdBy', '_id firstname lastname').sort({'createdAt':1}).limit(10).exec(function (err, chats) {
                    if (err) {
                        res.json({ success: false, chat: null })
                        return;
                    }
                    res.json({ success: true, chat: chats })
                });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }
};
module.exports.savechat = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
         var roomId = req.body.roomId;
        var token = auth.split(' ')[1];
        jwt.verify(token, sectretKey, function (err, decoded) {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
                }
                else if (err.name === 'TokenExpiredError') {
                    res.sendFile(path.join(__dirname, '../../public', 'tokenexpired.html'));
                }
                console.log(decoded);
            }
            else {
                var chat = new Chat({
                    roomId : req.body.roomId,
                    message: req.body.message,
                    createdBy: req.body.createdBy
                });
                chat.save(function (error) {
                    if (!error) {
                        Chat.findOne({ 'createdBy': req.body.createdBy ,'roomId': roomId})
                            .populate('createdBy', '_id firstname lastname')
                            .sort({'createdAt':1})
                            .exec(function (error, newchat) {
                                if (error) {
                                    res.json({ success: false, message: error, chat: null });
                                   
                                }
                                else{
                                   res.json({ success: false, message: error, chat: newchat });
                                    
                                }
                            })
                    }
                });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }

};