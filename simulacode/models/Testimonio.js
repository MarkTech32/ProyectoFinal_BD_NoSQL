const mongoose = require('mongoose');
 
const testimonioSchema = new mongoose.Schema({
  retoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reto'
  },
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  calificacionDificultad: { type: Number, min: 1, max: 5 },
  calificacionUtilidad: { type: Number, min: 1, max: 5 },
  comentario: String,
  fechaCreacion: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('Testimonio', testimonioSchema);