const Reto = require('../models/Reto');
const octokit = require('../config/github');
const Comentario = require('../models/Comentario');

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

exports.listarPRs = async (req, res) => {
  const reto = await Reto.findById(req.params.id);
  const [owner, repo] = reto.repositorio.split('/');
  
  const prs = await octokit.pulls.list({
    owner: owner,
    repo: repo
  });
  
  res.json(prs.data);
};

exports.comentarPR = async (req, res) => {
  const reto = await Reto.findById(req.params.id);
  const [owner, repo] = reto.repositorio.split('/');
  
  const comment = await octokit.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: req.body.prNumber,
    body: req.body.comentario
  });
  
  const comentario = new Comentario({
    retoId: req.params.id,
    prNumber: req.body.prNumber,
    autor: 'Mentor',
    contenido: req.body.comentario
  });
  await comentario.save();
  
  res.json(comment.data);
};

exports.eliminarReto = async (req, res) => {
  const reto = await Reto.findById(req.params.id);
  const [owner, repo] = reto.repositorio.split('/');
  
  try {
    await octokit.repos.delete({
      owner: owner,
      repo: repo
    });
  } catch (error) {
    console.log('El repositorio no existe en GitHub o ya fue eliminado');
  }
  
  await Reto.findByIdAndDelete(req.params.id);
  
  res.json({ message: 'Reto eliminado de MongoDB' });
};

exports.listarComentarios = async (req, res) => {
  const comentarios = await Comentario.find({ retoId: req.params.id });
  res.json(comentarios);
};

exports.editarReto = async (req, res) => {
  const reto = await Reto.findById(req.params.id);
  const [owner, repo] = reto.repositorio.split('/');
  
  try {
    await octokit.repos.update({
      owner: owner,
      repo: repo,
      description: req.body.descripcion
    });
  } catch (error) {
    console.log('No se pudo actualizar el repositorio en GitHub');
  }
  
  const retoActualizado = await Reto.findByIdAndUpdate(
    req.params.id,
    { 
      titulo: req.body.titulo,
      descripcion: req.body.descripcion 
    },
    { new: true }
  );
  
  res.json(retoActualizado);
};