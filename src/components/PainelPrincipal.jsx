import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import PainelPizza from "./PainelPizza";
const date = new Date();
const currentYear = date.getFullYear();

export default function PainelPrincipal(){
    const [dadoAno, setDadoAno] = useState('')
    const [dadoMesAtual, setDadoMesAtual] = useState('')
    const [dadoQuantidade, setDadoQuantidade] = useState('')
    const [dadoQuantidadeAtual, setQuantidadeAtua] = useState('')
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [updateCount, setUpdateCount] = useState(false)
    useEffect(()=>{
        fetch(`http://192.168.0.105:8800/reservavalormes/${anoSelecionado}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDadoAno(data);
                console.log(dadoAno)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        fetch(`http://192.168.0.105:8800/reservavalormesatual`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDadoMesAtual(data);
                console.log(dadoMesAtual)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        fetch(`http://192.168.0.105:8800/reservaquantidade/${anoSelecionado}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDadoQuantidade(data);
                console.log(dadoMesAtual)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        fetch(`http://192.168.0.105:8800/reservaquantidadeatual`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setQuantidadeAtua(data);
                console.log(dadoMesAtual)
                //console.log(data);
            })
            .catch((error) => console.log(error));


        console.log(dadoAno)
        setUpdateCount(false)

    },[updateCount])
    return(
    <>
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bolder text-primary text-uppercase mb-1">
                                Vendas {`${date.toLocaleString('default', { month: 'long' })}/${date.getFullYear()}`}</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoMesAtual&&dadoMesAtual.vendaMesAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Vendas Confirmadas ({anoSelecionado})</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno&&dadoAno.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Vendas Canceladas ({anoSelecionado})</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno&&dadoAno.cancelado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-times-circle fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                RESERVAS {`${date.toLocaleString('default', { month: 'long' })}/${date.getFullYear()}`}</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">{dadoQuantidadeAtual.quantidadeAtual}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-hot-tub fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <PainelGrafico dadoAno={dadoAno} anoSelecionado={anoSelecionado} setAnoSelecionadol={setAnoSelecionadol} setUpdateCount={setUpdateCount} />
        <PainelPizza dadoQuantidade={dadoQuantidade} dadoQuantidadeAtual={dadoQuantidadeAtual}  anoSelecionado={anoSelecionado}/>
    </div>
    </>
    )
}
