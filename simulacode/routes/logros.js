const express = require('express');
const router = express.Router();
const logrosController = require('../controllers/logrosController');

router.post('/logros', logrosController.crearLogro);
router.get('/estudiantes/:estudianteId/logros', logrosController.listarLogros);

module.exports = router;