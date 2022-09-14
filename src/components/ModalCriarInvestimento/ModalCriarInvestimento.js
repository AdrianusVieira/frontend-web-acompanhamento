import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  ContainerCriarInvestimento,
  ContainerInputsCriarInvestimento,
  TituloInput,
} from "./Style";
import { sleep } from "../../utils/sleep";
import Input from "../../styles/Input/Input";
import Botao from "../../styles/Botao";
import * as managerService from "../../services/managerService";

function ModalCriarInvestimento(props) {
  const [novoInvestimento, setNovoInvestimento] = useState({});
  const [carregandoCriarInvestimento, setCarregandoCriarInvestimento] =
    useState(false);
  const antIconCriarInvestimento = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );

  function preenchendoDadosInvestimento(e) {
    const { value, name } = e.target;
    setNovoInvestimento({ ...novoInvestimento, [name]: value });
  }
  async function criacaoInvestimento() {
    setCarregandoCriarInvestimento(true);
    await managerService.criarInvestimento(novoInvestimento);
    await sleep(1500);
    setCarregandoCriarInvestimento(false);
    setNovoInvestimento({})
    props.fecharModal();
  }

  return (
    <ContainerCriarInvestimento>
      <ContainerInputsCriarInvestimento>
        <TituloInput>Nome:</TituloInput>
        <Input
          name="nome"
          width="100%"
            onChange={preenchendoDadosInvestimento}
        ></Input>
        <TituloInput>Descrição:</TituloInput>
        <Input
          name="descricao"
          width="100%"
            onChange={preenchendoDadosInvestimento}
        ></Input>
        <TituloInput>Tipo:</TituloInput>
        <Input
          name="tipo"
          width="100%"
            onChange={preenchendoDadosInvestimento}
        ></Input>
        <TituloInput>Quantidade:</TituloInput>
        <Input
          name="quantidade"
          width="100%"
            onChange={preenchendoDadosInvestimento}
        ></Input>
        <TituloInput>Total Atribuído:</TituloInput>
        <Input
          name="total_atribuido"
          width="100%"
            onChange={preenchendoDadosInvestimento}
        ></Input>
        <Botao
          fontSize="25px"
          color="black"
          marginTop="30px"
            onClick={() => criacaoInvestimento()}
        >
          {carregandoCriarInvestimento ? (
            <Spin indicator={antIconCriarInvestimento} />
          ) : (
            "Criar Investimento"
          )}
        </Botao>
      </ContainerInputsCriarInvestimento>
    </ContainerCriarInvestimento>
  );
}

export default ModalCriarInvestimento;
