const usuario = JSON.parse(localStorage.getItem('usuario'));
const expira = localStorage.getItem('expira');

if (!usuario) {
    window.location.href = 'login.html'; // ninguém logado
} else if (!expira || Date.now() > Number(expira)) {
    alert('Sua sessão expirou. Faça login novamente.');
    logout();
}
setInterval(() => { // confere a cada 30 s
    if (Date.now() > Number(localStorage.getItem('expira'))) {
        alert('Sua sessão expirou. Faça login novamente.');
        logout();
    }
}, 30000);
function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('expira');
    window.location.href = 'login.html';
}
function voltar() {
    window.location.href = 'principal.html';
}
