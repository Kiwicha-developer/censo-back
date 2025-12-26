const express = require('express');
const router = express.Router();
const protected = require('../middlewares/auth');
const dataController = require("../controllers/DataController");

router.get("/discapacitados",protected,dataController.dataByDiscapacidad);

router.get("/estadocivil",protected,dataController.dataByEstadoCivil);

router.get("/estudios",protected,dataController.dataByEstudios);

router.get("/genero",protected,dataController.dataByGeneros);

module.exports = router;