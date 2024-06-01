const bancoDeDados = require("../bancodedados");

async function validarSenha(req, res, next) {
  try {
    let { senha_banco } = await req.query;
    let { numero_conta, senha, numero_conta_origem } = await req.body;
    let query = await req.query

    let metodoAlternativo = false;

    if (senha !== undefined) {
      senha_banco = senha;
      metodoAlternativo = true;
    }

    if (numero_conta_origem !== undefined) {
      numero_conta = numero_conta_origem;
      metodoAlternativo = true;
    }

    if (query.senha !== undefined) {
      senha_banco = query.senha
      numero_conta = query.numero_conta
      metodoAlternativo = true;
    }

    if (!senha_banco) {
      return res.status(400).json({
        mensagem: "O usuário não digitou a senha!",
      });
    }

    if (!metodoAlternativo) {
      senha_banco === "Cubos123Bank"
        ? next()
        : res.status(401).json({
            mensagem: "A senha do banco informada é inválida!",
          });
    }

    if (metodoAlternativo) {
      const usuario = await encontrarUsuario(numero_conta, true);

      senha_banco === usuario[0].usuario.senha
        ? next()
        : res.status(401).json({
            mensagem: "A senha do banco informada é inválida!",
          });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar a senha!",
    });
  }
}

async function validarCampos(req, res, next) {
  try {
    const { nome, cpf, data_nascimento, telefone, email, senha } =
      await req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o nome!",
      });
    }

    if (!cpf) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o CPF!",
      });
    }

    if (!data_nascimento) {
      return res.status(400).json({
        mensagem: "O usuário não digitou a data de nascimento!",
      });
    }

    if (!telefone) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o telefone!",
      });
    }

    if (!email) {
      return res.status(400).json({
        mensagem: "O usuário não digitou o email!",
      });
    }

    if (!senha) {
      return res.status(400).json({
        mensagem: "O usuário não digitou a senha!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar os campos!",
    });
  }
}

async function validarCpf(req, res, next) {
  try {
    let { cpf } = await req.body;

    cpf = String(cpf);

    const contaEncontradaNoBd = await bancoDeDados.contas.filter((conta) => {
      return conta.usuario.cpf === cpf;
    });

    if (contaEncontradaNoBd.length !== 0) {
      return res.status(400).json({
        mensagem: "Já existe uma conta com o cpf informado!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "erro ao validar cpf!",
    });
  }
}

async function validarEmail(req, res, next) {
  try {
    let { email } = await req.body;

    email = String(email);

    const usuario = await encontrarUsuario(email, false);

    if (usuario.length !== 0) {
      return res.status(400).json({
        mensagem: "Já existe uma conta com o email informado!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "erro ao validar email",
    });
  }
}

async function validarUsuario(req, res, next) {
  try {
    let { numeroConta } = await req.params;
    let { numero_conta, numero_conta_origem, numero_conta_destino } =
      await req.body;
    let query = await req.query;

    if (numero_conta !== undefined) {
      numeroConta = numero_conta;
    }

    if (query.numero_conta !== undefined) {
      numeroConta = query.numero_conta
    }

    if (
      numero_conta_origem !== undefined &&
      numero_conta_destino !== undefined
    ) {
      const usuario = await encontrarUsuario(numero_conta_origem, true);

      const usuario2 = await encontrarUsuario(numero_conta_destino, true);

      if (usuario.length === 0) {
        return res.status(400).json({
          mensagem: "A conta de origem não existe!",
        });
      }

      if (usuario2.length === 0) {
        return res.status(400).json({
          mensagem: "A conta de destino não existe!",
        });
      }

      return next();
    }

    const usuario = await encontrarUsuario(numeroConta, true);

    if (usuario.length === 0) {
      return res.status(400).json({
        mensagem: "Não existe usuário com este número de conta!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar usuario",
    });
  }
}

async function encontrarUsuario(referencia, numero) {
  let usuarioEncontradoNoBd;

  if (numero) {
    usuarioEncontradoNoBd = bancoDeDados.contas.filter((conta) => {
      return conta.numero === referencia;
    });
  } else {
    usuarioEncontradoNoBd = bancoDeDados.contas.filter((conta) => {
      return conta.usuario.email === referencia;
    });
  }

  return usuarioEncontradoNoBd;
}

async function validarSaldo(req, res, next) {
  try {
    let { numeroConta } = await req.params;
    let { numero_conta, valor, numero_conta_origem } = await req.body;
    let metodoAlternativo = false;
    if (numero_conta !== undefined) {
      numeroConta = numero_conta;
      metodoAlternativo = true;
    }
    if (numero_conta_origem !== undefined) {
      numeroConta = numero_conta_origem;
      metodoAlternativo = true;
    }

    const usuario = await encontrarUsuario(numeroConta, true);

    if (usuario[0].saldo !== 0 && !metodoAlternativo) {
      return res.status(400).json({
        mensagem: "Usuário tem saldo em conta!",
      });
    }
    if (usuario[0].saldo < valor && metodoAlternativo) {
      return res.status(401).json({
        mensagem: "Usuário não tem saldo suficiente para esta operação!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao validar o saldo da conta!",
    });
  }
}

module.exports = {
  validarSenha,
  validarCampos,
  validarCpf,
  validarEmail,
  validarUsuario,
  validarSaldo,
  encontrarUsuario
};
