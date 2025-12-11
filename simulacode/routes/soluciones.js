const express = require('express');
const router = express.Router();
const solucionesController = require('../controllers/solucionesController');

router.post('/soluciones', solucionesController.registrarSolucion);
router.get('/soluciones', solucionesController.listarSoluciones);
router.get('/retos/:retoId/soluciones', solucionesController.listarSolucionesPorReto);
router.post('/retos/:retoId/soluciones/:solucionId/aprobar', solucionesController.aprobarPR);
router.post('/retos/:retoId/soluciones/:solucionId/rechazar', solucionesController.rechazarPR);

module.exports = router;