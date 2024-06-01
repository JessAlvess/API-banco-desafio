const bancoDeDados = require("../bancodedados");
const datefns = require("date-fns");
const { encontrarUsuario } = require("../middlewares/validacaoContas");

async function retornarIndexDoUsuario(numeroDaConta) {
  return bancoDeDados.contas.findIndex((conta) => {
    return conta.numero === String(numeroDaConta);
  });
}

async function depositar(req, res) {
  try {
    let { numero_conta, valor, numero_conta_destino } = await req.body;

    if (numero_conta_destino !== undefined) {
      numero_conta = numero_conta_destino;
    }

    const indexDoUsuario = await retornarIndexDoUsuario(numero_conta);

    bancoDeDados.contas[indexDoUsuario].saldo += valor;

    if (numero_conta_destino === undefined) {
      await registrarDeposito(numero_conta, valor);
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao depositar!",
    });
  }
}

async function registrarDeposito(numeroConta, valor) {
  try {
    const deposito = await criarRegistro(numeroConta, valor, 1);

    bancoDeDados.depositos.push(deposito);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao registrar o depósito!",
    });
  }
}

async function registrarSaque(numeroConta, valor) {
  try {
    const saque = await criarRegistro(numeroConta, valor, 1);

    bancoDeDados.saques.push(saque);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao registrar o depósito!",
    });
  }
}

async function registrarTransferencia(contaOrigem, contaDestino, valor) {
  try {
    const transferencia = await criarRegistro(
      contaOrigem,
      valor,
      2,
      contaDestino
    );

    bancoDeDados.transferencias.push(transferencia);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao registrar o depósito!",
    });
  }
}

async function criarRegistro(numeroDaConta, valor, metodo, contaDestino) {
  const dataRegistro = datefns.format(new Date(), "yyyy-MM-dd hh:mm:SS");
  let registro;

  if (metodo === 1) {
    registro = {
      data: dataRegistro,
      numero_conta: numeroDaConta,
      valor: valor,
    };
  }
  if (metodo === 2) {
    registro = {
      data: dataRegistro,
      numero_conta_origem: numeroDaConta,
      numero_conta_destino: contaDestino,
      valor: valor,
    };
  }

  return registro;
}

async function sacar(req, res) {
  try {
    let { numero_conta, valor, numero_conta_origem } = await req.body;

    if (numero_conta_origem !== undefined) {
      numero_conta = numero_conta_origem;
    }

    const indexDoUsuario = await retornarIndexDoUsuario(numero_conta);

    bancoDeDados.contas[indexDoUsuario].saldo -= valor;

    if (numero_conta_origem === undefined) {
      await registrarSaque(numero_conta, valor);
    }

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao sacar, favor dirija-se à sua agência!",
    });
  }
}

async function transferir(req, res) {
  try {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;
    sacar(req, res);
    depositar(req, res);
    registrarTransferencia(numero_conta_origem, numero_conta_destino, valor);
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao transferir, favor dirija-se à sua agência!",
    });
  }
}

async function saldo(req, res) {
  try {
    const { numero_conta } = await req.query;

    const usuario = await encontrarUsuario(numero_conta, true);

    const saldo = {
      saldo: usuario[0].saldo,
    };

    return res.status(200).json(saldo);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao vizualizar o saldo, favor dirija-se à sua agência!",
    });
  }
}

async function extrato(req, res) {
  try {
    const { numero_conta } = await req.query;

    const extrato = {
      depositos: bancoDeDados.depositos.filter((depositos) => {
        return depositos.numero_conta === numero_conta;
      }),
      saques: bancoDeDados.saques.filter((saques) => {
        return saques.numero_conta === numero_conta;
      }),
      transferenciasEnviadas: bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
      }),
      transferenciasRecebidas: bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
      })
    };

    return res.status(200).json(extrato);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao vizualizar o extrato, favor dirija-se à sua agência!",
    });
  }
}

module.exports = {
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
  retornarIndexDoUsuario,
};
