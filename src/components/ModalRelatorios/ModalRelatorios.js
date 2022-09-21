import React, { useState, useEffect } from "react";
import { Body, ContainerRelatorios } from "./Style";
import Botao from "../../styles/Botao";
import { Dropdown, Menu, Divider, List } from "antd";
import { toast } from "react-toastify";
import * as managerService from "../../services/managerService";
import { sleep } from "../../utils/sleep";

function ModalRelatorios(props) {
  const [gruposRelatorios, setGruposRelatorios] = useState([]);
  const diaAtual = new Date();
  async function criarRelatorio() {
    var movimentacoes = [];
    if (props.id_carteira) {
      movimentacoes = await managerService.pegarMovimentacaosByCarteira(
        props.id_carteira
      );
    } else if (props.id_fundo) {
      movimentacoes = await managerService.pegarMovimentacaosByFundo(
        props.id_fundo
      );
    } else if (props.id_investimento) {
      movimentacoes = await managerService.pegarMovimentacaosByInvestimento(
        props.id_investimento
      );
    }
    var descricoes = [];
    for (var b = 0; b < movimentacoes.length; b++) {
      const dataMovimentacao = new Date(movimentacoes[b].data_hora);
      const mesMovimentacao = dataMovimentacao.getMonth() + 1;
      const mesAtual = diaAtual.getMonth() + 1;
      const aux = mesAtual - 2;
      if (mesMovimentacao <= aux && movimentacoes[b].tipo !== "RELATORIO") {
        await managerService.deletarMovimentacao(movimentacoes[b].id);
      } else if (movimentacoes[b].tipo !== "RELATORIO") {
        if (!props.id_investimento) {
          var validate = true;
          for (var c = 0; c < descricoes.length; c++) {
            if (descricoes[c] === movimentacoes[b].descricao) {
              validate = false;
            }
          }
          if (validate === true) {
            descricoes.push(movimentacoes[b].descricao);
          }
        }
      }
    }
    movimentacoes = [];
    if (props.id_carteira) {
      movimentacoes = await managerService.pegarMovimentacaosByCarteira(
        props.id_carteira
      );
    } else if (props.id_fundo) {
      movimentacoes = await managerService.pegarMovimentacaosByFundo(
        props.id_fundo
      );
    } else if (props.id_investimento) {
      movimentacoes = await managerService.pegarMovimentacaosByInvestimento(
        props.id_investimento
      );
    }
    var totaisDescricoes = [];
    if (!props.id_investimento) {
      for (var d = 0; d < descricoes.length; d++) {
        var totalLiquido = 0;
        for (var e = 0; e < movimentacoes.length; e++) {
          if (movimentacoes[e].descricao === descricoes[d]) {
            if (movimentacoes[e].tipo === "ENTRADA") {
              totalLiquido = totalLiquido + movimentacoes[e].valor;
            } else if (movimentacoes[e].tipo === "SAIDA") {
              totalLiquido = totalLiquido - movimentacoes[e].valor;
            }
          }
        }
        totaisDescricoes.push({
          descricao: descricoes[d],
          totalLiquido: totalLiquido,
        });
      }
    }
    if (!props.id_investimento) {
      var totalMensal = 0;
      // eslint-disable-next-line no-loop-func
      totaisDescricoes.forEach((totalDescricao) => {
        totalMensal = totalMensal + totalDescricao.totalLiquido;
      });
    }

    if (props.id_carteira) {
      for (var i = 0; i < totaisDescricoes.length; i++) {
        const relatorio = {
          id_carteira: props.id_carteira,
          data_hora: new Date(),
          descricao: "Total " + totaisDescricoes[i].descricao,
          valor: totaisDescricoes[i].totalLiquido,
          tipo: "RELATORIO",
        };
        await managerService.criarMovimentacao(relatorio);
      }
      const aux = new Date();
      aux.setHours(aux.getHours() - 3);
      const relatorio = {
        id_carteira: props.id_carteira,
        data_hora: new Date(),
        descricao: "Total Liquido Corrente",
        valor: totalMensal,
        tipo: "RELATORIO",
      };
      await managerService.criarMovimentacao(relatorio);
    } else if (props.id_fundo) {
      for (var i = 0; i < totaisDescricoes.length; i++) {
        const aux = new Date();
        const relatorio = {
          id_fundo: props.id_fundo,
          data_hora: aux,
          descricao: "Total " + totaisDescricoes[i].descricao,
          valor: totaisDescricoes[i].totalLiquido,
          tipo: "RELATORIO",
        };
        await managerService.criarMovimentacao(relatorio);
      }
      const aux = new Date();
      const relatorio = {
        id_fundo: props.id_fundo,
        data_hora: aux,
        descricao: "Total Liquido Corrente",
        valor: totalMensal,
        tipo: "RELATORIO",
      };
      await managerService.criarMovimentacao(relatorio);
    } else if (props.id_investimento) {
      var totalCompra = 0;
      var totalVenda = 0;
      var totalCrescimento = 0;
      var totalDecaimento = 0;
      var totalRendimento = 0;

      movimentacoes?.forEach((movimentacao) => {
        if (movimentacao.tipo === "COMPRA") {
          totalCompra = +totalCompra + +movimentacao.valor;
        } else if (movimentacao.tipo === "VENDA") {
          totalVenda = +totalVenda + +movimentacao.valor;
        } else if (movimentacao.tipo === "CRESCIMENTO") {
          totalCrescimento = +totalCrescimento + +movimentacao.valor;
        } else if (movimentacao.tipo === "DECAIMENTO") {
          totalDecaimento = +totalDecaimento + +movimentacao.valor;
        } else if (movimentacao.tipo === "RENDIMENTO") {
          totalRendimento = +totalRendimento + +movimentacao.valor;
        }
      });

      const totalGeral = +totalCrescimento - +totalDecaimento;

      const aux = new Date();

      const RelatorioGeral = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Total Liquido Corrente",
        valor: totalGeral,
        tipo: "RELATORIO",
      };

      await managerService.criarMovimentacao(RelatorioGeral);
      const RelatorioCompra = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Relatorio Compra",
        valor: totalCompra,
        tipo: "RELATORIO",
      };
      const RelatorioVenda = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Relatorio Venda",
        valor: totalVenda,
        tipo: "RELATORIO",
      };
      const RelatorioCrescimento = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Relatorio Crescimento",
        valor: totalCrescimento,
        tipo: "RELATORIO",
      };
      const RelatorioDecaimento = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Relatorio Decaimento",
        valor: totalDecaimento,
        tipo: "RELATORIO",
      };
      const RelatorioRendimento = {
        id_investimento: props.id_investimento,
        data_hora: aux,
        descricao: "Relatorio Rendimento",
        valor: totalRendimento,
        tipo: "RELATORIO",
      };
      await managerService.criarMovimentacao(RelatorioCompra);
      await managerService.criarMovimentacao(RelatorioVenda);
      await managerService.criarMovimentacao(RelatorioCrescimento);
      await managerService.criarMovimentacao(RelatorioDecaimento);
      await managerService.criarMovimentacao(RelatorioRendimento);

      
    }
    toast.success("Relatorio gerado com sucesso!");
    setGruposRelatorios([]);
    pegarRelatorios();
  }

  const compararData = (a, b) => {
    var data1 = new Date(a.data_hora);
    var data2 = new Date(b.data_hora);

    if (data1 > data2) {
      return -1;
    } else {
      return 1;
    }
  };

  async function pegarRelatorios() {
    var movimentacoes = [];
    if (props.id_carteira) {
      movimentacoes = await managerService.pegarMovimentacaosByCarteira(
        props.id_carteira
      );
    } else if (props.id_fundo) {
      movimentacoes = await managerService.pegarMovimentacaosByFundo(
        props.id_fundo
      );
    } else if (props.id_investimento) {
      movimentacoes = await managerService.pegarMovimentacaosByInvestimento(
        props.id_investimento
      );
    }
    var relatoriosParciais = [];
    movimentacoes?.forEach((value) => {
      if (value.tipo === "RELATORIO") {
        relatoriosParciais.push(value);
      }
    });
    relatoriosParciais?.sort(compararData);
    const relatoriosFormatados = await formatarData(relatoriosParciais);

    setGruposRelatorios(relatoriosFormatados);
  }
  async function formatarData(relatorios) {
    const vetorRelatorios = [];
    relatorios?.forEach((relatorio) => {
      var auxiliar = new Date(relatorio.data_hora);
      const dataHora = auxiliar.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
      relatorio.dataFormatada = dataHora;
      vetorRelatorios.push(relatorio);
    });

    return vetorRelatorios;
  }
  useEffect(() => {
    pegarRelatorios();
  }, [props]);

  return (
    <Body>
      <Botao
        fontSize="20px"
        color="#05003D"
        borderColor="#05003D"
        width="80%"
        height="100%"
        onClick={() => {
          criarRelatorio();
        }}
      >
        Fazer Relatorio Corrente
      </Botao>
      <ContainerRelatorios>
        {gruposRelatorios?.map((value) => (
          <>
            <Divider key={value.id}>
              {value.dataFormatada}---{value.descricao}: {value.valor}
            </Divider>
          </>
        ))}
      </ContainerRelatorios>
    </Body>
  );
}

export default ModalRelatorios;
