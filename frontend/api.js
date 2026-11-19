const API = 'http://localhost:3025';

// GET: busca dados e devolve o JSON
async function buscarJson(caminho) {
    const resposta = await fetch(API + caminho);
    return resposta.json();
}

// POST / PUT / DELETE: envia dados e devolve { ok, dados }
async function enviarJson(caminho, metodo, dados) {
    const opcoes = { method: metodo };
    if (dados) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(API + caminho, opcoes);
    return { ok: resposta.ok, dados: await resposta.json() };
}

// igual ao enviarJson, mas já mostra a mensagem do servidor
async function enviar(caminho, metodo, dados) {
    const { ok, dados: json } = await enviarJson(caminho, metodo, dados);
    alert(json.mensagem);
    return ok;
}