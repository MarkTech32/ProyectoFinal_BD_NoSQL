const Calificacion = require('../models/Calificacion');

exports.crearCalificacion = async (req, res) => {
  const calificacion = new Calificacion(req.body);
  await calificacion.save();
  res.json(calificacion);
};

exports.obtenerCalificacion = async (req, res) => {
  const calificacion = await Calificacion.findOne({ retoId: req.params.retoId });
  res.json(calificacion);
};