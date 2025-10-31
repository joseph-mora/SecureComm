// ===================== UTILIDADES =====================
function obtenerIncidentes() {
  return JSON.parse(localStorage.getItem('incidentes')) || [];
}

function guardarIncidentes(incidentes) {
  localStorage.setItem('incidentes', JSON.stringify(incidentes));
}

function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem('usuarioActivo')) || null;
}

// ===================== CREAR / EDITAR INCIDENTE =====================
const form = document.getElementById('formIncidente');
if (form) {
  console.log("✅ Formulario de incidente detectado");

  const params = new URLSearchParams(window.location.search);
  const idEditar = params.get('id');
  let incidentes = obtenerIncidentes();

  // Si está editando
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

  // Evento submit del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();

    const id = document.getElementById('incidenteId').value;
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const puesto = document.getElementById('puesto').value.trim();

    if (!titulo || !descripcion || !puesto) {
      alert('Completa todos los campos.');
      return;
    }

    const usuario = obtenerUsuarioActivo();
    const creadoPor = usuario
      ? { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }
      : { id: "000000", nombre: "Desconocido", correo: "" };

    if (id) {
      // Editar incidente existente
      incidentes = incidentes.map(i =>
        i.id === id
          ? { ...i, titulo, descripcion, puesto, fecha: new Date().toISOString(), creadoPor }
          : i
      );
    } else {
      // Crear nuevo incidente
      let ultimoId = parseInt(localStorage.getItem('ultimoIncidenteId')) || 0;
      ultimoId++;
      localStorage.setItem('ultimoIncidenteId', ultimoId);
      const nuevoId = ultimoId.toString().padStart(6, '0');

      incidentes.push({
        id: nuevoId,
        titulo,
        descripcion,
        puesto,
        fecha: new Date().toISOString(),
        creadoPor
      });
    }

    guardarIncidentes(incidentes);
    alert('✅ Incidente guardado correctamente');
    window.location.href = 'guard_list_incidents.html';
  });
}

// ===================== LISTAR INCIDENTES =====================
const tabla = document.getElementById('tablaIncidentes');
if (tabla) {
  console.log("✅ Tabla de incidentes detectada");

  const incidentes = obtenerIncidentes();
  const usuario = obtenerUsuarioActivo();

  // Filtrar solo los incidentes creados por el usuario activo
  const incidentesFiltrados = usuario
    ? incidentes.filter(i => i.creadoPor && i.creadoPor.id === usuario.id)
    : [];

  tabla.innerHTML = "";

  if (incidentesFiltrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary">No hay incidentes registrados</td>
      </tr>
    `;
  } else {
    incidentesFiltrados.forEach((i, idx) => {
      const fecha = new Date(i.fecha).toLocaleString("es-CO");
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${idx + 1}</td>
        <td>${i.titulo}</td>
        <td>${i.descripcion}</td>
        <td>${i.puesto}</td>
        <td>${fecha}</td>
        <td>${i.creadoPor?.nombre || 'Desconocido'}</td>
        <td>
          <a href="guard_create_incident.html?id=${i.id}" class="btn btn-outline-light btn-sm me-1">Editar</a>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }
}
