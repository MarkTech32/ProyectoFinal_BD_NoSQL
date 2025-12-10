const Reto = require('../models/Reto');
const octokit = require('../config/github');

exports.crearReto = async (req, res) => {
  const repo = await octokit.repos.createForAuthenticatedUser({
    name: req.body.titulo,
    description: req.body.descripcion
  });
  
  const reto = new Reto({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    repositorio: repo.data.full_name
  });
  await reto.save();
  res.json(reto);
};

exports.listarRetos = async (req, res) => {
  const retos = await Reto.find();
  res.json(retos);
};