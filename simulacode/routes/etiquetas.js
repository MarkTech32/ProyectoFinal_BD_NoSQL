const express = require('express');
const router = express.Router();
const etiquetasController = require('../controllers/etiquetasController');

router.post('/etiquetas', etiquetasController.crearEtiqueta);
router.get('/etiquetas', etiquetasController.listarEtiquetas);
router.delete('/etiquetas/:id', etiquetasController.eliminarEtiqueta);

module.exports = router;