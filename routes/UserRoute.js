const express = require('express');
const router = express.Router();
const protected = require('../middlewares/auth');
const userController = require('../controllers/UserController');


router.get('/all',protected, userController.getAllUsers);

router.post('/create',protected, userController.createUser);

router.post('/update',protected, userController.updateUser);

module.exports = router;