const express = require('express');
const router = express.Router();
const solucionesController = require('../controllers/solucionesController');

router.post('/soluciones', solucionesController.registrarSolucion);
router.get('/soluciones', solucionesController.listarSoluciones);
router.get('/retos/:retoId/soluciones', solucionesController.listarSolucionesPorReto);

module.exports = router;