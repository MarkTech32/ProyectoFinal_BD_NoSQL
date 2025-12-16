const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');

router.get('/estudiantes/:estudianteId/estadisticas', estadisticasController.obtenerEstadisticas);
router.put('/estudiantes/:estudianteId/estadisticas', estadisticasController.actualizarEstadisticas);

module.exports = router;