var mongoose = require('mongoose');
var User = require('../models/users.js').user;
var Room = require('../models/users.js').room;
var jwt = require('jsonwebtoken');
var config = require('../../config/config.js');
var sectretKey = config.secretKey;
var path = require('path');
//API for searching all the rooms
module.exports.searchroom = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
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
                Room.find({}, function (err, rooms) {
                    if (err) {
                        res.json({ success: false, rooms: null })
                        return;
                    }
                    res.json({ success: true, rooms: rooms })
                });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }
};

//API for searching rooms by ID
module.exports.searchroombyid = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
        var token = auth.split(' ')[1];
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
                var id = req.params.roomId;
                Room.find({ '_id': id })
                    .populate('createdBy', '_id firstname lastname email')
                    .populate('members', '_id firstname lastname email')
                    .exec(function (error, room) {
                        if (error) {
                            res.json({ success: false, room: null })
                            return;
                        }
                        res.json({ success: true, room: room })
                    });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }


};
module.exports.searchroombyuser = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
        var token = auth.split(' ')[1];
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
                var id = req.params.userId;
                Room.find({ 'createdBy': id })
                    .populate('createdBy', '_id firstname lastname email')
                    .populate('members', '_id firstname lastname email')
                    .exec(function (error, newroom) {
                        if (error) {
                            res.json({ success: false, rooms: null })
                            return;
                        }
                        res.json({ success: true, rooms: newroom })
                    });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }


};

module.exports.searchroombymember = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
        var token = auth.split(' ')[1];
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
                var id = req.params.memberId;
                Room.find({ 'members': id, 'createdBy': { $ne: id } })
                    .populate('createdBy', '_id firstname lastname email')
                    .populate('members', '_id firstname lastname email')
                    .exec(function (error, room) {
                        if (error) {
                            res.json({ success: false, rooms: null })
                            return;
                        }
                        res.json({ success: true, rooms: room })
                    });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }


};

//API for adding rooms
module.exports.addroom = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
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
                var room = new Room({
                    roomname: req.body.roomName,
                    createdBy: req.body.createdBy,
                    members: req.body.createdBy,
                });
                room.save(function (error) {
                    if (!error) {
                        Room.findOne({ 'createdBy': req.body.createdBy })
                            .populate('createdBy', '_id firstname lastname email')
                            .populate('members', '_id firstname lastname email')
                            .exec(function (error, newroom) {
                                if (error) {
                                    res.json({ success: false, message: error, room: null });
                                    return;
                                }
                                var roomId = newroom._id;
                                User.update(
                                    { _id: req.body.createdBy, 'rooms': { $ne: roomId } },
                                    { $addToSet: { "rooms": roomId } },
                                    function (error, result) {
                                        if (error) {
                                            res.json({ success: false, message: error, room: null });
                                            return;
                                        }
                                        else {
                                            res.json({ success: true, message: "room has been created successfully", room: newroom });
                                        }

                                    }
                                );


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

//API for removing room
module.exports.removeroom = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
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
                var userId = req.params.userId;
                var roomId = req.params.roomId;
                Room.findById( {_id : roomId}, function (error, newroom) {
                    if (error) {
                        res.json({ success: false, message: "something went wrong, please try again"});

                    }
                    else {
                        newroom.remove();
                        res.json({ success: true, message: "room has been removed successfully"});
                        
                    }


                });
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }

};



//API for adding members to a room
module.exports.addmember = function (req, res) {
    var auth = req.headers['authorization'];
    if (auth) {
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
                var roomId = req.body.roomId;
                var memberId = req.body.member;
                Room.update(
                    { _id: roomId, 'members': { $ne: memberId } },
                    { $addToSet: { "members": memberId } },
                    function (error, result) {
                        if (error) {
                            res.json({ success: false, message: "something went wrong" })
                            return;
                        }
                        else if (result.nModified === 0) {
                            res.json({ success: false, message: "member already added in the group" })
                        }
                        else {
                            User.update(
                                { _id: req.body.member, 'rooms': { $ne: req.body.roomId } },
                                { $addToSet: { "rooms": req.body.roomId } },
                                function (error, result) {
                                    if (error) {
                                        res.json({ success: false, message: "member was not added successfully" })
                                        return;
                                    }
                                    else {
                                        res.json({ success: true, message: "member added successfully" })
                                    }

                                }
                            );

                        }

                    }
                );
            }
        });


    }
    else {
        res.sendFile(path.join(__dirname, '../../public', 'tokenerror.html'));
    }


}
