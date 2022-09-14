import React, { useState, useEffect } from "react";
import { Card } from "antd";
import "antd/dist/antd.css";
import * as managerService from "../../services/managerService";
import { BodyCard } from "./Style";

function ModalMovimentacoes(props) {
  const [movimentacaos, setMovimentacaos] = useState([]);

  async function pegarMovimentacoes() {
    if (props.id_carteira) {
      await managerService
        .pegarMovimentacaosByCarteira(props.id_carteira)
        .then((res) => {
          var resFinal = [];
          res.reverse().forEach((value) => {
            if (value.tipo !== "RELATORIO") {
              resFinal.push(value);
            }
          });
          setMovimentacaos(resFinal);
        });
    } else if (props.id_fundo) {
      await managerService
        .pegarMovimentacaosByFundo(props.id_fundo)
        .then((res) => {
          var resFinal = [];
          res.reverse().forEach((value) => {
            if (value.tipo !== "RELATORIO") {
              resFinal.push(value);
            }
          });
          setMovimentacaos(resFinal);
        });
    } else if (props.id_investimento) {
      await managerService
        .pegarMovimentacaosByInvestimento(props.id_investimento)
        .then((res) => {
          var resFinal = [];
          res.reverse().forEach((value) => {
            if (value.tipo !== "RELATORIO") {
              resFinal.push(value);
            }
          });
          setMovimentacaos(resFinal);
        });
    }
  }
  const compararData = (a, b) => {
    var data1 = new Date(a.data_hora);
    var data2 = new Date(b.data_hora);

    if (data1 < data2) {
      return 1;
    } else {
      return -1;
    }
  };
  useEffect(() => {
    pegarMovimentacoes();
  }, [props]);

  return (
    <div>
      {props.id_investimento ? (
        <>
          {movimentacaos?.sort(compararData).map((value) => (
            <BodyCard
              key={value.id}
            >
              <Card
                title={
                  value.data_hora.slice(8, 10) +
                  "/" +
                  value.data_hora.slice(5, 7) +
                  "/" +
                  value.data_hora.slice(0, 4) +
                  " - " +
                  parseInt(value.data_hora.slice(11, 13)) +
                  ":" +
                  value.data_hora.slice(14, 16)
                }
                bordered={false}
              >
                {value.tipo}: {value.descricao}, {value.valor}
              </Card>
            </BodyCard>
          ))}
        </>
      ) : (
        <>
          {movimentacaos?.sort(compararData).map((value) => (
            <BodyCard
              key={value.id}
              tipoMovimentacao={value.tipo}
              valorMovimentacao={value.valor}
              descricaoMovimentacao={value.descricao}
            >
              <Card
                title={
                  value.data_hora.slice(8, 10) +
                  "/" +
                  value.data_hora.slice(5, 7) +
                  "/" +
                  value.data_hora.slice(0, 4) +
                  " - " +
                  parseInt(value.data_hora.slice(11, 13)) +
                  ":" +
                  value.data_hora.slice(14, 16)
                }
                bordered={false}
              >
                {value.descricao}, {value.valor}
              </Card>
            </BodyCard>
          ))}
        </>
      )}
    </div>
  );
}

export default ModalMovimentacoes;
