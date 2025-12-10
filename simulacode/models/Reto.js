const mongoose = require('mongoose');

const retoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  repositorio: String,
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reto', retoSchema);