import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
  });

//gets
export async function getClientes(){
    const response = await instance.get(`/clientes`);
    return response.data;
}

export async function getDadoAno(anoSelecionado){
    const response = await instance.get(`/reservavalormes/${anoSelecionado}`);
    return response.data;
}

export async function getDadoMesAtual(){
    const response = await instance.get(`/reservavalormesatual`);
    return response.data;
}

export async function getDadoQuantidade(anoSelecionado){
    const response = await instance.get(`/reservaquantidade/${anoSelecionado}`);
    return response.data;
}

export async function getDataDiferentes(month, year){
    const response = await instance.get(`/dataDiferentes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getEstorno(){
    const response = await instance.get(`/estorno`);
    return response.data;
}

export async function getPagamentoReservaAnual(anoSelecionado){
    const response = await instance.get(`/pagamentoReservaAnual/${anoSelecionado}`);
    return response.data;
}
export async function getPagamentoReservaMensal(month, year){
    const response = await instance.get(`/pagamentoReservaMensal/${month + 1}/${year}`);
    return response.data;
}

export async function getPagamentoReservaValorMes(anoSelecionado){
    const response = await instance.get(`/pagamentoreservavalormes/${anoSelecionado}`);
    return response.data;
}

export async function getQuantidadeAtua(){
    const response = await instance.get(`/reservaquantidadeatual`);
    return response.data;
}

export async function getReservas(){
    const response = await instance.get(`/reservas`);
    return response.data;
}

export async function getPagamentoReservas(){
    const response = await instance.get(`/reservaPagamento`);
    return response.data;
}

export async function getTours(){
    const response = await instance.get(`/tour`);
    return response.data;
}

export async function getTourPorMes(month, year){
    const response = await instance.get(`/tourPorMes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getTiposTours(){
    const response = await instance.get(`/tiposTours`);
    return response.data;
}

//sets