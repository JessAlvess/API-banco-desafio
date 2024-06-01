const express = require("express");
const rotas = express();
rotas.use(express.json());

const {
  validarSenha,
  validarCampos,
  validarCpf,
  validarEmail,
  validarUsuario,
  validarSaldo,
} = require("./middlewares/validacaoContas");
const {
  listarContas,
  criarConta,
  atualizarConta,
  excluirConta,
} = require("./controladores/contasCubosBank");

const {
  validarCamposDeposito,
  validarDeposito,
  validarCamposSaque,
  validarCamposTransferencia,
  validarCamposSaldoEExtrato,
} = require("./middlewares/validacaoTransacoes");

const {
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
} = require("./controladores/transacoesConta");

rotas.get("/contas", validarSenha, listarContas);
rotas.post("/contas", validarCampos, validarCpf, validarEmail, criarConta);
rotas.put(
  "/contas/:numeroConta/usuario",
  validarCampos,
  validarUsuario,
  validarCpf,
  validarEmail,
  atualizarConta
);
rotas.delete(
  "/contas/:numeroConta",
  validarUsuario,
  validarSaldo,
  excluirConta
);

rotas.post(
  "/transacoes/depositar",
  validarCamposDeposito,
  validarUsuario,
  validarDeposito,
  depositar
);
rotas.post(
  "/transacoes/sacar",
  validarCamposSaque,
  validarUsuario,
  validarSenha,
  validarSaldo,
  sacar
);
rotas.post(
  "/transacoes/transferir",
  validarCamposTransferencia,
  validarUsuario,
  validarSenha,
  validarSaldo,
  transferir
);
rotas.get(
  "/contas/saldo",
  validarCamposSaldoEExtrato,
  validarUsuario,
  validarSenha,
  saldo
);
rotas.get(
  "/contas/extrato",
  validarCamposSaldoEExtrato,
  validarUsuario,
  validarSenha,
  extrato
);

module.exports = rotas;
