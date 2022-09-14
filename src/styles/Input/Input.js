import styled from "styled-components";
import { Input } from 'antd';

const InputAntd = styled(Input)`
  background-color: ${(props) => {
    let cor;
    if (!props.backgroundColor) {
      if (props.id_map === props.id_movimentacao) {
        if (props.tipo === "ENTRADA") {
          cor = "green";
        } else if (props.tipo === "SAIDA") {
          cor = "red";
        } else {
          cor = "white";
        }
      }
    } else {
      cor = props.backgroundColor;
    }
    return cor;
  }};
  text-align: center;
  color: black;
  border-radius: 3px;
  font-size: 20px;
  height: 30px;
  padding-left: 2%;
  border-color: #05003D;
  margin-top: ${(props) => props.marginTop ?? "0px"};
  width: ${(props) => props.width};
`;

export default InputAntd;
