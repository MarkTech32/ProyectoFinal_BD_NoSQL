const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Categoria', categoriaSchema);