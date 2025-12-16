const Sesion = require('../models/Sesion');

exports.crearSesion = async (req, res) => {
  const sesion = new Sesion(req.body);
  await sesion.save();
  res.json(sesion);
};

exports.listarSesiones = async (req, res) => {
  const sesiones = await Sesion.find().populate('mentorId', 'nombre');
  res.json(sesiones);
};

exports.inscribirEstudiante = async (req, res) => {
  const sesion = await Sesion.findById(req.params.id);
  
  if (!sesion.estudiantesInscritos.includes(req.body.estudianteId)) {
    sesion.estudiantesInscritos.push(req.body.estudianteId);
    await sesion.save();
  }
  
  res.json(sesion);
};

exports.cancelarInscripcion = async (req, res) => {
  const sesion = await Sesion.findById(req.params.id);
  
  sesion.estudiantesInscritos = sesion.estudiantesInscritos.filter(
    id => id.toString() !== req.body.estudianteId
  );
  await sesion.save();
  
  res.json(sesion);
};

exports.eliminarSesion = async (req, res) => {
  await Sesion.findByIdAndDelete(req.params.id);
  res.json({ message: 'Sesión eliminada' });
};