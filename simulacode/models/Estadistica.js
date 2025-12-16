const mongoose = require('mongoose');

const estadisticaSchema = new mongoose.Schema({
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  retosCompletados: { type: Number, default: 0 },
  prsAprobados: { type: Number, default: 0 },
  prsRechazados: { type: Number, default: 0 },
  fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Estadistica', estadisticaSchema);