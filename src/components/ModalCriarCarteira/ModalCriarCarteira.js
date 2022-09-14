import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  ContainerCriarCarteira,
  ContainerInputsCriarCarteira,
  TituloInput,
} from "./Styles";
import { sleep } from "../../utils/sleep";
import Input from "../../styles/Input/Input";
import Botao from "../../styles/Botao";
import * as managerService from "../../services/managerService";

function ModalCriarCarteira(props) {
  const [novaCarteira, setNovaCarteira] = useState({});
  const [carregandoCriarCarteira, setCarregandoCriarCarteira] = useState(false);
  const antIconCriarCarteira = (
    <LoadingOutlined style={{ fontSize: 24 }} spin />
  );
  function preenchendoDadosCarteira(e) {
    const { value, name } = e.target;
    setNovaCarteira({ ...novaCarteira, [name]: value });
  }

  async function criacaoCarteira() {
    setCarregandoCriarCarteira(true);
    await managerService.criarCarteira(novaCarteira);
    await sleep(1500);
    setCarregandoCriarCarteira(false);
    props.fecharModal();
  }
  return (
    <ContainerCriarCarteira>
      <ContainerInputsCriarCarteira>
        <TituloInput>Nome:</TituloInput>
        <Input
          name="nome"
          width="100%"
          onChange={preenchendoDadosCarteira}
        ></Input>
        <TituloInput>Valor Inicial:</TituloInput>
        <Input
          name="total"
          width="100%"
          onChange={preenchendoDadosCarteira}
        ></Input>
        <TituloInput>Descrição:</TituloInput>
        <Input
          name="descricao"
          width="100%"
          onChange={preenchendoDadosCarteira}
        ></Input>
        <Botao
          fontSize="25px"
          color="black"
          marginTop="30px"
          onClick={() => criacaoCarteira()}
        >
          {carregandoCriarCarteira ? (
            <Spin indicator={antIconCriarCarteira} />
          ) : (
            "Criar Carteira"
          )}
        </Botao>
      </ContainerInputsCriarCarteira>
    </ContainerCriarCarteira>
  );
}

export default ModalCriarCarteira;
