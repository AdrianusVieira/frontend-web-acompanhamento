import styled from "styled-components";

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4% 2% 4% 2%;
`;
export const ComponentesSuperiores = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 80%;
`;
export const ContainerComponenteSuperior = styled.div`
  display: flex;
  align-content: center;
  width: 100%;
  border-color: aqua;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 2% 2% 2% 2%;
`;
export const ValorTotal = styled.text`
  color: #05003d;
  font-size: 25px;
`;

export const ContainerCardInvestimento = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 25px;
  min-width: 800px;
`;

export const ContainerDescricaoTipoIvestimento = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
`;
export const TotalIvestimento = styled.text`
  color: black;
  font-size: 25px;
  text-align: center;
  margin-top: 10px;
  width: 100%;
`;
export const DescricaoIvestimento = styled.text`
  color: gray;
  font-size: 18px;
  text-align: center;
  margin-top: 10px;
  width: 100%;
`;
export const ContainerQuantidadeTotalIvestimento = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
`;
export const ContainerTipoDataHora = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
  width:90%;
`
export const ContainerBotoesInvestimento = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
  width:90%;
`
export const ContainerExibirMovimentacoes = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-top: 40px;
  width:100%;
`