const express = require('express');
const router = express.Router();
const retosController = require('../controllers/retosController');

router.post('/retos', retosController.crearReto);
router.get('/retos', retosController.listarRetos);

module.exports = router;