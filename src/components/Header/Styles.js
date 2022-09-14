import styled from "styled-components";

export const ContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #05003d;
  height: 100px;
  padding-left: 5%;
  padding-right: 5%;
  color: white;
`;
export const BotoesHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  @media (max-width: 780px) {
    display: none;
  }
`;


