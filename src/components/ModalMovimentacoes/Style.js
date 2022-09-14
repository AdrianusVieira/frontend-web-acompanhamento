import styled from "styled-components";

export const BodyCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2% 2% 2% 2%;
  background-color: ${(props) => {
    let cor;
    if (!props.backgroundColor) {
      if (props.tipoMovimentacao === "ENTRADA") {
        cor = "green";
      } else if (props.tipoMovimentacao === "SAIDA") {
        cor = "red";
      } else if (props.tipoMovimentacao === "RELATORIO") {
        if (props.valorMovimentacao >= 0) {
          cor = "#05FF00";
        } else {
          if (props.descricaoMovimentacao === "Total Liquido Corrente") {
            cor = "#05003D";
          } else {
            cor = "#FAFF00";
          }
        }
      }
    } else {
      cor = props.backgroundColor;
    }
    return cor;
  }};
  margin-top: 20px;
`;
