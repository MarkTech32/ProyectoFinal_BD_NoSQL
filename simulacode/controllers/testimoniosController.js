const Testimonio = require('../models/Testimonio');
 
exports.crearTestimonio = async (req, res) => {
  const testimonio = new Testimonio(req.body);
  await testimonio.save();
  res.json(testimonio);
};
 
exports.listarTestimoniosPorReto = async (req, res) => {
  const testimonios = await Testimonio.find({ retoId: req.params.retoId })
    .populate('estudianteId', 'nombre');
  res.json(testimonios);
};
 
exports.eliminarTestimonio = async (req, res) => {
  await Testimonio.findByIdAndDelete(req.params.id);
  res.json({ message: 'Testimonio eliminado' });
};