const Estadistica = require('../models/Estadistica');

exports.obtenerEstadisticas = async (req, res) => {
  let estadistica = await Estadistica.findOne({ estudianteId: req.params.estudianteId });
  
  if (!estadistica) {
    estadistica = new Estadistica({
      estudianteId: req.params.estudianteId,
      retosCompletados: 0,
      prsAprobados: 0,
      prsRechazados: 0
    });
    await estadistica.save();
  }
  
  res.json(estadistica);
};

exports.actualizarEstadisticas = async (req, res) => {
  const estadistica = await Estadistica.findOneAndUpdate(
    { estudianteId: req.params.estudianteId },
    req.body,
    { new: true, upsert: true }
  );
  res.json(estadistica);
};