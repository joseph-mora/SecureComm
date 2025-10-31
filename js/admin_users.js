// securecomm Usuarios

// ================== GENERAR ID NUMÉRICO SECUENCIAL ==================
function generarIdSecuencial() {
  // Obtener el último ID guardado
  let ultimoId = parseInt(localStorage.getItem('ultimoId')) || 0;

  // Incrementar en 1
  ultimoId++;

  // Guardar el nuevo valor en localStorage
  localStorage.setItem('ultimoId', ultimoId);

  // Retornar en formato 6 dígitos, ej: "000001"
  return ultimoId.toString().padStart(6, '0');
}


// ========== UTILIDAD: obtener y guardar usuarios ==========
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// ========== LISTA DE USUARIOS ==========
if (document.getElementById('tablaUsuarios')) {
  const tabla = document.getElementById('tablaUsuarios');
  const usuarios = obtenerUsuarios();

  if (usuarios.length > 0) {
    tabla.innerHTML = '';
    usuarios.forEach((u, i) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${u.cedula}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${u.cliente}</td>
        <td>${u.rol}</td>
        <td>
          <a href="admin_create_user.html?id=${u.id}" class="btn btn-outline-light btn-sm me-1">Editar</a>
          <button class="btn btn-danger btn-sm" data-id="${u.id}">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  // Eliminar usuario
  tabla.addEventListener('click', e => {
    if (e.target.matches('button[data-id]')) {
      const id = e.target.getAttribute('data-id');
      let usuarios = obtenerUsuarios();
      usuarios = usuarios.filter(u => u.id !== id);
      guardarUsuarios(usuarios);
      location.reload();
    }
  });
}

// ========== FORMULARIO CREAR / EDITAR ==========
if (document.getElementById('formUsuario')) {
  const form = document.getElementById('formUsuario');
  const params = new URLSearchParams(window.location.search);
  const idEditar = params.get('id');
  let usuarios = obtenerUsuarios();

  // Si es edición
  if (idEditar) {
    const usuario = usuarios.find(u => u.id === idEditar);
    if (usuario) {
      document.getElementById('tituloForm').textContent = 'Editar Usuario';
      document.getElementById('usuarioId').value = usuario.id;
      document.getElementById('cedula').value = usuario.cedula;
      document.getElementById('nombre').value = usuario.nombre;
      document.getElementById('correo').value = usuario.correo;
      document.getElementById('cliente').value = usuario.cliente;
      document.getElementById('rol').value = usuario.rol;
      document.getElementById('password').value = usuario.password;
    }
}

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('usuarioId').value;
    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const cliente = document.getElementById('cliente').value.trim();
    const rol = document.getElementById('rol').value;
    const password = document.getElementById('password').value.trim();

    if (!cedula || !nombre || !correo || !cliente || !rol || !password)
      return alert('Completa todos los campos.');

    if (id) {
      // Editar usuario existente
      usuarios = usuarios.map(u =>
        u.id === id ? { ...u, cedula, nombre, correo, cliente, rol, password } : u
      );
    } else {
      // Crear usuario nuevo
      usuarios.push({
        id: generarIdSecuencial(),
        cedula,
        nombre,
        correo,
        cliente,
        rol,
        password
      });
    }

    guardarUsuarios(usuarios);
    window.location.href = 'admin_list_users.html';
  });
}
