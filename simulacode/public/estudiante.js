async function cargarRetos() {
  const response = await fetch('/api/retos');
  const retos = await response.json();
  
  const listaRetos = document.getElementById('listaRetos');
  listaRetos.innerHTML = '';
  
  retos.forEach(reto => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${reto.titulo}</h3>
      <p>${reto.descripcion}</p>
      <p>Repositorio: <a href="https://github.com/${reto.repositorio}" target="_blank">${reto.repositorio}</a></p>
      
      <form onsubmit="enviarSolucion(event, '${reto._id}')">
        <input type="text" id="prUrl-${reto._id}" placeholder="URL de tu Pull Request" required>
        <input type="number" id="prNumber-${reto._id}" placeholder="Número del PR" required>
        <button type="submit">Enviar Solución</button>
      </form>
      <hr>
    `;
    listaRetos.appendChild(div);
  });
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

cargarRetos();