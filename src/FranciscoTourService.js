import axios from "axios";
const token = localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21';
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {Authorization: `Bearer ${token}`}

  });

//gets
export async function getClientes(){
    const response = await instance.get(`/clientes`);
    return response.data;
}

export async function getCurrentUser(){
    const authorization = localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
    const response = await instance.get(`/autenticacao/${authorization}`) 
    return response
    
}

export async function getDadoAno(anoSelecionado){
    const response = await instance.get(`/reservas/valorMes/${anoSelecionado}`);
    return response.data;
}

export async function getDadoMesAtual(){
    const response = await instance.get(`/reservas/valorMesAtual`);
    console.log(token);
    return response.data;
}

export async function getDadoQuantidade(anoSelecionado){
    const response = await instance.get(`/reservas/quantidade/${anoSelecionado}`);
    return response.data;
}

export async function getDataDiferentes(month, year){
    const response = await instance.get(`/tours/datasDiferentes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getEstorno(){
    const response = await instance.get(`/estornos`);
    return response.data;
}

export async function getPagamentoReservaAnual(anoSelecionado){
    const response = await instance.get(`/pagamentos/Anual/${anoSelecionado}`);
    return response.data;
}
export async function getPagamentoReservaMensal(month, year){
    const response = await instance.get(`/pagamentos/Mensal/${month + 1}/${year}`);
    return response.data;
}

export async function getPagamentoReservaValorMes(anoSelecionado){
    const response = await instance.get(`/reservas/valorMes/${anoSelecionado}`);
    return response.data;
}

export async function getQuantidadeAtua(){
    const response = await instance.get(`/reservas/quantidadeAtual`);
    return response.data;
}

export async function getReservas(){
    const response = await instance.get(`/reservas`);
    return response.data;
}

export async function getReservaFind(id){
    const response = await instance.get(`/reservas/cliente/${id}`);
    return response.data;
}

export async function getPagamentoReservas(){
    const response = await instance.get(`/pagamentos`);
    return response.data;
}

export async function getTours(){
    const response = await instance.get(`/tours`);
    return response.data;
}

export async function getTourPorMes(month, year){
    const response = await instance.get(`/tours/PorMes/${(month + 1)}/${year}`);
    return response.data;
}

export async function getTiposTours(){
    const response = await instance.get(`/tours/tiposTours`);
    return response.data;
}

export async function getToursCadastro() {
    const response = await instance.get(`/tourCadastro`);
    return response.data;
}

export async function getToursCadastroDestino(destino) {
    const response = await instance.get(`/tourCadastro/destino/?destino=${destino}`);
    return response.data;
}

//sets
export async function createTourCadastro(tourCadastro) {
    const response = await instance.post(`/tourCadastro`, tourCadastro);
    return response.data;
}

export async function updateTourCadastro(id_tour, tourCadastro) {
    const response = await instance.put(`/tourCadastro/${id_tour}`, tourCadastro);
    return response.data;
}

export async function deleteTourCadastro(id_tour) {
    await instance.delete(`/tourCadastro/${id_tour}`);
}