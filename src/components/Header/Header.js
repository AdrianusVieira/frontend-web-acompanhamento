import React, { useState, useEffect } from "react";
import Botao from "../../styles/Botao";
import { BotoesHeader, ContainerHeader } from "./Styles";
import { useHistory } from "react-router-dom";
import * as managerService from "../../services/managerService";
function Header(props) {
  const history = useHistory();
  const [totalGeral, setTotalGeral] = useState("");
  
  async function pegandoTotalGeral() {
    const res = await managerService.pegandoTotal();
    const aux = JSON.stringify(res.valor);
    setTotalGeral(aux);
  }

  useEffect(() => {
    pegandoTotalGeral();
  }, []);
  return (
    <div>
      <ContainerHeader>
        <BotoesHeader>
          <Botao
            fontSize="25px"
            onClick={() => {
              history.push("/carteiras");
            }}
          >
            Carteiras
          </Botao>
          <Botao
            fontSize="25px"
            onClick={() => {
              history.push("/fundos");
            }}
          >
            Fundos{" "}
          </Botao>
          <Botao
            fontSize="25px"
            onClick={() => {
              history.push("/investimentos");
            }}
          >
            Investimentos
          </Botao>
        </BotoesHeader>
      </ContainerHeader>
      {props.children}
    </div>
  );
}

export default Header;
