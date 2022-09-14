import * as requesterService from "./requesterService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const pegandoTotal = async () => {
  const total = await requesterService.pegarTotalGeral();
  return total.data[0];
};

export const criarCarteira = async (carteira) => {
  const novaCarteira = await requesterService
    .criarCarteira(carteira)
    .then((res) => {
      toast.success("Carteira criada com sucesso!");
      return res;
    })
    .catch(() => toast.error("Falha ao criar a carteira!"));
  return novaCarteira;
};

export const criarInvestimento = async (investimento) => {
  const novoInvestimento = await requesterService
    .criarInvestimento(investimento)
    .then((res) => {
      toast.success("Investimento criado com sucesso!");
      return res;
    })
    .catch(() => toast.error("Falha ao criar o investimento!"));
  return novoInvestimento;
};

export const pegarCarteiras = async () => {
  const carteiras = await requesterService
    .pegarCarteiras()
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar as carteiras!";
    });

  return carteiras;
};

export const pegarInvestimentos = async () => {
  const investimentos = await requesterService
    .pegarInvestimentos()
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar os investimentos!";
    });

  return investimentos;
};

export const criarMovimentacao = async (movimentacao) => {
  const novaMovimentacao = await requesterService
    .criarMovimentacao(movimentacao)
    .then((res) => {
      toast.success("Movimentacao Criada com sucesso!")
      return res;
    })
    .catch(() => toast.error("Falha ao criar a movimentação!"));
  return novaMovimentacao;
};

export const pegarMovimentacaosByCarteira = async (id) => {
  const movimentacaos = await requesterService
    .pegarMovimentacaosByCarteira(id)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar as carteiras!";
    });

  return movimentacaos;
};

export const pegarCarteiraById = async (id) => {
  const carteira = await requesterService
    .pegarCarteiraById(id)
    .then((res) => {
      return res.data[0];
    })
    .catch(() => {
      return "Falha ao pegar a carteira!";
    });

  return carteira;
};
export const pegarInvestimentoById = async (id) => {
  const investimento = await requesterService
    .pegarInvestimentoById(id)
    .then((res) => {
      return res.data[0];
    })
    .catch(() => {
      return "Falha ao pegar o investimento!";
    });

  return investimento;
};
export const atualizarCarteira = async (id, novaCarteira) => {
  const carteira = await requesterService
    .atualizarCarteira(id, novaCarteira)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao atualizar a carteira!";
    });
  return carteira;
};

export const atualizarInvestimento = async (id, novoInvestimento) => {
  const investimento = await requesterService
    .atualizarInvestimento(id, novoInvestimento)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao atualizar o investimento!";
    });
  return investimento;
};

export const atualizarTotal = async (novoTotal) => {
  const id = "3a9285c6-fce1-4839-8d68-b74e2b994ba4";
  const total = await requesterService
    .atualizarTotal(id, novoTotal)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao atualizar o total!";
    });
  return total;
};

export const criarFundo = async (fundo) => {
  const novaCarteira = await requesterService
    .criarFundo(fundo)
    .then((res) => {
      toast.success("Fundo criada com sucesso!");
      return res;
    })
    .catch(() => toast.error("Falha ao criar a fundo!"));
  return novaCarteira;
};

export const pegarFundos = async () => {
  const carteiras = await requesterService
    .pegarFundos()
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      toast.error("Falha ao pegar os fundos!");
    });

  return carteiras;
};

export const pegarFundoById = async (id) => {
  const carteira = await requesterService
    .pegarFundoById(id)
    .then((res) => {
      return res.data[0];
    })
    .catch(() => {
      toast.error("Falha ao pegar o fundo!");
    });

  return carteira;
};

export const pegarFundoByNome = async (nome) => {
  const carteira = await requesterService
    .pegarFundoByNome(nome)
    .then((res) => {
      return res.data[0];
    })
    .catch(() => {
      toast.error("Falha ao pegar o fundo!");
    });

  return carteira;
};

export const atualizarFundo = async (id, novoFundo) => {
  const fundo = await requesterService
    .atualizarFundo(id, novoFundo)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      toast.error("Falha ao atualizar o fundo");
    });
  return fundo;
};

export const pegarMovimentacaosByFundo = async (id) => {
  const movimentacaos = await requesterService
    .pegarMovimentacaosByFundo(id)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar os fundos!";
    });

  return movimentacaos;
};

export const pegarMovimentacaosByInvestimento = async (id) => {
  const movimentacaos = await requesterService
    .pegarMovimentacaosByInvestimento(id)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar as movimentações!";
    });

  return movimentacaos;
};

export const pegarMovimentacaosByTipo = async (tipo) => {
  const movimentacaos = await requesterService
    .pegarMovimentacaosByTipo(tipo)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "Falha ao pegar os fundos!";
    });

  return movimentacaos;
};

export const deletarMovimentacao = async (id) => {
  const res = await requesterService
    .deletarMovimentacao(id)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return res;
};
