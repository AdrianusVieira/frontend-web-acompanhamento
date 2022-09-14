import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import AddToast from "../../components/AddToast";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Body,
  ComponentesSuperiores,
  ContainerComponenteSuperior,
  ValorTotal,
  ContainerCardFundo,
  TotalFundo,
  ContainerBotoesFundo,
  ContainerExibirMovimentacoes,
  ContainerTotalDescricaoFundo,
  DescricaoFundo,
  ContainerDataHora,
  ContainerCard,
} from "./Style";
import {
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
  AiOutlineCheckSquare,
} from "react-icons/ai";
import Botao from "../../styles/Botao";
import Input from "../../styles/Input/Input";
import Card from "../../styles/Card";
import { sleep } from "../../utils/sleep";
import ModalMovimentacoes from "../../components/ModalMovimentacoes";
import ModalRelatorios from "../../components/ModalRelatorios/ModalRelatorios";
import { toast } from "react-toastify";
import * as managerService from "../../services/managerService";
import ModalCriarFundo from "../../components/ModalCriarFundo/ModalCriarFundos";
function Fundos() {
  const [exibirModalCriarFundo, setExibirModalCriarFundo] = useState(false);
  const [totalGeral, setTotalGeral] = useState("");
  const [fundos, setFundos] = useState([]);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const antIconCriarRelatorio = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );
  const [carregandoCriarMovimentacao, setCarregandoCriarMovimentacao] =
    useState(false);
  const [novaMovimentacao, setNovaMovimentacao] = useState({});
  const [modalMovimentacoes, setModalMovimentacoes] = useState(false);
  const [id_fundo, setId_Fundo] = useState("");
  const [dataMovimentacao, setDataMovimentacao] = useState();
  const [horaMovimentacao, setHoraMovimentacao] = useState();
  const [selecionarDataHora, setSelecionarDataHora] = useState(false);
  const [modalRelatorios, setModalRelatorios] = useState(false);
  const diaAtual = new Date();

  async function pegandoTotalGeral() {
    const res = await managerService.pegandoTotal();
    const aux = JSON.stringify(res.valor);
    setTotalGeral(aux);
  }

  function exibirModalRelatorios(id_fundo) {
    setId_Fundo(id_fundo);
    setModalRelatorios(true);
  }
  function fecharModalRelatorios() {
    setModalRelatorios(false);
  }

  useEffect(() => {
    pegandoTotalGeral();
  }, []);

  async function pegandoFundos() {
    setFundos([]);
    const res = await managerService.pegarFundos();
    setFundos(res);
  }
  useEffect(() => {
    pegandoFundos();
  }, []);

  const exibirModalMovimentacoes = (id_fundo) => {
    setId_Fundo(id_fundo);
    setModalMovimentacoes(true);
  };

  const fecharModalMovimentacoes = () => {
    setModalMovimentacoes(false);
  };

  const antIconCriarMovimentacao = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );

  function abrirModalCriarFundo() {
    setExibirModalCriarFundo(true);
  }
  function fecharModalCriarFundo() {
    setExibirModalCriarFundo(false);
  }

  function preenchendoDadosMovimentacao(e) {
    const { value, name } = e.target;
    setNovaMovimentacao({ ...novaMovimentacao, [name]: value });
  }
  function setandoTipoMovimentacao(tipoMovimentacao, id) {
    if (dataMovimentacao && horaMovimentacao) {
      try {
        const dataHora = `${dataMovimentacao} ${horaMovimentacao}:00`;
        setNovaMovimentacao({
          ...novaMovimentacao,
          tipo: tipoMovimentacao,
          id_fundo: id,
          data_hora: dataHora,
        });
      } catch {
        alert("DataHora inválida.");
      }
    } else {
      const aux = new Date();
      aux.setHours(aux.getHours() - 3);
      setNovaMovimentacao({
        ...novaMovimentacao,
        tipo: tipoMovimentacao,
        id_fundo: id,
        data_hora: aux,
      });
    }
  }
  async function criacaoMovimentacao() {
    setCarregandoCriarMovimentacao(true);
    await operandoTotal(novaMovimentacao);
    await managerService.criarMovimentacao(novaMovimentacao);
    await sleep(1500);
    pegandoFundos();
    pegandoTotalGeral();
    setNovaMovimentacao({});
    setCarregandoCriarMovimentacao(false);
    setSelecionarDataHora(false);
  }

  async function operandoTotal(movimentacao) {
    const fundo = await managerService.pegarFundoById(movimentacao.id_fundo);
    const valor_total = +totalGeral;
    const aux = +movimentacao.valor;
    if (movimentacao.tipo === "ENTRADA") {
      const novoFundo = {
        total: fundo.total + aux,
        nome: fundo.nome,
      };
      const novoTotal = {
        valor: valor_total + aux,
      };
      await managerService.atualizarTotal(novoTotal);
      await managerService.atualizarFundo(fundo.id, novoFundo);
    } else if (movimentacao.tipo === "SAIDA") {
      const novoFundo = {
        total: fundo.total - aux,
        nome: fundo.nome,
      };
      const novoTotal = {
        valor: valor_total - aux,
      };
      await managerService.atualizarTotal(novoTotal);
      await managerService.atualizarFundo(fundo.id, novoFundo);
    }
  }

  async function fazerRelatorio(id_fundo) {
    var movimentacoes = await managerService.pegarMovimentacaosByFundo(
      id_fundo
    );
    var descricoes = [];
    for (var b = 0; b < movimentacoes.length; b++) {
      const dataMovimentacao = new Date(movimentacoes[b].data_hora);
      const mesMovimentacao = dataMovimentacao.getMonth() + 1;
      const mesAtual = diaAtual.getMonth() + 1;
      const aux = mesAtual - 2;
      if (mesMovimentacao <= aux && movimentacoes[b].tipo !== "RELATORIO") {
        await managerService.deletarMovimentacao(movimentacoes[b].id);
      } else if (movimentacoes[b].tipo !== "RELATORIO") {
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
    movimentacoes = [];
    movimentacoes = await managerService.pegarMovimentacaosByFundo(id_fundo);
    var totaisDescricoes = [];

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
    var totalMensal = 0;
    // eslint-disable-next-line no-loop-func
    totaisDescricoes.forEach((totalDescricao) => {
      totalMensal = totalMensal + totalDescricao.totalLiquido;
    });
    for (var i = 0; i < totaisDescricoes.length; i++) {
      const relatorio = {
        id_fundo: id_fundo,
        data_hora: new Date(),
        descricao: "Total " + totaisDescricoes[i].descricao,
        valor: totaisDescricoes[i].totalLiquido,
        tipo: "RELATORIO",
      };
      await managerService.criarMovimentacao(relatorio);
    }
    const relatorio = {
      id_fundo: id_fundo,
      data_hora: new Date(),
      descricao: "Total Liquido Corrente",
      valor: totalMensal,
      tipo: "RELATORIO",
    };
    await managerService.criarMovimentacao(relatorio);
    toast.success("Relatorio gerado com sucesso!");
  }

  useEffect(() => {
    if (diaAtual.getDate() === 1) {
      for (var a = 0; a < fundos.length; a++) {
        fazerRelatorio(fundos[a].id);
      }
    }
  }, [fundos]);

  function preenchendoDataHora(e) {
    const { value, name } = e.target;
    if (name === "hora") {
      setHoraMovimentacao(value);
    } else if (name === "data") {
      setDataMovimentacao(value);
    }
  }
  return (
    <Body>
      <ComponentesSuperiores>
        <ContainerComponenteSuperior>
          <ValorTotal>R$ {totalGeral}</ValorTotal>
        </ContainerComponenteSuperior>
        <Botao
          fontSize="20px"
          color="#05003D"
          borderColor="#05003D"
          width="40%"
          height="100%"
          onClick={() => {
            abrirModalCriarFundo();
          }}
        >
          Adicionar Fundo
        </Botao>
      </ComponentesSuperiores>
      {fundos?.map((value) => (
        <>
          <ContainerCardFundo key={value.id}>
            <Card title={value.nome} bordered={true}>
              <ContainerCard>
              <ContainerTotalDescricaoFundo>
                <TotalFundo>R$ {value.total}</TotalFundo>
                <DescricaoFundo>{value.descricao}</DescricaoFundo>
              </ContainerTotalDescricaoFundo>
              {selecionarDataHora ? (
                <ContainerDataHora>
                  <Input
                    name="data"
                    width="40%"
                    type="date"
                    marginTop="15px"
                    onChange={preenchendoDataHora}
                  ></Input>
                  <Input
                    name="hora"
                    width="40%"
                    type="time"
                    marginTop="15px"
                    onChange={preenchendoDataHora}
                  ></Input>
                </ContainerDataHora>
              ) : (
                <>
                  <Botao
                    fontSize="16px"
                    color="#05003D"
                    borderColor="#05003D"
                    width="40%"
                    height="60%"
                    onClick={() => {
                      setSelecionarDataHora(true);
                    }}
                  >
                    Selecionar Data e Hora
                  </Botao>
                </>
              )}
              <ContainerBotoesFundo>
                <Botao
                  fontSize="25px"
                  marginTop="12px"
                  color="#05003D"
                  onClick={() => {
                    setandoTipoMovimentacao("ENTRADA", value.id);
                  }}
                >
                  <AiOutlinePlusSquare />
                </Botao>
                <Botao
                  fontSize="25px"
                  marginTop="12px"
                  color="#05003D"
                  onClick={() => {
                    setandoTipoMovimentacao("SAIDA", value.id);
                  }}
                >
                  <AiOutlineMinusSquare />
                </Botao>
                <Input
                  name="valor"
                  width="20%"
                  marginTop="15px"
                  onChange={preenchendoDadosMovimentacao}
                  tipo={novaMovimentacao.tipo}
                  id_map={value.id}
                  id_movimentacao={novaMovimentacao.id_fundo}
                  placeholder="Valor"
                ></Input>
                <Input
                  name="descricao"
                  width="50%"
                  marginTop="15px"
                  onChange={preenchendoDadosMovimentacao}
                  tipo={novaMovimentacao.tipo}
                  id_map={value.id}
                  id_movimentacao={novaMovimentacao.id_fundo}
                  placeholder="Descrição"
                ></Input>
                <Botao
                  fontSize="25px"
                  marginTop="12px"
                  color="#05003D"
                  onClick={() => criacaoMovimentacao()}
                >
                  {carregandoCriarMovimentacao ? (
                    <Spin indicator={antIconCriarMovimentacao} />
                  ) : (
                    <AiOutlineCheckSquare />
                  )}
                </Botao>
              </ContainerBotoesFundo>
              <ContainerExibirMovimentacoes>
              <Botao
                    color="#05003D"
                    borderColor="#05003D"
                    onClick={() => {
                      exibirModalRelatorios(value.id);
                    }}
                  >
                    Exibir Relatórios
                  </Botao>
                <Botao
                  color="#05003D"
                  borderColor="#05003D"
                  onClick={() => {
                    exibirModalMovimentacoes(value.id);
                  }}
                >
                  Exibir Movimentações
                </Botao>
              </ContainerExibirMovimentacoes>
              </ContainerCard>
            </Card>
          </ContainerCardFundo>
        </>
      ))}
      <>
        <Modal
          visible={modalMovimentacoes}
          onOk={fecharModalMovimentacoes}
          onCancel={fecharModalMovimentacoes}
        >
          <ModalMovimentacoes
            id_fundo={id_fundo}
            fecharModal={() => fecharModalMovimentacoes}
          />
        </Modal>
      </>
      <>
        <Modal
          visible={exibirModalCriarFundo}
          onOk={fecharModalCriarFundo}
          onCancel={fecharModalCriarFundo}
        >
          <ModalCriarFundo fecharModal={() => fecharModalCriarFundo()} />
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
            id_fundo={id_fundo}
            fecharModal={() => fecharModalRelatorios()}
          />
        </Modal>
      </>
      <AddToast />
    </Body>
  );
}

export default Fundos;
