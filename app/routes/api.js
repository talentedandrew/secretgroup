var express = require('express');
var router = express.Router();
var config = require('../../config/config.js');
var sectretKey = config.secretKey;
var ctrlVerify = require('../controllers/verifyemail');
var ctrlAuth = require('../controllers/authentication');
var chatMessage = require('../controllers/chatMessage');

var createRoom = require('../controllers/addrooms');



// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/addroom', createRoom.addroom);
router.post('/removeroom/:userId/:roomId', createRoom.removeroom);
router.get('/searchroom', createRoom.searchroom);
router.get('/searchroombyid/:roomId', createRoom.searchroombyid);
router.get('/searchroombyuser/:userId', createRoom.searchroombyuser);
router.get('/searchroombymember/:memberId', createRoom.searchroombymember);
router.post('/addmember', createRoom.addmember);
router.get('/verify', ctrlVerify.verifyemail);
router.get('/uploadImage', ctrlAuth.testImage);
router.post('/savemessage', chatMessage.savechat);
router.get('/lastmessages/:roomId', chatMessage.showlastfewmessages);

module.exports = router;
