// securecomm login

// ================== GENERAR ID NUMÉRICO SECUENCIAL ==================
function generarIdSecuencial() {
  // Verificamos el contador actual en localStorage
let ultimoId = parseInt(localStorage.getItem('ultimoId')) || 0;

  // Incrementamos en 1
ultimoId++;

  // Guardamos el nuevo valor actualizado
localStorage.setItem('ultimoId', ultimoId);

  // Devolvemos el número con formato 6 dígitos (ejemplo: 000001)
return ultimoId.toString().padStart(6, '0');
}


// ================== USUARIO POR DEFECTO ==================
function inicializarUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Si no hay usuarios, se crea uno por defecto
    if (usuarios.length === 0) {
    const adminDefault = {
      id: generarIdSecuencial(),
      cedula: '123456789',
      nombre: 'Administrador General',
      correo: 'admin@securecomm.com',
      cliente: 'SecureComm',
      rol: 'Administrador',
      password: '12345'
    };

    usuarios.push(adminDefault);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log('Usuario administrador por defecto creado ✅');
  }
}

// Ejecutar al cargar el script
inicializarUsuarios();


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Obtener usuarios guardados en el localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar si existe el usuario con ese correo y contraseña
    const usuarioEncontrado = usuarios.find(
      u => u.correo === email && u.password === password
    );

    if (usuarioEncontrado) {
      // Guardar usuario activo
      localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

      // Redirigir según el rol
      if (usuarioEncontrado.rol === 'Administrador') {
        window.location.href = 'admin/admin_panel.html';
      } else if (usuarioEncontrado.rol === 'Guarda') {
        window.location.href = 'guard/guard_panel.html';
      } else {
        message.textContent = 'Rol desconocido. Contacte al administrador.';
        message.style.color = 'yellow';
      }
    } else {
      message.textContent = 'Correo o contraseña incorrectos.';
      message.style.color = 'red';
    }
  });
});
