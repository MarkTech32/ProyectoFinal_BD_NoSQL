const mongoose = require('mongoose');

const etiquetaSchema = new mongoose.Schema({
  nombre: String,
  color: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Etiqueta', etiquetaSchema);