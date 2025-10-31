// incidents

// ======= FUNCIONES DE UTILIDAD =======
function obtenerIncidentes() {
  return JSON.parse(localStorage.getItem('incidentes')) || [];
}

function guardarIncidentes(incidentes) {
  localStorage.setItem('incidentes', JSON.stringify(incidentes));
}

function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem('usuarioActivo')) || null;
}

// ======= LISTAR INCIDENTES =======
if (document.getElementById('tablaIncidentes')) {
  const tabla = document.getElementById('tablaIncidentes');
  const incidentes = obtenerIncidentes();

  if (incidentes.length > 0) {
    tabla.innerHTML = '';
    incidentes.forEach((i, idx) => {
      const fila = document.createElement('tr');
      const descripcionCorta = i.descripcion.length > 60 
        ? i.descripcion.substring(0, 60) + '…'
        : i.descripcion;

      fila.innerHTML = `
        <td>${idx + 1}</td>
        <td>${i.titulo}</td>
        <td>${descripcionCorta}</td>
        <td>${i.puesto}</td>
        <td>${new Date(i.fecha).toLocaleString()}</td>
        <td>${i.creadoPor ? i.creadoPor : '—'}</td>
        <td>
          <a href="guard_create_incident.html?id=${i.id}" class="btn btn-outline-light btn-sm me-1">Editar</a>
          <button class="btn btn-danger btn-sm" data-id="${i.id}">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  tabla.addEventListener('click', e => {
    if (e.target.matches('button[data-id]')) {
      const id = e.target.getAttribute('data-id');
      let incidentes = obtenerIncidentes();
      incidentes = incidentes.filter(i => i.id !== id);
      guardarIncidentes(incidentes);
      location.reload();
    }
  });
}

// ======= CREAR / EDITAR INCIDENTE =======
if (document.getElementById('formIncidente')) {
  const form = document.getElementById('formIncidente');
  const params = new URLSearchParams(window.location.search);
  const idEditar = params.get('id');
  let incidentes = obtenerIncidentes();

  // Si es edición
  if (idEditar) {
    const incidente = incidentes.find(i => i.id === idEditar);
    if (incidente) {
      document.getElementById('tituloForm').textContent = 'Editar Incidente';
      document.getElementById('incidenteId').value = incidente.id;
      document.getElementById('titulo').value = incidente.titulo;
      document.getElementById('descripcion').value = incidente.descripcion;
      document.getElementById('puesto').value = incidente.puesto;
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('incidenteId').value;
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const puesto = document.getElementById('puesto').value.trim();

    if (!titulo || !descripcion || !puesto) return alert('Completa todos los campos.');

    const usuario = obtenerUsuarioActivo();
    const creadoPor = usuario ? usuario.nombre : 'Desconocido';

    if (id) {
      // Editar
    incidentes = incidentes.map(i =>
        i.id === id
        ? { ...i, titulo, descripcion, puesto, fecha: new Date().toISOString(), creadoPor }: i
      );
    } else {
      // Crear
      incidentes.push({
        id: crypto.randomUUID(),
        titulo,
        descripcion,
        puesto,
        fecha: new Date().toISOString(),
        creadoPor
      });
    }

    guardarIncidentes(incidentes);
    window.location.href = 'guard_list_incidents.html';
  });
}
