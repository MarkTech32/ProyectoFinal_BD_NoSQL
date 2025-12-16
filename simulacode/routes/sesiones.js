const express = require('express');
const router = express.Router();
const sesionesController = require('../controllers/sesionesController');

router.post('/sesiones', sesionesController.crearSesion);
router.get('/sesiones', sesionesController.listarSesiones);
router.post('/sesiones/:id/inscribir', sesionesController.inscribirEstudiante);
router.post('/sesiones/:id/cancelar', sesionesController.cancelarInscripcion);
router.delete('/sesiones/:id', sesionesController.eliminarSesion);

module.exports = router;