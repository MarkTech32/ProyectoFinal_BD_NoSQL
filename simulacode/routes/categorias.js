const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

router.post('/categorias', categoriasController.crearCategoria);
router.get('/categorias', categoriasController.listarCategorias);
router.delete('/categorias/:id', categoriasController.eliminarCategoria);

module.exports = router;