import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import AddToast from "../../components/AddToast";
import { Modal } from "antd";
import "antd/dist/antd.css";
import {
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
  AiOutlineCheckSquare,
} from "react-icons/ai";
import {
  Body,
  ComponentesSuperiores,
  ContainerBotoesCarteira,
  ContainerCardCarteira,
  ContainerComponenteSuperior,
  ContainerDataHora,
  ContainerExibirMovimentacoes,
  ContainerTotalDescricaoCarteira,
  DescricaoCarteira,
  TotalCarteira,
  ValorTotal,
} from "./Style";
import Botao from "../../styles/Botao";
import Input from "../../styles/Input/Input";
import Card from "../../styles/Card";
import { sleep } from "../../utils/sleep";
import ModalMovimentacoes from "../../components/ModalMovimentacoes";
import ModalCriarCarteira from "../../components/ModalCriarCarteira";
import ModalRelatorios from "../../components/ModalRelatorios/ModalRelatorios";
import { toast } from "react-toastify";
import * as managerService from "../../services/managerService";

function Carteiras() {
  const [totalGeral, setTotalGeral] = useState("");
  const [criarCarteira, setCriarCarteira] = useState(false);
  const [selecionarDataHora, setSelecionarDataHora] = useState(false);
  const [carteiras, setCarteiras] = useState([]);
  const [carregandoCriarMovimentacao, setCarregandoCriarMovimentacao] =
    useState(false);
  const [novaMovimentacao, setNovaMovimentacao] = useState({});
  const [modalMovimentacoes, setModalMovimentacoes] = useState(false);
  const [id_carteira, setId_Carteira] = useState("");
  const [dataMovimentacao, setDataMovimentacao] = useState();
  const [horaMovimentacao, setHoraMovimentacao] = useState();
  const [modalRelatorios, setModalRelatorios] = useState(false);
  const diaAtual = new Date();

  function exibirModalRelatorios(id_carteira) {
    setId_Carteira(id_carteira);
    setModalRelatorios(true);
  }
  function fecharModalRelatorios() {
    setModalRelatorios(false);
  }

  const exibirModalMovimentacoes = (id_carteira) => {
    setId_Carteira(id_carteira);
    setModalMovimentacoes(true);
  };

  const fecharModalMovimentacoes = () => {
    setModalMovimentacoes(false);
  };

  const antIconCriarMovimentacao = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );

  async function pegandoTotalGeral() {
    const res = await managerService.pegandoTotal();
    const aux = JSON.stringify(res.valor);
    setTotalGeral(aux);
  }

  useEffect(() => {
    pegandoTotalGeral();
  }, []);

  async function pegarCarteiras() {
    setCarteiras([]);
    await managerService.pegarCarteiras().then((res) => {
      setCarteiras(res);
    });
  }

  useEffect(() => {
    pegarCarteiras();
  }, []);

  function abrirCriacaoCarteira() {
    setCriarCarteira(true);
  }

  function fecharCriacaoCarteira() {
    setCriarCarteira(false);
    pegarCarteiras();
  }

  async function fazerRelatorio(id_carteira) {
    var movimentacoes = await managerService.pegarMovimentacaosByCarteira(
      id_carteira
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
    movimentacoes = await managerService.pegarMovimentacaosByCarteira(
      id_carteira
    );
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
        id_carteira: id_carteira,
        data_hora: new Date(),
        descricao: "Total " + totaisDescricoes[i].descricao,
        valor: totaisDescricoes[i].totalLiquido,
        tipo: "RELATORIO",
      };
      await managerService.criarMovimentacao(relatorio);
    }
    const relatorio = {
      id_carteira: id_carteira,
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
      for (var a = 0; a < carteiras.length; a++) {
        fazerRelatorio(carteiras[a].id);
      }
    }
  }, [carteiras]);

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
          id_carteira: id,
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
        id_carteira: id,
        data_hora: aux,
      });
    }
  }
  async function criacaoMovimentacao() {
    setCarregandoCriarMovimentacao(true);
    await operandoTotal(novaMovimentacao);
    await managerService.criarMovimentacao(novaMovimentacao);
    await sleep(1500);
    pegarCarteiras();
    pegandoTotalGeral();
    setNovaMovimentacao({});
    setCarregandoCriarMovimentacao(false);
    setSelecionarDataHora(false);
  }

  async function operandoTotal(movimentacao) {
    const carteira = await managerService.pegarCarteiraById(
      movimentacao.id_carteira
    );
    const valor_total = +totalGeral;
    const aux = +movimentacao.valor;
    if (movimentacao.tipo === "ENTRADA") {
      const novaCarteira = {
        total: carteira.total + aux,
        nome: carteira.nome,
      };
      const novoTotal = {
        valor: valor_total + aux,
      };
      await managerService.atualizarTotal(novoTotal);
      await managerService.atualizarCarteira(carteira.id, novaCarteira);
    } else if (movimentacao.tipo === "SAIDA") {
      const novaCarteira = {
        total: carteira.total - aux,
        nome: carteira.nome,
      };
      const novoTotal = {
        valor: valor_total - aux,
      };
      await managerService.atualizarTotal(novoTotal);
      await managerService.atualizarCarteira(carteira.id, novaCarteira);
    }
  }

  function preenchendoDataHora(e) {
    const { value, name } = e.target;
    if (name === "hora") {
      setHoraMovimentacao(value);
    } else if (name === "data") {
      setDataMovimentacao(value);
    }
  }

  return (
    <div>
      <Body>
        <ComponentesSuperiores>
          <ContainerComponenteSuperior>
            <ValorTotal>Total = R$ {totalGeral}</ValorTotal>
          </ContainerComponenteSuperior>
          <Botao
            fontSize="20px"
            color="#05003D"
            borderColor="#05003D"
            width="40%"
            height="100%"
            onClick={() => {
              abrirCriacaoCarteira();
            }}
          >
            Adicionar Carteira
          </Botao>
        </ComponentesSuperiores>
        {carteiras?.map((value) => (
          <ContainerCardCarteira key={value.id}>
            <Card title={value.nome} bordered={true}>
              <ContainerCardCarteira>
                <ContainerTotalDescricaoCarteira>
                  <TotalCarteira>R$ {value.total}</TotalCarteira>
                  <DescricaoCarteira>{value.descricao}</DescricaoCarteira>
                </ContainerTotalDescricaoCarteira>
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

                <ContainerBotoesCarteira>
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
                    id_movimentacao={novaMovimentacao.id_carteira}
                    placeholder="Valor"
                  ></Input>
                  <Input
                    name="descricao"
                    width="50%"
                    marginTop="15px"
                    onChange={preenchendoDadosMovimentacao}
                    tipo={novaMovimentacao.tipo}
                    id_map={value.id}
                    id_movimentacao={novaMovimentacao.id_carteira}
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
                </ContainerBotoesCarteira>
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
              </ContainerCardCarteira>
            </Card>
          </ContainerCardCarteira>
        ))}
      </Body>
      <>
        <Modal
          visible={modalMovimentacoes}
          onOk={fecharModalMovimentacoes}
          onCancel={fecharModalMovimentacoes}
        >
          <ModalMovimentacoes
            id_carteira={id_carteira}
            fecharModal={() => fecharModalMovimentacoes}
          />
        </Modal>
      </>
      <>
        <Modal
          visible={criarCarteira}
          onOk={fecharCriacaoCarteira}
          onCancel={fecharCriacaoCarteira}
        >
          <ModalCriarCarteira fecharModal={() => fecharCriacaoCarteira()} />
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
            id_carteira={id_carteira}
            fecharModal={() => fecharModalRelatorios()}
          />
        </Modal>
      </>

      <AddToast />
    </div>
  );
}

export default Carteiras;
