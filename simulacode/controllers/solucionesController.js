const Solucion = require('../models/Solucion');

exports.registrarSolucion = async (req, res) => {
  const solucion = new Solucion(req.body);
  await solucion.save();
  res.json(solucion);
};

exports.listarSoluciones = async (req, res) => {
  const soluciones = await Solucion.find();
  res.json(soluciones);
};