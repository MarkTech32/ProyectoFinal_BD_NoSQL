require('dotenv').config();
const express = require('express');
const octokit = require('./config/github');
const conectarDB = require('./config/basedatos');

conectarDB();

const app = express();
app.use(express.json());

console.log('Token cargado:', process.env.GITHUB_TOKEN ? 'Sí' : 'No');

//Rutas
const retosRoutes = require('./routes/retos');
app.use('/api', retosRoutes);

app.get('/prueba-github', async (req, res) => {
  const repos = await octokit.repos.listForAuthenticatedUser();
  const reposSimplificados = repos.data.map(repo => ({
    nombre: repo.name,
    url: repo.html_url,
    descripcion: repo.description
  }));
  res.json(reposSimplificados);
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en puerto ${PUERTO}`);
});