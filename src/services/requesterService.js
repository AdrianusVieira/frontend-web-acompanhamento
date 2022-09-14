import api from "./api";

export const pegarTotalGeral = () => api.get("/total_geral");

export const criarCarteira = (carteira) => api.post("/carteira", carteira);

export const criarInvestimento = (investimento) => api.post("/investimento", investimento);

export const pegarCarteiras = () => api.get("/carteira");
export const pegarInvestimentos = () => api.get("/investimento");

export const criarMovimentacao = (movimentacao) =>
  api.post("/movimentacao", movimentacao);

export const pegarMovimentacaosByCarteira = (id) =>
  api.get(`/movimentacaocarteira/${id}`);

export const pegarCarteiraById = (id) => api.get(`/carteira/${id}`);

export const atualizarCarteira = (id, carteira) =>
  api.put(`/carteira/${id}`, carteira);

export const atualizarTotal = (id, total) =>
  api.put(`/total_geral/${id}`, total);

export const criarFundo = (fundo) => api.post("/fundo", fundo);

export const pegarFundos = () => api.get(`/fundo`);

export const pegarFundoById = (id) => api.get(`/fundo/${id}`);

export const pegarFundoByNome = (nome) => api.get(`/fundonome/${nome}`);

export const atualizarFundo = (id, fundo) => api.put(`/fundo/${id}`, fundo);

export const pegarMovimentacaosByTipo = (tipo) =>
  api.get(`/movimentacaotipo/${tipo}`);

export const pegarMovimentacaosByFundo = (id) =>
  api.get(`/movimentacaofundo/${id}`);

export const deletarMovimentacao = (id) => api.delete(`/movimentacao/${id}`)

export const atualizarInvestimento = (id, investimento) => api.put(`/investimento/${id}`, investimento);

export const pegarInvestimentoById = (id) => api.get(`/investimento/${id}`);

export const pegarMovimentacaosByInvestimento = (id) =>
  api.get(`/movimentacaoinvestimento/${id}`);