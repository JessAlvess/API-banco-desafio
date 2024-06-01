const bancoDeDados = require("../bancodedados");
const { retornarIndexDoUsuario } = require('./transacoesConta')

function gerarNumeroDeConta() {
  return String(
    bancoDeDados.contas.length === 0
      ? 1
      : Number(bancoDeDados.contas[bancoDeDados.contas.length - 1].numero) + 1
  );
}

async function listarContas(req, res) {
  try {
    return res.status(200).json(bancoDeDados.contas);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar as contas!",
    });
  }
}

async function criarConta(req, res) {
  try {
    let conta = await req.body;

    conta = {
      numero: gerarNumeroDeConta(),
      saldo: 0,
      usuario: conta,
    };
    bancoDeDados.contas.push(conta);

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar a conta!",
    });
  }
}

async function atualizarConta(req, res) {
  try {
    const { numeroConta } = await req.params;
    const novoUsuario = await req.body;

    const indexDoUsuario = await retornarIndexDoUsuario(numeroConta);

    bancoDeDados.contas[indexDoUsuario].usuario =
      indexDoUsuario === -1
        ? res.status(404).json({ mensagem: "Usuário não encontrado." })
        : novoUsuario;

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar a conta!",
    });
  }
}

async function excluirConta(req, res) {
  try {
    const { numeroConta } = await req.params;

    const contas = bancoDeDados.contas.filter((conta) => {
      return conta.numero !== numeroConta;
    });

    bancoDeDados.contas = contas;

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir a conta.",
    });
  }
}

module.exports = {
  listarContas,
  criarConta,
  atualizarConta,
  excluirConta,
};
