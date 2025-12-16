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
const categoriasRoutes = require('./routes/categorias');
const calificacionesRoutes = require('./routes/calificaciones');
const etiquetasRoutes = require('./routes/etiquetas');
const logrosRoutes = require('./routes/logros');
const estadisticasRoutes = require('./routes/estadisticas');
const usuariosRoutes = require('./routes/usuarios');
const recursosRoutes = require('./routes/recursos');
const sesionesRoutes = require('./routes/sesiones');

app.use('/api', retosRoutes);
app.use('/api', solucionesRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', calificacionesRoutes);
app.use('/api', etiquetasRoutes);
app.use('/api', logrosRoutes);
app.use('/api', estadisticasRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', recursosRoutes);
app.use('/api', sesionesRoutes);

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