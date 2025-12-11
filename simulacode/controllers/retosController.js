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
  
  res.json(comment.data);
};