const express = require('express');
const router = express.Router();
const calificacionesController = require('../controllers/calificacionesController');

router.post('/calificaciones', calificacionesController.crearCalificacion);
router.get('/retos/:retoId/calificacion', calificacionesController.obtenerCalificacion);

module.exports = router;