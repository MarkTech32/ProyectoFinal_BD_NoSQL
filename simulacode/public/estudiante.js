async function cargarRetos() {
  const response = await fetch('/api/retos');
  const retos = await response.json();
  
  const listaRetos = document.getElementById('listaRetos');
  listaRetos.innerHTML = '';
  
  for (const reto of retos) {
    const recursosResponse = await fetch(`/api/retos/${reto._id}/recursos`);
    const recursos = await recursosResponse.json();
    
    let recursosHTML = '';
    if (recursos.length > 0) {
      recursosHTML = '<h4>Recursos útiles:</h4>';
      recursos.forEach(recurso => {
        recursosHTML += `
          <div style="border: 1px solid #ddd; padding: 8px; margin: 5px 0; background-color: #f9f9f9;">
            <strong>${recurso.titulo}</strong> (${recurso.tipo})
            <br><a href="${recurso.url}" target="_blank">🔗 ${recurso.url}</a>
            ${recurso.descripcion ? `<br><small>${recurso.descripcion}</small>` : ''}
          </div>
        `;
      });
    }
    
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${reto.titulo}</h3>
      <p>${reto.descripcion}</p>
      <p>Repositorio: <a href="https://github.com/${reto.repositorio}" target="_blank">${reto.repositorio}</a></p>
      
      ${recursosHTML}
      
      <form onsubmit="enviarSolucion(event, '${reto._id}')">
        <input type="text" id="prUrl-${reto._id}" placeholder="URL de tu Pull Request" required>
        <input type="number" id="prNumber-${reto._id}" placeholder="Número del PR" required>
        <button type="submit">Enviar Solución</button>
      </form>
      <hr>
    `;
    listaRetos.appendChild(div);
  }
}

async function enviarSolucion(event, retoId) {
  event.preventDefault();
  
  const prUrl = document.getElementById(`prUrl-${retoId}`).value;
  const prNumber = document.getElementById(`prNumber-${retoId}`).value;

  await fetch('/api/soluciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      retoId: retoId,
      pullRequestUrl: prUrl,
      pullRequestNumber: prNumber,
      estado: 'pendiente'
    })
  });

  alert('¡Solución enviada correctamente!');
  event.target.reset();
}

// Manejo de Sesiones de Mentoría
const estudianteId = '69411067d5623f60e091af19'; // Cambiar por el ID real del estudiante

async function cargarSesionesDisponibles() {
  const response = await fetch('/api/sesiones');
  const sesiones = await response.json();
  
  const listaSesiones = document.getElementById('listaSesionesDisponibles');
  listaSesiones.innerHTML = '';
  
  if (sesiones.length === 0) {
    listaSesiones.innerHTML = '<p>No hay sesiones disponibles</p>';
  } else {
    sesiones.forEach(sesion => {
      const fechaFormateada = new Date(sesion.fecha).toLocaleDateString();
      const estaInscrito = sesion.estudiantesInscritos.includes(estudianteId);
      
      listaSesiones.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; background-color: ${estaInscrito ? '#d4edda' : 'white'};">
          <h4>${sesion.titulo}</h4>
          <p>${sesion.descripcion}</p>
          <p><strong>Fecha:</strong> ${fechaFormateada} a las ${sesion.hora}</p>
          <p><strong>Link de la sesión:</strong> <a href="${sesion.link}" target="_blank">${sesion.link}</a></p>
          <p><strong>Mentor:</strong> ${sesion.mentorId?.nombre || 'Sin información'}</p>
          <p><strong>Inscritos:</strong> ${sesion.estudiantesInscritos.length} estudiante(s)</p>
          ${estaInscrito 
            ? `<button onclick="cancelarInscripcion('${sesion._id}')" style="background-color: #dc3545; color: white;">Cancelar Inscripción</button>`
            : `<button onclick="inscribirse('${sesion._id}')" style="background-color: #28a745; color: white;">Inscribirme</button>`
          }
        </div>
      `;
    });
  }
}

async function inscribirse(sesionId) {
  await fetch(`/api/sesiones/${sesionId}/inscribir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estudianteId })
  });
  
  alert('¡Te has inscrito exitosamente!');
  cargarSesionesDisponibles();
}

async function cancelarInscripcion(sesionId) {
  await fetch(`/api/sesiones/${sesionId}/cancelar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estudianteId })
  });
  
  alert('Inscripción cancelada');
  cargarSesionesDisponibles();
}

cargarSesionesDisponibles();
cargarRetos();