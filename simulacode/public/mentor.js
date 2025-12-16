const formReto = document.getElementById('formReto');
const formCategoria = document.getElementById('formCategoria');
const formEtiqueta = document.getElementById('formEtiqueta');
const listaRetos = document.getElementById('listaRetos');
const listaCategorias = document.getElementById('listaCategorias');
const listaEtiquetas = document.getElementById('listaEtiquetas');

formEtiqueta.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombreEtiqueta').value;
  const color = document.getElementById('colorEtiqueta').value;

  await fetch('/api/etiquetas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, color })
  });

  alert('Etiqueta creada');
  formEtiqueta.reset();
  cargarEtiquetas();
});

formCategoria.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombreCategoria').value;
  const descripcion = document.getElementById('descripcionCategoria').value;

  await fetch('/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion })
  });

  alert('Categoría creada');
  formCategoria.reset();
  cargarCategorias();
});

formReto.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descripcion = document.getElementById('descripcion').value;
  const categoriaId = document.getElementById('categoria').value;
  
  const etiquetas = [];
  document.querySelectorAll('input[name="etiquetas"]:checked').forEach(checkbox => {
    etiquetas.push(checkbox.value);
  });

  const response = await fetch('/api/retos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion, categoriaId, etiquetas })
  });

  const reto = await response.json();
  alert('Reto creado: ' + reto.titulo);
  cargarRetos();
  formReto.reset();
});

async function cargarCategorias() {
  const response = await fetch('/api/categorias');
  const categorias = await response.json();
  
  listaCategorias.innerHTML = '';
  const select = document.getElementById('categoria');
  select.innerHTML = '<option value="">Selecciona una categoría</option>';
  
  categorias.forEach(cat => {
    listaCategorias.innerHTML += `
      <p>${cat.nombre} - ${cat.descripcion} 
      <button onclick="eliminarCategoria('${cat._id}')">Eliminar</button></p>
    `;
    
    const option = document.createElement('option');
    option.value = cat._id;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}

async function eliminarCategoria(id) {
  await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
  alert('Categoría eliminada');
  cargarCategorias();
}

async function cargarEtiquetas() {
  const response = await fetch('/api/etiquetas');
  const etiquetas = await response.json();
  
  listaEtiquetas.innerHTML = '';
  const checkboxContainer = document.getElementById('etiquetasCheckboxes');
  checkboxContainer.innerHTML = '<p>Selecciona etiquetas:</p>';
  
  etiquetas.forEach(etiq => {
    listaEtiquetas.innerHTML += `
      <span style="background: ${etiq.color}; color: white; padding: 5px; margin: 2px; display: inline-block;">
        ${etiq.nombre}
        <button onclick="eliminarEtiqueta('${etiq._id}')" style="background: transparent; border: none; color: white; cursor: pointer;">✕</button>
      </span>
    `;
    
    checkboxContainer.innerHTML += `
      <label style="display: block;">
        <input type="checkbox" name="etiquetas" value="${etiq._id}">
        <span style="background: ${etiq.color}; color: white; padding: 2px 8px; border-radius: 3px;">${etiq.nombre}</span>
      </label>
    `;
  });
}

async function eliminarEtiqueta(id) {
  await fetch(`/api/etiquetas/${id}`, { method: 'DELETE' });
  alert('Etiqueta eliminada');
  cargarEtiquetas();
}

async function cargarRetos() {
  const response = await fetch('/api/retos');
  const retos = await response.json();
  
  const categorias = await fetch('/api/categorias').then(r => r.json());
  const todasEtiquetas = await fetch('/api/etiquetas').then(r => r.json());
  
  listaRetos.innerHTML = '';
  retos.forEach(reto => {
    const categoria = categorias.find(c => c._id === reto.categoriaId);
    
    let etiquetasHTML = '';
    if (reto.etiquetas && reto.etiquetas.length > 0) {
      reto.etiquetas.forEach(etiqId => {
        const etiq = todasEtiquetas.find(e => e._id === etiqId);
        if (etiq) {
          etiquetasHTML += `<span style="background: ${etiq.color}; color: white; padding: 2px 8px; margin: 2px; border-radius: 3px; display: inline-block;">${etiq.nombre}</span>`;
        }
      });
    }
    
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${reto.titulo}</h3>
      <p>${reto.descripcion}</p>
      <p><strong>Categoría:</strong> ${categoria ? categoria.nombre : 'Sin categoría'}</p>
      <p><strong>Etiquetas:</strong> ${etiquetasHTML || 'Sin etiquetas'}</p>
      <p>Repositorio: ${reto.repositorio}</p>
      <button onclick="verPRs('${reto._id}')">Ver Pull Requests</button>
      <button onclick="verSoluciones('${reto._id}')">Ver Soluciones Enviadas</button>
      <button onclick="verComentarios('${reto._id}')">Ver Historial de Comentarios</button>
      <button onclick="mostrarCalificacion('${reto._id}')">Calificar Reto</button>
      <button onclick="mostrarRecursos('${reto._id}')">Gestionar Recursos</button>
      <button onclick="eliminarReto('${reto._id}', '${reto.titulo}')" style="background-color: red; color: white;">Eliminar Reto</button>
      <div id="form-calificacion-${reto._id}" style="display: none; margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
        <h4>Calificar Reto</h4>
        <label>Dificultad (1-5): <input type="number" id="dificultad-${reto._id}" min="1" max="5" value="3"></label><br>
        <label>Calidad (1-5): <input type="number" id="calidad-${reto._id}" min="1" max="5" value="3"></label><br>
        <label>Utilidad (1-5): <input type="number" id="utilidad-${reto._id}" min="1" max="5" value="3"></label><br>
        <button onclick="guardarCalificacion('${reto._id}')">Guardar</button>
        <button onclick="cancelarCalificacion('${reto._id}')">Cancelar</button>
      </div>
      <div id="prs-${reto._id}"></div>
      <div id="soluciones-${reto._id}"></div>
      <div id="comentarios-${reto._id}"></div>
      <div id="recursos-${reto._id}"></div>
      <hr>
    `;
    listaRetos.appendChild(div);
  });
}

function mostrarCalificacion(retoId) {
  const form = document.getElementById(`form-calificacion-${retoId}`);
  form.style.display = 'block';
}

function cancelarCalificacion(retoId) {
  const form = document.getElementById(`form-calificacion-${retoId}`);
  form.style.display = 'none';
}

async function guardarCalificacion(retoId) {
  const dificultad = document.getElementById(`dificultad-${retoId}`).value;
  const calidad = document.getElementById(`calidad-${retoId}`).value;
  const utilidad = document.getElementById(`utilidad-${retoId}`).value;

  await fetch('/api/calificaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retoId, dificultad, calidad, utilidad })
  });

  alert('Calificación guardada');
  cancelarCalificacion(retoId);
}

async function verComentarios(retoId) {
  const response = await fetch(`/api/retos/${retoId}/comentarios`);
  const comentarios = await response.json();
  
  const divComentarios = document.getElementById(`comentarios-${retoId}`);
  
  if (comentarios.length === 0) {
    divComentarios.innerHTML = '<p>No hay comentarios aún</p>';
  } else {
    divComentarios.innerHTML = '<h4>Historial de Comentarios:</h4>';
    comentarios.forEach(com => {
      divComentarios.innerHTML += `
        <p>
          <strong>${com.autor}</strong> - PR #${com.prNumber}
          <br>${com.contenido}
          <br><small>${new Date(com.fechaCreacion).toLocaleString()}</small>
        </p>
      `;
    });
  }
}

async function eliminarReto(retoId, titulo) {
  const confirmacion = confirm(`¿Estás seguro de eliminar el reto "${titulo}"? Esto eliminará el repositorio de GitHub y todos los datos asociados.`);
  
  if (!confirmacion) return;
  
  await fetch(`/api/retos/${retoId}`, { method: 'DELETE' });
  
  alert('Reto eliminado correctamente');
  cargarRetos();
}

async function verSoluciones(retoId) {
  const response = await fetch(`/api/retos/${retoId}/soluciones`);
  const soluciones = await response.json();
  
  const divSoluciones = document.getElementById(`soluciones-${retoId}`);
  
  if (soluciones.length === 0) {
    divSoluciones.innerHTML = '<p>No hay soluciones enviadas aún</p>';
  } else {
    divSoluciones.innerHTML = '<h4>Soluciones Enviadas:</h4>';
    soluciones.forEach(solucion => {
      divSoluciones.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
          <p><strong>Estado:</strong> ${solucion.estado}</p>
          <p>PR #${solucion.pullRequestNumber}</p>
          <p><a href="${solucion.pullRequestUrl}" target="_blank">Ver Pull Request</a></p>
          <p>Enviado: ${new Date(solucion.fechaEnvio).toLocaleDateString()}</p>
          
          <textarea id="comentario-aprobar-${solucion._id}" placeholder="Comentario de aprobación" rows="2" style="width: 100%;"></textarea>
          <button onclick="aprobarPR('${solucion._id}', '${retoId}', ${solucion.pullRequestNumber})">Aprobar y Merge</button>
          
          <br><br>
          
          <textarea id="comentario-rechazar-${solucion._id}" placeholder="Comentario de rechazo" rows="2" style="width: 100%;"></textarea>
          <button onclick="rechazarPR('${solucion._id}', '${retoId}', ${solucion.pullRequestNumber})">Rechazar y Cerrar</button>
        </div>
      `;
    });
  }
}

async function aprobarPR(solucionId, retoId, prNumber) {
  const comentario = document.getElementById(`comentario-aprobar-${solucionId}`).value;
  
  if (!comentario) {
    alert('Por favor escribe un comentario explicando por qué apruebas este PR');
    return;
  }
  
  await fetch(`/api/retos/${retoId}/soluciones/${solucionId}/aprobar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prNumber: prNumber, comentario: comentario })
  });
  
  alert('PR aprobado y merged en GitHub!');
  verSoluciones(retoId);
}

async function rechazarPR(solucionId, retoId, prNumber) {
  const comentario = document.getElementById(`comentario-rechazar-${solucionId}`).value;
  
  if (!comentario) {
    alert('Por favor escribe un comentario explicando por qué rechazas este PR');
    return;
  }
  
  await fetch(`/api/retos/${retoId}/soluciones/${solucionId}/rechazar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prNumber: prNumber, comentario: comentario })
  });
  
  alert('PR rechazado y cerrado en GitHub!');
  verSoluciones(retoId);
}

async function verPRs(retoId) {
  const response = await fetch(`/api/retos/${retoId}/prs`);
  const prs = await response.json();
  
  const divPRs = document.getElementById(`prs-${retoId}`);
  
  if (prs.length === 0) {
    divPRs.innerHTML = '<p>No hay pull requests aún</p>';
  } else {
    divPRs.innerHTML = '<h4>Pull Requests:</h4>';
    prs.forEach(pr => {
      divPRs.innerHTML += `
        <p>
          PR #${pr.number}: ${pr.title} - ${pr.state}
          <br><a href="${pr.html_url}" target="_blank">Ver en GitHub</a>
          <br>
          <form onsubmit="comentarPR(event, '${retoId}', ${pr.number})">
            <input type="text" id="comentario-${retoId}-${pr.number}" placeholder="Escribe un comentario" required>
            <button type="submit">Enviar Comentario</button>
          </form>
        </p>
      `;
    });
  }
}

async function comentarPR(event, retoId, prNumber) {
  event.preventDefault();
  
  const comentario = document.getElementById(`comentario-${retoId}-${prNumber}`).value;
  
  await fetch(`/api/retos/${retoId}/comentar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prNumber: prNumber,
      comentario: comentario
    })
  });
  
  alert('Comentario enviado correctamente');
  event.target.reset();
}

// Cargar todo al inicio
cargarCategorias();
cargarEtiquetas();
cargarRetos();

async function mostrarRecursos(retoId) {
  const response = await fetch(`/api/retos/${retoId}/recursos`);
  const recursos = await response.json();
  
  const divRecursos = document.getElementById(`recursos-${retoId}`);
  
  divRecursos.innerHTML = '<h4>Recursos:</h4>';
  
  divRecursos.innerHTML += `
    <form onsubmit="agregarRecurso(event, '${retoId}')">
      <input type="text" id="titulo-recurso-${retoId}" placeholder="Título" required>
      <input type="url" id="url-recurso-${retoId}" placeholder="URL" required>
      <select id="tipo-recurso-${retoId}">
        <option value="video">Video</option>
        <option value="articulo">Artículo</option>
        <option value="documentacion">Documentación</option>
        <option value="tutorial">Tutorial</option>
      </select>
      <input type="text" id="descripcion-recurso-${retoId}" placeholder="Descripción">
      <button type="submit">Agregar Recurso</button>
    </form>
    <br>
  `;
  
  if (recursos.length === 0) {
    divRecursos.innerHTML += '<p>No hay recursos agregados</p>';
  } else {
    recursos.forEach(recurso => {
      divRecursos.innerHTML += `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
          <strong>${recurso.titulo}</strong> (${recurso.tipo})
          <br><a href="${recurso.url}" target="_blank">${recurso.url}</a>
          <br><small>${recurso.descripcion || ''}</small>
          <br><button onclick="eliminarRecurso('${recurso._id}', '${retoId}')">Eliminar</button>
        </div>
      `;
    });
  }
}

async function agregarRecurso(event, retoId) {
  event.preventDefault();
  
  const titulo = document.getElementById(`titulo-recurso-${retoId}`).value;
  const url = document.getElementById(`url-recurso-${retoId}`).value;
  const tipo = document.getElementById(`tipo-recurso-${retoId}`).value;
  const descripcion = document.getElementById(`descripcion-recurso-${retoId}`).value;
  
  await fetch('/api/recursos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retoId, titulo, url, tipo, descripcion })
  });
  
  alert('Recurso agregado');
  mostrarRecursos(retoId);
}

async function eliminarRecurso(recursoId, retoId) {
  await fetch(`/api/recursos/${recursoId}`, { method: 'DELETE' });
  alert('Recurso eliminado');
  mostrarRecursos(retoId);
}

// Manejo de Sesiones de Mentoría
const formSesion = document.getElementById('formSesion');

formSesion.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const titulo = document.getElementById('tituloSesion').value;
  const descripcion = document.getElementById('descripcionSesion').value;
  const fecha = document.getElementById('fechaSesion').value;
  const hora = document.getElementById('horaSesion').value;
  const link = document.getElementById('linkSesion').value;
  
  await fetch('/api/sesiones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      mentorId: '69411067d5623f60e091af19', // Cambiar por el ID real del mentor
      titulo, 
      descripcion, 
      fecha, 
      hora,
      link
    })
  });
  
  alert('Sesión creada');
  formSesion.reset();
  cargarSesiones();
});

async function cargarSesiones() {
  const response = await fetch('/api/sesiones');
  const sesiones = await response.json();
  
  const listaSesiones = document.getElementById('listaSesiones');
  listaSesiones.innerHTML = '';
  
  if (sesiones.length === 0) {
    listaSesiones.innerHTML = '<p>No hay sesiones creadas</p>';
  } else {
    sesiones.forEach(sesion => {
      const fechaFormateada = new Date(sesion.fecha).toLocaleDateString();
      
      listaSesiones.innerHTML += `
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
          <h4>${sesion.titulo}</h4>
          <p>${sesion.descripcion}</p>
          <p><strong>Fecha:</strong> ${fechaFormateada} a las ${sesion.hora}</p>
          <p><strong>Link:</strong> <a href="${sesion.link}" target="_blank">${sesion.link}</a></p>
          <p><strong>Inscritos:</strong> ${sesion.estudiantesInscritos.length} estudiante(s)</p>
          <button onclick="eliminarSesion('${sesion._id}')">Eliminar Sesión</button>
        </div>
      `;
    });
  }
}

async function eliminarSesion(sesionId) {
  await fetch(`/api/sesiones/${sesionId}`, { method: 'DELETE' });
  alert('Sesión eliminada');
  cargarSesiones();
}

// Cargar sesiones al inicio
cargarSesiones();