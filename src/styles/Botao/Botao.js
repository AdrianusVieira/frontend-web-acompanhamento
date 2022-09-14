import styled from "styled-components";
import { Button } from "antd";

export const Botao = styled(Button)`
  background-color: ${(props) => props.backgroundColor?? "transparent"};
  border-color: ${(props) => props.borderColor?? "transparent"};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color?? "white"};
  width: ${(props) => props.width?? ""};
  height: ${(props) => props.height?? ""};
  margin-top: ${(props) => props.marginTop};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default Botao;
