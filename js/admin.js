// admin
document.addEventListener('DOMContentLoaded', () => {
try {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const countEl = document.getElementById('countUsers');
    if (countEl) countEl.textContent = usuarios.length;
} catch (e) {
    console.error('Error leyendo usuarios desde localStorage', e);}
});
