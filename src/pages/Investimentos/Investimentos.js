import React, { useState, useEffect } from "react";
import {
  Body,
  ComponentesSuperiores,
  ContainerCardInvestimento,
  ContainerComponenteSuperior,
  ValorTotal,
  ContainerDescricaoTipoIvestimento,
  TotalIvestimento,
  DescricaoIvestimento,
  ContainerQuantidadeTotalIvestimento,
  ContainerTipoDataHora,
  ContainerBotoesInvestimento,
  ContainerExibirMovimentacoes,
} from "./Style";
import Input from "../../styles/Input/Input";
import { Spin } from "antd";
import { toast } from "react-toastify";
import { AiOutlineCheckSquare } from "react-icons/ai";
import Botao from "../../styles/Botao";
import ModalCriarInvestimento from "../../components/ModalCriarInvestimento";
import ModalRelatorios from "../../components/ModalRelatorios/ModalRelatorios";
import ModalMovimentacoes from "../../components/ModalMovimentacoes";
import { Modal } from "antd";
import AddToast from "../../components/AddToast";
import Card from "../../styles/Card";
import { Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { sleep } from "../../utils/sleep";
import * as managerService from "../../services/managerService";
function Investimentos() {
  const [totalGeral, setTotalGeral] = useState("");
  const [alocacaoDisponivel, setAlocacaoDisponivel] = useState("");
  const [criarInvestimento, setCriarInvestimento] = useState(false);
  const [investimentos, setInvestimentos] = useState([]);
  const [dataMovimentacao, setDataMovimentacao] = useState();
  const [horaMovimentacao, setHoraMovimentacao] = useState();
  const [novaMovimentacao, setNovaMovimentacao] = useState({});
  const [modalRelatorios, setModalRelatorios] = useState(false);
  const [modalMovimentacoes, setModalMovimentacoes] = useState(false);
  const [id_investimento, setId_Investimento] = useState("");
  const { Option } = Select;
  const diaAtual = new Date();

  const [carregandoCriarMovimentacao, setCarregandoCriarMovimentacao] =
    useState(false);
  const antIconCriarMovimentacao = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );
  async function pegandoTotalGeral() {
    setTotalGeral("");
    const res = await managerService.pegandoTotal();
    const aux = JSON.stringify(res.valor);
    setTotalGeral(aux);
  }

  useEffect(() => {
    pegandoTotalGeral();
  }, []);

  async function calcularAlocacaoDisponivel() {
    const fundoInvestimento = await managerService.pegarFundoByNome(
      "Investimentos"
    );
    var res = fundoInvestimento.total;
    for (var a = 0; a < investimentos.length; a++) {
      if (investimentos[a].total_atribuido >= 0) {
        res = res - investimentos[a].total_atribuido;
      } else {
        toast.error("Existem Investimentos com Total Negativo!");
      }
    }
    setAlocacaoDisponivel(res);
  }
  useEffect(() => {
    calcularAlocacaoDisponivel();
  }, [investimentos]);

  async function pegarInvestimentos() {
    setInvestimentos([]);
    await managerService.pegarInvestimentos().then((res) => {
      setInvestimentos(res);
    });
  }

  useEffect(() => {
    pegarInvestimentos();
  }, []);

  function abrirCriacaoInvestimento() {
    setCriarInvestimento(true);
  }

  function fecharCriacaoInvestimento() {
    setCriarInvestimento(false);
    pegarInvestimentos();
  }

  function preencherNovaMovimentacao(e) {
    const { value, name } = e.target;
    if (name === "data") {
      setDataMovimentacao(value);
    } else if (name === "hora") {
      setHoraMovimentacao(value);
    } else {
      setNovaMovimentacao({ ...novaMovimentacao, [name]: value });
    }
  }
  function preencherTipoNovaMovimentacao(e) {
    setNovaMovimentacao({ ...novaMovimentacao, tipo: e });
  }
  async function criacaoMovimentacao(id) {
    setCarregandoCriarMovimentacao(true);
    var aux = novaMovimentacao;
    const dataHora = `${dataMovimentacao} ${horaMovimentacao}:00`;
    aux.data_hora = dataHora;
    aux.id_investimento = id;
    await managerService.criarMovimentacao(aux);
    operandoTotal(aux);
    await sleep(1500);
    pegarInvestimentos();

    pegandoTotalGeral();
    setNovaMovimentacao({});
    calcularAlocacaoDisponivel();
    setCarregandoCriarMovimentacao(false);
  }
  async function operandoTotal(movimentacao) {
    const tipo = movimentacao.tipo;
    const id_investimento = movimentacao.id_investimento;
    const investimento = await managerService.pegarInvestimentoById(
      id_investimento
    );
    if (tipo === "COMPRA") {
      const novoTotal = +investimento.total_atribuido + +movimentacao.valor;
      const novaQuantidade = +investimento.quantidade + 1;
      const novoInvestimento = {
        total_atribuido: novoTotal,
        quantidade: novaQuantidade,
      };
      await managerService.atualizarInvestimento(
        id_investimento,
        novoInvestimento
      );
    } else if (tipo === "VENDA") {
      const novoTotal = +investimento.total_atribuido - +movimentacao.valor;
      const novaQuantidade = +investimento.quantidade - 1;
      const novoInvestimento = {
        total_atribuido: novoTotal,
        quantidade: novaQuantidade,
      };
      await managerService.atualizarInvestimento(
        id_investimento,
        novoInvestimento
      );
    } else if (tipo === "CRESCIMENTO") {
      const novoTotalInvestimento =
        +investimento.total_atribuido + +movimentacao.valor;
      const novoInvestimento = {
        total_atribuido: novoTotalInvestimento,
      };
      await managerService.atualizarInvestimento(
        id_investimento,
        novoInvestimento
      );
      const fundoInvestimento = await managerService.pegarFundoByNome(
        "Investimentos"
      );
      const novoTotalFundoInvestimento =
        +fundoInvestimento.total + +movimentacao.valor;
      const novoFundo = {
        total: novoTotalFundoInvestimento,
      };
      await managerService.atualizarFundo(fundoInvestimento.id, novoFundo);
      const totalGeral = await managerService.pegandoTotal();
      const novoValorGeral = +totalGeral.valor + +movimentacao.valor;
      const novoTotalGeral = {
        valor: novoValorGeral,
      };
      await managerService.atualizarTotal(novoTotalGeral);
    } else if (tipo === "DECAIMENTO") {
      const novoTotalInvestimento =
        +investimento.total_atribuido - +movimentacao.valor;
      const novoInvestimento = {
        total_atribuido: novoTotalInvestimento,
      };
      await managerService.atualizarInvestimento(
        id_investimento,
        novoInvestimento
      );
      const fundoInvestimento = await managerService.pegarFundoByNome(
        "Investimentos"
      );
      const novoTotalFundoInvestimento =
        +fundoInvestimento.total - +movimentacao.valor;
      const novoFundo = {
        total: novoTotalFundoInvestimento,
      };
      await managerService.atualizarFundo(fundoInvestimento.id, novoFundo);
      const totalGeral = await managerService.pegandoTotal();
      const novoValorGeral = +totalGeral.valor - +movimentacao.valor;
      const novoTotalGeral = {
        valor: novoValorGeral,
      };
      await managerService.atualizarTotal(novoTotalGeral);
    } else if (tipo === "RENDIMENTO") {
      const fundoInvestimento = await managerService.pegarFundoByNome(
        "Investimentos"
      );
      const novoTotalFundoInvestimento =
        +fundoInvestimento.total + +movimentacao.valor;
      const novoFundo = {
        total: novoTotalFundoInvestimento,
      };
      await managerService.atualizarFundo(fundoInvestimento.id, novoFundo);
      const totalGeral = await managerService.pegandoTotal();
      const novoValorGeral = +totalGeral.valor + +movimentacao.valor;
      const novoTotalGeral = {
        valor: novoValorGeral,
      };
      await managerService.atualizarTotal(novoTotalGeral);
    }
  }

  function exibirModalRelatorios(id_investimento) {
    setId_Investimento(id_investimento);
    setModalRelatorios(true);
  }
  function fecharModalRelatorios() {
    setModalRelatorios(false);
  }

  const exibirModalMovimentacoes = (id_investimento) => {
    setId_Investimento(id_investimento);
    setModalMovimentacoes(true);
  };

  const fecharModalMovimentacoes = () => {
    setModalMovimentacoes(false);
  };

  async function fazerRelatorio(id_investimento) {
    const movimentacoes = await managerService.pegarMovimentacaosByInvestimento(
      id_investimento
    );
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

    const totalGeral =
      +totalCompra +
      +totalVenda +
      +totalCrescimento +
      +totalDecaimento +
      +totalRendimento;

    const aux = new Date();
    const RelatorioCompra = {
      id_investimento: id_investimento,
      data_hora: aux,
      descricao: "Relatorio Compra",
      valor: totalCompra,
      tipo: "RELATORIO",
    };
    const RelatorioVenda = {
      id_investimento: id_investimento,
      data_hora: aux,
      descricao: "Relatorio Venda",
      valor: totalVenda,
      tipo: "RELATORIO",
    };
    const RelatorioCrescimento = {
      id_investimento: id_investimento,
      data_hora: aux,
      descricao: "Relatorio Crescimento",
      valor: totalCrescimento,
      tipo: "RELATORIO",
    };
    const RelatorioDecaimento = {
      id_investimento: id_investimento,
      data_hora: aux,
      descricao: "Relatorio Decaimento",
      valor: totalDecaimento,
      tipo: "RELATORIO",
    };
    const RelatorioRendimento = {
      id_investimento: id_investimento,
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

    const RelatorioGeral = {
      id_investimento: id_investimento,
      data_hora: aux,
      descricao: "Total Liquido Corrente",
      valor: totalGeral,
      tipo: "RELATORIO",
    };

    await managerService.criarMovimentacao(RelatorioGeral);
  }
  useEffect(() => {
    if (diaAtual.getDate() === 1) {
      for (var a = 0; a < investimentos.length; a++) {
        fazerRelatorio(investimentos[a].id);
      }
    }
  }, [investimentos]);

  return (
    <Body>
      <ComponentesSuperiores>
        <ContainerComponenteSuperior>
          <ValorTotal>Total = R$ {totalGeral}</ValorTotal>
          <ValorTotal>Alocação Disponível = R$ {alocacaoDisponivel}</ValorTotal>
        </ContainerComponenteSuperior>
        <Botao
          fontSize="20px"
          color="#05003D"
          borderColor="#05003D"
          width="40%"
          height="100%"
          onClick={() => {
            abrirCriacaoInvestimento();
          }}
        >
          Adicionar Investimento
        </Botao>
      </ComponentesSuperiores>
      {investimentos?.map((investimento) => (
        <ContainerCardInvestimento key={investimento.id}>
          <Card title={investimento.nome} bordered={true}>
            <ContainerCardInvestimento>
              <ContainerDescricaoTipoIvestimento>
                <DescricaoIvestimento>
                  {investimento.descricao}
                </DescricaoIvestimento>
                <DescricaoIvestimento>{investimento.tipo}</DescricaoIvestimento>
              </ContainerDescricaoTipoIvestimento>
              <ContainerQuantidadeTotalIvestimento>
                <TotalIvestimento>
                  Quantidade: {investimento.quantidade}
                </TotalIvestimento>
                <TotalIvestimento>
                  R${investimento.total_atribuido}
                </TotalIvestimento>
              </ContainerQuantidadeTotalIvestimento>
              <ContainerTipoDataHora>
                <Select
                  name="tipo"
                  defaultValue="Selecione o Tipo"
                  style={{
                    width: "30%",
                    marginTop: "15px",
                    borderColor: "#05003D",
                  }}
                  onChange={preencherTipoNovaMovimentacao}
                >
                  <Option value="COMPRA">Compra</Option>
                  <Option value="VENDA">Venda</Option>
                  <Option value="CRESCIMENTO">Crescimento</Option>
                  <Option value="DECAIMENTO">Decaimento</Option>
                  <Option value="RENDIMENTO">Rendimento</Option>
                </Select>

                <Input
                  name="data"
                  width="30%"
                  type="date"
                  marginTop="15px"
                  onChange={preencherNovaMovimentacao}
                ></Input>
                <Input
                  name="hora"
                  width="30%"
                  type="time"
                  marginTop="15px"
                  onChange={preencherNovaMovimentacao}
                ></Input>
              </ContainerTipoDataHora>
              <ContainerBotoesInvestimento>
                <Input
                  name="valor"
                  width="20%"
                  marginTop="15px"
                  onChange={preencherNovaMovimentacao}
                  placeholder="Valor"
                ></Input>
                <Input
                  name="descricao"
                  width="50%"
                  marginTop="15px"
                  onChange={preencherNovaMovimentacao}
                  placeholder="Descrição"
                ></Input>
                <Botao
                  fontSize="25px"
                  marginTop="12px"
                  color="#05003D"
                  onClick={() => criacaoMovimentacao(investimento.id)}
                >
                  {carregandoCriarMovimentacao ? (
                    <Spin indicator={antIconCriarMovimentacao} />
                  ) : (
                    <AiOutlineCheckSquare />
                  )}
                </Botao>
              </ContainerBotoesInvestimento>
              <ContainerExibirMovimentacoes>
                <Botao
                  color="#05003D"
                  borderColor="#05003D"
                  onClick={() => {
                    exibirModalRelatorios(investimento.id);
                  }}
                >
                  Exibir Relatórios
                </Botao>
                <Botao
                  color="#05003D"
                  borderColor="#05003D"
                  onClick={() => {
                    exibirModalMovimentacoes(investimento.id);
                  }}
                >
                  Exibir Movimentações
                </Botao>
              </ContainerExibirMovimentacoes>
            </ContainerCardInvestimento>
          </Card>
        </ContainerCardInvestimento>
      ))}
      <>
        <Modal
          visible={criarInvestimento}
          onOk={fecharCriacaoInvestimento}
          onCancel={fecharCriacaoInvestimento}
        >
          <ModalCriarInvestimento
            fecharModal={() => fecharCriacaoInvestimento()}
          />
        </Modal>
      </>
      <>
        <Modal
          visible={modalRelatorios}
          onOk={fecharModalRelatorios}
          onCancel={fecharModalRelatorios}
          width={1400}
        >
          <ModalRelatorios
            id_investimento={id_investimento}
            fecharModal={() => fecharModalRelatorios()}
          />
        </Modal>
      </>
      <>
        <Modal
          visible={modalMovimentacoes}
          onOk={fecharModalMovimentacoes}
          onCancel={fecharModalMovimentacoes}
        >
          <ModalMovimentacoes
            id_investimento={id_investimento}
            fecharModal={() => fecharModalMovimentacoes}
          />
        </Modal>
      </>
      <AddToast />
    </Body>
  );
}

export default Investimentos;
