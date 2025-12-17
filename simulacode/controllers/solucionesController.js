const Solucion = require('../models/Solucion');
const Reto = require('../models/Reto');
const octokit = require('../config/github');
const Logro = require('../models/Logro');
const Estadistica = require('../models/Estadistica');

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
  
  const solucion = await Solucion.findByIdAndUpdate(
    req.params.solucionId, 
    { estado: 'aprobada' },
    { new: true }
  );
  
  // Contar PRs aprobados del estudiante
  const prsAprobados = await Solucion.countDocuments({ 
    estudianteId: solucion.estudianteId, 
    estado: 'aprobada' 
  });
  
  // Verificar que no tenga ya el logro
  const logroExistente1 = await Logro.findOne({
    estudianteId: solucion.estudianteId,
    nombre: "Primer Éxito"
  });
  
  const logroExistente2 = await Logro.findOne({
    estudianteId: solucion.estudianteId,
    nombre: "Racha Ganadora"
  });
  
  // Otorgar logro de primer PR aprobado
  if (prsAprobados === 1 && !logroExistente1) {
    await new Logro({
      estudianteId: solucion.estudianteId,
      nombre: "Primer Éxito",
      descripcion: "¡Tu primer PR fue aprobado!",
      icono: "🎉"
    }).save();
  }
  
  // Otorgar logro de segundo PR aprobado
  if (prsAprobados === 2 && !logroExistente2) {
    await new Logro({
      estudianteId: solucion.estudianteId,
      nombre: "Racha Ganadora",
      descripcion: "¡Dos PRs aprobados consecutivos!",
      icono: "🔥"
    }).save();
  }
  
  // Actualizar estadísticas
  await Estadistica.findOneAndUpdate(
    { estudianteId: solucion.estudianteId },
    { 
      $inc: { prsAprobados: 1, retosCompletados: 1 },
      $set: { fechaActualizacion: new Date() }
    },
    { upsert: true }
  );
  
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
  
  const solucion = await Solucion.findByIdAndUpdate(
    req.params.solucionId, 
    { estado: 'rechazada' },
    { new: true }
  );
  
  // Contar PRs rechazados del estudiante
  const prsRechazados = await Solucion.countDocuments({ 
    estudianteId: solucion.estudianteId, 
    estado: 'rechazada' 
  });
  
  // Verificar que no tenga ya el logro
  const logroExistente = await Logro.findOne({
    estudianteId: solucion.estudianteId,
    nombre: "Primera Lección"
  });
  
  // Otorgar logro de primer PR rechazado
  if (prsRechazados === 1 && !logroExistente) {
    await new Logro({
      estudianteId: solucion.estudianteId,
      nombre: "Primera Lección",
      descripcion: "Todo programador aprende de los errores",
      icono: "📚"
    }).save();
  }
  
  // Actualizar estadísticas
  await Estadistica.findOneAndUpdate(
    { estudianteId: solucion.estudianteId },
    { 
      $inc: { prsRechazados: 1 },
      $set: { fechaActualizacion: new Date() }
    },
    { upsert: true }
  );
  
  res.json({ message: 'PR rechazado y cerrado' });
};