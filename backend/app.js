const express = require('express');
const cors = require('cors');
const connection = require('./db');
const server = express();

server.use(cors());
server.use(express.json());

const CHAVE = 'chave123'; // a mesma usada no AES_ENCRYPT do script SQL

// LOGIN
server.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const sql = 'SELECT id, nome, login FROM usuarios WHERE login = ? AND senha = SHA2(?,256)';
    connection.query(sql, [login, senha], (erro, resultados) => {
        if (erro) return res.status(500).json({ sucesso: false, mensagem: erro.message });
        if (resultados.length == 0) {
            return res.json({ sucesso: false, mensagem: 'Login ou senha inválidos.' });
        }
        res.json({ sucesso: true, usuario: resultados[0] });
    });
});
// (nas etapas 6, 7 e 8 novas rotas entram AQUI)
// SERVIDOR
const PORT = 3025;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
