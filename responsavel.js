listar(); // carrega a tabela assim que a página abre
async function listar() {
  montarTabela(await buscarJson("/responsavel"));
}
function montarTabela(lista) {
  document.getElementById("tabela").innerHTML = lista
    .map(
      (item) => `
 <tr>
 <td>${item.id}</td>
 <td>${item.nome}</td>
 <td>${item.email}</td>
 <td>
 <button onclick="editar(${item.id})">Editar</button>
 <button onclick="excluir(${item.id})">Excluir</button>
 </td>
 </tr>
 `,
    )
    .join("");
}

function lerCampos() {
  return {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
  };
}

const MENSAGENS = {
  nome: "Informe o nome.",
  cpf: "Informe o CPF.",
  email: "Informe o e-mail.",
  telefone: "Informe o telefone.",
};
function camposValidos(dados) {
  for (const campo in MENSAGENS) {
    if (dados[campo] == "") {
      alert(MENSAGENS[campo]);
      return false;
    }
  }
  return true;
}

async function cadastrar() {
  const dados = lerCampos();
  if (!camposValidos(dados)) return;
  if (await enviar("/responsavel", "POST", dados)) {
    limparCampos();
    listar();
  }
}
function limparCampos() {
  ["nome", "cpf", "email", "telefone"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}

async function pesquisar() {
  const termo = document.getElementById("busca").value;
  if (termo == "") {
    listar();
    return;
  }
  const lista = await buscarJson(`/clientes/busca/${termo}`);
  if (lista.length == 0) alert("Nenhum registro encontrado.");
  montarTabela(lista);
}

async function editar(id) {
  const atual = await buscarJson(`/responsavel/${id}`); // dados atuais
  const nome = prompt("Nome", atual.nome);
  if (nome == null) return; // clicou em Cancelar
  const email = prompt("E-mail", atual.email);
  if (email == null) return;
  const cpf = prompt("CPF", atual.cpf);
  if (email == null) return;
  const telefone = prompt("Telefone", atual.telefone);
  if (email == null) return;
  await enviar(`/responsavel/${id}`, "PUT", { nome, email, cpf, telefone });
  listar();
}

async function excluir(id) {
  if (!confirm("Deseja excluir este registro?")) return;
  await enviar(`/responsavel/${id}`, "DELETE");
  listar();
}