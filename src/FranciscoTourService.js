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

export async function getDadoAno(anoSelecionado, idVendedor){
    const params = { ano: anoSelecionado };
    if (idVendedor) {
        params.idVendedor = idVendedor; 
    }
    const response = await instance.get(`/reservas/valorMes/${anoSelecionado}`, { params: params });
    return response.data;
}

export async function getDadoMesAtual(idVendedor){
    const params = {};
    if (idVendedor) {
        params.idVendedor = idVendedor;
    }

    const response = await instance.get(`/reservas/valorMesAtual`,{ params: params });
    return response.data;
}

export async function getDadoQuantidade(anoSelecionado, idVendedor){
    const params = { ano: anoSelecionado };
    if (idVendedor) {
        params.idVendedor = idVendedor;
    }
    const response = await instance.get(`/reservas/quantidade/${anoSelecionado}`, { params: params });
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

export async function getEstornoByReservaId(idReserva) {
    const response = await instance.get(`/estornos/reserva/${idReserva}`); 
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

export async function getPagamentoReservaValorMes(anoSelecionado, idVendedor){
    const params = {};
    if (idVendedor) {
        params.idVendedor = idVendedor;
    }
    const response = await instance.get(`/reservas/valorMes/${anoSelecionado}`,{ params: params });
    return response.data;
}

export async function getQuantidadeAtua(idVendedor){
    const params = {};
    if (idVendedor) {
        params.idVendedor = idVendedor;
    }
    const response = await instance.get(`/reservas/quantidadeAtual`, { params: params });
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

export async function getPagamentosByReservaId(idReserva) {
    const response = await instance.get(`/pagamentos/reserva/${idReserva}`); 
    return response.data;
}

export async function getReservasPorTourEData(date, nomeTour) {
    const response = await instance.get(`/reservas/data/nometour?data=${date}&nometour=${encodeURIComponent(nomeTour)}`);
    return response.data;
}


export async function getTours(){
    const response = await instance.get(`/tours`);
    return response.data;
}

export async function getToursByReservaId(idReserva) {
    const response = await instance.get(`/tours/reserva/${idReserva}`);
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

export async function getUsuarios() {
    const response = await instance.get(`/users`);
    return response.data;    
}

export async function getComissoes() {
    const response = await instance.get('/reservas/comissoes');
    return response.data;
}

export async function getTotalComissoesAno(ano, vendedor) {
    const params = {};
    if (vendedor) {
        params.vendedor = vendedor;
    }
    const response = await instance.get(`/reservas/comissoes/totalAno/${ano}`, { params: params });
    return response.data;
}

export async function getTotalComissoesMes(mes, ano, vendedor) {
    const params = {};
    if (vendedor) {
        params.vendedor = vendedor;
    }
    const response = await instance.get(`/reservas/comissoes/totalMes/${mes}/${ano}`, { params: params });
    return response.data;
}

//sets
export async function createCliente(cliente) {
    const response = await instance.post(`/clientes`, cliente);
    return response;
}

export async function createReserva(reserva) {
    const response = await instance.post(`/reservas`, reserva);
    return response;
}

export async function createTour(tour) {
    const response = await instance.post(`/tour`, tour);
    return response;
}

export async function createPagamento(pagamento) {
    const response = await instance.post(`/pagamento`, pagamento);
    return response;
}

export async function createEstorno(estorno){
    const response = await instance.post(`/estorno`, estorno);
    return response;
}

export const editEstorno = (id, estorno) => {
    return instance.put(`/estorno/${id}`, estorno);
};

export const editStatusEstorno = (id, status) => {
    return instance.put(`/estorno/status/${id}`, status);
};

export async function createTourCadastro(tourCadastro) {
    const response = await instance.post(`/tourCadastro`, tourCadastro);
    return response;
}

export async function createUsuario(data) {
    const response = await instance.post('/signup', data);
    return response;
}

export async function updateTourCadastro(id_tour, tourCadastro) {
    const response = await instance.put(`/tourCadastro/${id_tour}`, tourCadastro);
    return response;
}

export async function editarStatusReserva(status){
    const response = await instance.post(`/reservas/status`, status)
    return response;
}

export async function editarStatusTours(status){
    const response = await instance.post(`/tours/status`, status)
    return response;
}

export async function editarStatusPagamento(status){
    const response = await instance.post(`/pagamentos/status`, status)
    return response;
}

export async function editarReserva(id, reserva) {
    const response = await instance.put(`/reserva/${id}`, reserva);
    return response;
}

export async function editarTour(id, dados) {
    const response = await instance.put(`/tour/${id}`, dados);
    return response;
}

export async function editarPagamento(id, formData) {
    const response = await instance.put(`/pagamento/${id}`, formData);
    return response;
}

export async function editarStatusUsuario(idUsuario, data) {
    //alert(data.status)
    const response = await instance.put(`/user/status/${idUsuario}`, data); 
    return response;
}

export async function deleteTourCadastro(id_tour) {
    await instance.delete(`/tourCadastro/${id_tour}`);
}

export async function deletarCliente(id) {
    const response = await instance.delete(`/cliente/${id}`);
    return response;
}

export async function deletarReserva(idR) {
    const response = await instance.delete(`/reserva/${idR}`);
    return response;
}

export async function deletarReservaTour(idR) {
    const response = await instance.delete(`/reserva/${idR}/tours`);
    return response;
}

export async function deletarPagamentoReserva(idR) {
    const response = await instance.delete(`/reserva/${idR}/pagamentos`);
    return response;
}