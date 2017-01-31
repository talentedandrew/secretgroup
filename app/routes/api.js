var express = require('express');
var router = express.Router();
var config = require('../../config/config.js');
var sectretKey = config.secretKey;
var ctrlVerify = require('../controllers/verifyemail');
var ctrlAuth = require('../controllers/authentication');
var createRoom = require('../controllers/addrooms');



// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/addroom', createRoom.addroom);
router.get('/searchroom', createRoom.searchroom);
router.get('/searchroombyid/:roomId', createRoom.searchroombyid);
router.post('/addmember', createRoom.addmember);
router.get('/verify', ctrlVerify.verifyemail)
module.exports = router;
