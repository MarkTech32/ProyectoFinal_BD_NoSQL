const mongoose = require('mongoose');

const logroSchema = new mongoose.Schema({
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  nombre: String,
  descripcion: String,
  icono: String,
  fechaObtencion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Logro', logroSchema);