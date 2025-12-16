const mongoose = require('mongoose');

const sesionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  titulo: String,
  descripcion: String,
  fecha: Date,
  hora: String,
  link: String,
  estudiantesInscritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sesion', sesionSchema);