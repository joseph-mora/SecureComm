// ======= Verificar sesión del guarda =======
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

if (!usuarioActivo || usuarioActivo.rol !== 'Guarda') {
  alert('Acceso denegado. Debes iniciar sesión como Guarda.');
  window.location.href = '../index.html';
}

// Mostrar nombre del guarda
document.getElementById('guardName').textContent = `Bienvenido, ${usuarioActivo.nombre}`;

// ======= Cerrar sesión =======
document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  window.location.href = '../index.html';
});
