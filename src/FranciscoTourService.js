import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

//gets
export async function getClientes(){
    const response = await axios.get(`/clientes`);
    return response.data;
}

export async function getDadoAno(anoSelecionado){
    const response = await axios.get(`/reservavalormes/${anoSelecionado}`);
    return response.data;
}

export async function getDadoMesAtual(){
    const response = await axios.get(`/reservavalormesatual`);
    return response.data;
}

export async function getDadoQuantidade(anoSelecionado){
    const response = await axios.get(`/reservaquantidade/${anoSelecionado}`);
    return response.data;
}

export async function getDataDiferentes(month, year){
    const response = await axios.get(`/dataDiferentes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getEstorno(){
    const response = await axios.get(`/estorno`);
    return response.data;
}

export async function getPagamentoReservaAnual(anoSelecionado){
    const response = await axios.get(`/pagamentoReservaAnual/${anoSelecionado}`);
    return response.data;
}
export async function getPagamentoReservaMensal(month, year){
    const response = await axios.get(`/pagamentoReservaMensal/${month + 1}/${year}`);
    return response.data;
}

export async function getPagamentoReservaValorMes(anoSelecionado){
    const response = await axios.get(`/pagamentoreservavalormes/${anoSelecionado}`);
    return response.data;
}

export async function getQuantidadeAtua(){
    const response = await axios.get(`/reservaquantidadeatual`);
    return response.data;
}

export async function getReservas(){
    const response = await axios.get(`/reservas`);
    return response.data;
}

export async function getPagamentoReservas(){
    const response = await axios.get(`/reservaPagamento`);
    return response.data;
}

export async function getTours(){
    const response = await axios.get(`/tour`);
    return response.data;
}

export async function getTourPorMes(month, year){
    const response = await axios.get(`/tourPorMes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getTiposTours(){
    const response = await axios.get(`/tiposTours`);
    return response.data;
}

//sets