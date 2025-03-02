import axios from "axios";

export async function getDadoAno(anoSelecionado){
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/reservavalormes/${anoSelecionado}`);
    console.log(response);
    return response.data;
}

export async function getDadoMesAtual(){
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/reservavalormesatual`);
    return response.data;
}

export async function getDadoQuantidade(anoSelecionado){
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/reservaquantidade/${anoSelecionado}`);
    return response.data;
}
export async function getQuantidadeAtua(){
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/reservaquantidadeatual`);
    return response.data;
}
