const Solucion = require('../models/Solucion');
const Reto = require('../models/Reto');
const octokit = require('../config/github');

exports.registrarSolucion = async (req, res) => {
  const solucion = new Solucion(req.body);
  await solucion.save();
  res.json(solucion);
};

exports.listarSoluciones = async (req, res) => {
  const soluciones = await Solucion.find();
  res.json(soluciones);
};

exports.listarSolucionesPorReto = async (req, res) => {
  const soluciones = await Solucion.find({ retoId: req.params.retoId });
  res.json(soluciones);
};

exports.aprobarPR = async (req, res) => {
  const reto = await Reto.findById(req.params.retoId);
  const [owner, repo] = reto.repositorio.split('/');
  
  await octokit.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: req.body.prNumber,
    body: req.body.comentario
  });
  
  await octokit.pulls.merge({
    owner: owner,
    repo: repo,
    pull_number: req.body.prNumber
  });
  
  await Solucion.findByIdAndUpdate(req.params.solucionId, { estado: 'aprobada' });
  
  res.json({ message: 'PR aprobado y merged' });
};

exports.rechazarPR = async (req, res) => {
  const reto = await Reto.findById(req.params.retoId);
  const [owner, repo] = reto.repositorio.split('/');
  
  await octokit.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: req.body.prNumber,
    body: req.body.comentario
  });
  
  await octokit.pulls.update({
    owner: owner,
    repo: repo,
    pull_number: req.body.prNumber,
    state: 'closed'
  });
  
  await Solucion.findByIdAndUpdate(req.params.solucionId, { estado: 'rechazada' });
  
  res.json({ message: 'PR rechazado y cerrado' });
};