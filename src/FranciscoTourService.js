import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export async function getDadoAno(anoSelecionado){
    const response = await axios.get(`/reservavalormes/${anoSelecionado}`);
    console.log(response);
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
export async function getQuantidadeAtua(){
    const response = await axios.get(`/reservaquantidadeatual`);
    return response.data;
}
