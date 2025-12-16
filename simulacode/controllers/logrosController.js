const Logro = require('../models/Logro');

exports.crearLogro = async (req, res) => {
  const logro = new Logro(req.body);
  await logro.save();
  res.json(logro);
};

exports.listarLogros = async (req, res) => {
  const logros = await Logro.find({ estudianteId: req.params.estudianteId });
  res.json(logros);
};