const mongoose = require('mongoose');

const solucionSchema = new mongoose.Schema({
  retoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reto'
  },
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  pullRequestUrl: String,
  pullRequestNumber: Number,
  estado: String,
  fechaEnvio: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solucion', solucionSchema);