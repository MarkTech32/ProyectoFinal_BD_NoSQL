const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  retoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reto'
  },
  prNumber: Number,
  autor: String,
  contenido: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);