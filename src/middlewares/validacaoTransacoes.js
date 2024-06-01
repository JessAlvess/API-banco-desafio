const bancoDeDados = require("../bancodedados");

async function validarCamposDeposito(req, res, next) {
  try {
    const { numero_conta, valor } = await req.body;

    if (!numero_conta) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o número da conta!",
      });
    }

    if (!valor) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o valor do depósito!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar os campos do depósito!",
    });
  }
}

async function validarDeposito(req, res, next) {
  try {
    const { valor } = await req.body;

    if (Number(valor) <= 0) {
      return res.status(400).json({
        mensagem:
          "Não foi possível realizar o depósito pois o valor é abaixo do permitido para esta operação!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar o depósito!",
    });
  }
}

async function validarCamposSaque(req, res, next) {
  try {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta) {
      return res.status(400).json({
        mensagem: "O número da conta deve ser informado para realizar o saque!",
      });
    }

    if (!valor) {
      return res.status(400).json({
        mensagem: "O valor deve ser informado para realizar o saque!",
      });
    }

    if (!senha) {
      return res.status(400).json({
        mensagem: "A senha deve ser informada para realizar o saque!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar o saque!",
    });
  }
}

async function validarCamposTransferencia(req, res, next) {
  try {
    const { numero_conta_origem, numero_conta_destino, valor, senha } =
      req.body;

    if (!numero_conta_origem) {
      return res.status(400).json({
        mensagem:
          "O número da conta de origem deve ser informada para realizar a operação!",
      });
    }

    if (!numero_conta_destino) {
      return res.status(400).json({
        mensagem:
          "O número da conta de destino deve ser informada para realizar a operação!",
      });
    }

    if (!valor) {
      return res.status(400).json({
        mensagem: "O valor deve ser informado para realizar a operação!",
      });
    }

    if (!senha) {
      return res.status(400).json({
        mensagem: "A senha deve ser informada para realizar a operação!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao transferir!",
    });
  }
}

async function validarCamposSaldoEExtrato(req, res, next) {
  try {
    const { numero_conta, senha } =
      req.query;

    if (!numero_conta) {
      return res.status(400).json({
        mensagem:
          "O número da conta deve ser informado para realizar a operação!",
      });
    }

    if (!senha) {
      return res.status(400).json({
        mensagem:
          "A senha deve ser informada para realizar a operação!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao vizualizar o saldo!",
    });
  }
}

module.exports = {
  validarCamposDeposito,
  validarDeposito,
  validarCamposSaque,
  validarCamposTransferencia,
  validarCamposSaldoEExtrato
};
