const mongoose = require('mongoose');

const conectarDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado');
};

module.exports = conectarDB;