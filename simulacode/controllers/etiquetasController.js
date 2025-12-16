const Etiqueta = require('../models/Etiqueta');

exports.crearEtiqueta = async (req, res) => {
  const etiqueta = new Etiqueta(req.body);
  await etiqueta.save();
  res.json(etiqueta);
};

exports.listarEtiquetas = async (req, res) => {
  const etiquetas = await Etiqueta.find();
  res.json(etiquetas);
};

exports.eliminarEtiqueta = async (req, res) => {
  await Etiqueta.findByIdAndDelete(req.params.id);
  res.json({ message: 'Etiqueta eliminada' });
};