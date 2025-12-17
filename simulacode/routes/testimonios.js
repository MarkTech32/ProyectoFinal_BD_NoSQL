const express = require('express');
const router = express.Router();
const testimoniosController = require('../controllers/testimoniosController');
 
router.post('/testimonios', testimoniosController.crearTestimonio);
router.get('/retos/:retoId/testimonios', testimoniosController.listarTestimoniosPorReto);
router.delete('/testimonios/:id', testimoniosController.eliminarTestimonio);
 
module.exports = router;