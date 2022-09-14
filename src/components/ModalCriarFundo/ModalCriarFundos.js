import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Input from "../../styles/Input/Input";
import {
  ContainerCriarFundo,
  ContainerInputsCriarFundo,
  TituloInput,
} from "./Style";
import Botao from "../../styles/Botao";
import { sleep } from "../../utils/sleep";
import * as managerService from "../../services/managerService";
function ModalCriarFundo(props) {
  const [novoFundo, setNovoFundo] = useState({});
  const [carregandoCriarFundo, setCarregandoCriarFundo] = useState(false);
  const antIconCriarFundo = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  function preenchendoDadosFundo(e) {
    const { value, name } = e.target;
    setNovoFundo({ ...novoFundo, [name]: value });
  }

  async function criacaoFundo() {
    setCarregandoCriarFundo(true);
    await managerService.criarFundo(novoFundo);
    await sleep(1500);
    setCarregandoCriarFundo(false);
    props.fecharModal();
  }

  return (
    <ContainerCriarFundo>
      <ContainerInputsCriarFundo>
        <TituloInput>Nome:</TituloInput>
        <Input
          name="nome"
          width="100%"
          onChange={preenchendoDadosFundo}
        ></Input>
        <TituloInput>Valor Inicial:</TituloInput>
        <Input
          name="total"
          width="100%"
          onChange={preenchendoDadosFundo}
        ></Input>
        <TituloInput>Descrição:</TituloInput>
        <Input
          name="descricao"
          width="100%"
          onChange={preenchendoDadosFundo}
        ></Input>
        <Botao
          fontSize="25px"
          color="black"
          marginTop="30px"
          onClick={() => criacaoFundo()}
        >
          {carregandoCriarFundo ? (
            <Spin indicator={antIconCriarFundo} />
          ) : (
            "Criar Fundo"
          )}
        </Botao>
      </ContainerInputsCriarFundo>
    </ContainerCriarFundo>
  );
}

export default ModalCriarFundo;
