require('dotenv').config();
const express = require('express');
const octokit = require('./config/github');
const conectarDB = require('./config/basedatos');

conectarDB();

const app = express();
app.use(express.json());
app.use(express.static('public'));

console.log('Token cargado:', process.env.GITHUB_TOKEN ? 'Sí' : 'No');

const retosRoutes = require('./routes/retos');
const solucionesRoutes = require('./routes/soluciones');
app.use('/api', retosRoutes);
app.use('/api', solucionesRoutes);

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