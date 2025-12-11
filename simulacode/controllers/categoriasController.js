const Categoria = require('../models/Categoria');

exports.crearCategoria = async (req, res) => {
  const categoria = new Categoria(req.body);
  await categoria.save();
  res.json(categoria);
};

exports.listarCategorias = async (req, res) => {
  const categorias = await Categoria.find();
  res.json(categorias);
};

exports.eliminarCategoria = async (req, res) => {
  await Categoria.findByIdAndDelete(req.params.id);
  res.json({ message: 'Categoría eliminada' });
};