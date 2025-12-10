const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({
nombre: String,
email: String,
githubUsername: String,
rol: String,
fechaRegistro: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Usuario', usuarioSchema);