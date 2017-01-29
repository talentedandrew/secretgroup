var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var Room = require('../models/users.js').room;

module.exports.addroom = function (req, res) {
    var room = new Room({
        roomname: req.body.roomName,
        _creator: req.body.id,
        members: { type: req.body.id },
    });
    room.save(function (err) {
        if (err) {
            res.send(err);
            return;
        }
        res.json({ success: true, message: "room has been created successfully" })
    });

};
module.exports.searchroom = function (req, res) {
    Room.find({}, function (err, rooms) {
        if (err) {
            res.send(err);
            return;
        }
        res.json({ success: true, rooms: rooms })
    });

};
module.exports.addroom = function (req, res) {
    var room = new Room({
        roomname: req.body.roomName,
        createdBy: req.body.createdBy,
        members: req.body.member,
    });
    room.save(function (error) {
        if (!error) {
            Room.find({})
                .populate('createdBy')
                .populate('members.member')
                .exec(function (error, rooms) {
                    if (error) {
                        res.send(error);
                        return;
                    }
                    console.log(JSON.stringify(rooms, null, "\t"));
                    res.json({ success: true, message: "room has been created successfully" })
                })
        }
    });
};
module.exports.addmember = function (req, res) {
    var roomId = req.body.roomId;
    var member = req.body.member;
    Room.update(
        { _id: roomId ,'members.member': { $ne: member.member }},
        { $addToSet: { "members": member } }, 
        function (error, result) {
            if (error) {
                res.send(error);
                return;
            }
            else if (result.nModified === 0) {
                res.json({ success: false, message: "member already added in the group" })
            }
            else{
                console.log(JSON.stringify(result, null, "\t"));
                res.json({ success: true, message: "member added successfully" })
            }
            
        }
    );
}
