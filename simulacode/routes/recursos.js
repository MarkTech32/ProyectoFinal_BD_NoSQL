const express = require('express');
const router = express.Router();
const recursosController = require('../controllers/recursosController');

router.post('/recursos', recursosController.crearRecurso);
router.get('/retos/:retoId/recursos', recursosController.listarRecursosPorReto);
router.delete('/recursos/:id', recursosController.eliminarRecurso);

module.exports = router;