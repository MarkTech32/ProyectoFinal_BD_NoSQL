const Reto = require('../models/Reto');

exports.crearReto = async (req, res) => {
  const reto = new Reto(req.body);
  await reto.save();
  res.json(reto);
};

exports.listarRetos = async (req, res) => {
  const retos = await Reto.find();
  res.json(retos);
};