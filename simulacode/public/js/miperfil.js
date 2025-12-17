const estudianteId = '69411067d5623f60e091af19';

async function cargarPerfil() {
  const response = await fetch(`/api/usuarios/${estudianteId}`);
  const usuario = await response.json();
  
  const infoPersonal = document.getElementById('infoPersonal');
  infoPersonal.innerHTML = `
    <p><strong>Nombre:</strong> ${usuario.nombre}</p>
    <p><strong>Email:</strong> ${usuario.email}</p>
    <p><strong>GitHub Username:</strong> ${usuario.githubUsername}</p>
    <p><strong>Rol:</strong> ${usuario.rol}</p>
    <p><strong>Fecha de Registro:</strong> ${new Date(usuario.fechaRegistro).toLocaleDateString()}</p>
  `;
}

async function cargarEstadisticas() {
  const response = await fetch(`/api/estudiantes/${estudianteId}/estadisticas`);
  const stats = await response.json();
  
  const estadisticas = document.getElementById('estadisticas');
  estadisticas.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <div style="border: 1px solid #ccc; padding: 20px; text-align: center;">
        <h3 style="font-size: 48px; margin: 0;">${stats.retosCompletados}</h3>
        <p>Retos Completados</p>
      </div>
      <div style="border: 1px solid #ccc; padding: 20px; text-align: center; background-color: #d4edda;">
        <h3 style="font-size: 48px; margin: 0; color: #155724;">${stats.prsAprobados}</h3>
        <p>PRs Aprobados</p>
      </div>
      <div style="border: 1px solid #ccc; padding: 20px; text-align: center; background-color: #f8d7da;">
        <h3 style="font-size: 48px; margin: 0; color: #721c24;">${stats.prsRechazados}</h3>
        <p>PRs Rechazados</p>
      </div>
    </div>
  `;
}

async function cargarLogros() {
  const response = await fetch(`/api/estudiantes/${estudianteId}/logros`);
  const logros = await response.json();
  
  const listaLogros = document.getElementById('listaLogros');
  
  if (logros.length === 0) {
    listaLogros.innerHTML = '<p>Aún no has obtenido logros. ¡Sigue resolviendo retos!</p>';
  } else {
    listaLogros.innerHTML = '';
    logros.forEach(logro => {
      listaLogros.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px; display: inline-block; text-align: center; width: 150px;">
          <div style="font-size: 48px;">${logro.icono}</div>
          <h3>${logro.nombre}</h3>
          <p>${logro.descripcion}</p>
          <small>${new Date(logro.fechaObtencion).toLocaleDateString()}</small>
        </div>
      `;
    });
  }
}

cargarPerfil();
cargarEstadisticas();
cargarLogros();