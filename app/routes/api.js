var express = require('express'),
    router = express.Router();
    config = require('../../config/config.js'),
    sectretKey = config.sectretKey,
    jwt = require('express-jwt'),
    auth = jwt({
        secret: 'DL2CV975',
        userProperty: 'payload'
    }),
    ctrlProfile = require('../controllers/profile');
    ctrlAuth = require('../controllers/authentication');
    createRoom = require('../controllers/addrooms');


router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/addroom', createRoom.addroom);
router.get('/searchroom', createRoom.searchroom);
router.post('/addmember', createRoom.addmember);

module.exports = router;
