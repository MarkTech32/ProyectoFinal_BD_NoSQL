const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  retoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reto'
  },
  dificultad: Number,
  calidad: Number,
  utilidad: Number,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calificacion', calificacionSchema);