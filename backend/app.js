const express = require("express");
const cors = require("cors");
const connection = require("./db");
const server = express();

server.use(cors());
server.use(express.json());

const CHAVE = "chave123"; // a mesma usada no AES_ENCRYPT do script SQL

// LOGIN
server.post("/login", (req, res) => {
  const { login, senha } = req.body;
  const sql =
    "SELECT id, nome, login FROM usuarios WHERE login = ? AND senha = SHA2(?,256)";
  connection.query(sql, [login, senha], (erro, resultados) => {
    if (erro)
      return res.status(500).json({ sucesso: false, mensagem: erro.message });
    if (resultados.length == 0) {
      return res.json({
        sucesso: false,
        mensagem: "Login ou senha inválidos.",
      });
    }
    res.json({ sucesso: true, usuario: resultados[0] });
  });
});
// (nas etapas 6, 7 e 8 novas rotas entram AQUI)

server.get("/responsavel", (req, res) => {
  const sql = "SELECT id, nome, email, telefone FROM responsavel ORDER BY nome";
  connection.query(sql, (erro, resultados) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json(resultados);
  });
});

server.get("/responsavel/busca/:termo", (req, res) => {
  const sql =
    "SELECT id, nome, email, telefone FROM responsavel WHERE nome LIKE ? ORDER BY nome";
  connection.query(sql, ["%" + req.params.termo + "%"], (erro, resultados) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json(resultados);
  });
});

server.get("/responsavel/:id", (req, res) => {
  const sql = `
 SELECT id, nome, CAST(AES_DECRYPT(cpf, ?) AS CHAR) AS cpf, email, telefone
 FROM responsavel WHERE id = ?
 `;
  connection.query(sql, [CHAVE, req.params.id], (erro, resultados) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json(resultados[0]);
  });
});

server.post("/responsavel", (req, res) => {
  const { nome, cpf, email, telefone } = req.body;
  const sql =
    "INSERT INTO responsavel (nome, cpf, email, telefone) VALUES (?, AES_ENCRYPT(?,?), ?, ?)";
  connection.query(
    sql,
    [nome, cpf, CHAVE, email, telefone],
    (erro, resultado) => {
      if (erro) {
        if (erro.code == "ER_DUP_ENTRY") {
          return res.status(400).json({ mensagem: "CPF já cadastrado." });
        }
        return res.status(500).json({ mensagem: erro.message });
      }
      res.json({
        mensagem: "Responsavel cadastrado com sucesso!",
        id: resultado.insertId,
      });
    },
  );
});

server.put("/responsavel/:id", (req, res) => {
  const { nome, cpf, email, telefone } = req.body;
  const sql = `
 UPDATE responsavel
 SET nome = ?, cpf = AES_ENCRYPT(?, ?), email = ?, telefone = ?
 WHERE id = ?
 `;
  connection.query(
    sql,
    [nome, cpf, CHAVE, email, telefone, req.params.id],
    (erro) => {
      if (erro) return res.status(500).json({ mensagem: erro.message });
      res.json({ mensagem: "Responsavel atualizado com sucesso." });
    },
  );
});

server.delete("/responsavel/:id", (req, res) => {
  connection.query(
    "DELETE FROM responsavel WHERE id = ?",
    [req.params.id],
    (erro) => {
      if (erro) {
        if (erro.code == "ER_ROW_IS_REFERENCED_2") {
          return res
            .status(400)
            .json({
              mensagem: "Responsavel possui filhos e não pode ser excluído.",
            });
        }
        return res.status(500).json({ mensagem: erro.message });
      }
      res.json({ mensagem: "Responsavel removido com sucesso." });
    },
  );
});

server.post('/filhos', (req, res) => {
 const { responsavel_id, nome, data_nascimento, nivel_natacao} = req.body;
 if (!cliente_id) {
 return res.status(400).json({ mensagem: 'O filho deve ser associado a um responsável.'
});
 }
 const sql = 'INSERT INTO aparelhos (responsavel_id, nome, data_nascimento, nivel_natacao) VALUES (?, ?,?, ?)';
 connection.query(sql, [responsavel_id, nome, data_nascimento, nivel_natacao], (erro, resultado) => {
 if (erro) return res.status(500).json({ mensagem: erro.message });
 res.json({ mensagem: 'Filho cadastrado com sucesso!', id: resultado.insertId });
 });
});




// SERVIDOR
const PORT = 3025;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
