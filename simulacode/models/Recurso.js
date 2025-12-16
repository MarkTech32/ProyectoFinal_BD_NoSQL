const mongoose = require('mongoose');

const recursoSchema = new mongoose.Schema({
  retoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reto'
  },
  titulo: String,
  url: String,
  tipo: String,
  descripcion: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recurso', recursoSchema);