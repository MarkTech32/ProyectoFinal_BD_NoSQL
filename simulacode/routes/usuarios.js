const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.post('/usuarios', usuariosController.crearUsuario);
router.get('/usuarios', usuariosController.listarUsuarios);
router.get('/usuarios/:id', usuariosController.obtenerUsuario);

module.exports = router;