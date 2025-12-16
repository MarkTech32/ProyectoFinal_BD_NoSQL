const Recurso = require('../models/Recurso');

exports.crearRecurso = async (req, res) => {
  const recurso = new Recurso(req.body);
  await recurso.save();
  res.json(recurso);
};

exports.listarRecursosPorReto = async (req, res) => {
  const recursos = await Recurso.find({ retoId: req.params.retoId });
  res.json(recursos);
};

exports.eliminarRecurso = async (req, res) => {
  await Recurso.findByIdAndDelete(req.params.id);
  res.json({ message: 'Recurso eliminado' });
};