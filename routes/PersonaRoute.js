const express = require('express');
const router = express.Router();
const protected = require('../middlewares/auth');
const personaController = require('../controllers/PersonaController');

router.get('/bydate',protected,personaController.getPersonasByDate);

module.exports = router;