import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import PainelPizza from "./PainelPizza";
import TabelaFinanceiro from "./TabelaFinanceiro";

const date = new Date();
const currentYear = date.getFullYear();

export default function PainelFinanceiro(){
        const [dadoAno, setDadoAno] = useState('')
        const [tour, setTour] = useState(false);
        const [reservas, setReservas] = useState(false);
        const [estorno, setEstorno] = useState(false);
        const [pagamentoreservas, setPagamentoreservas] = useState(false);
        const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
        const [updateCount, setUpdateCount] = useState(false)
        const [updateData, setUpdateData] = useState(false);

        useEffect(()=>{
            fetch(`${process.env.REACT_APP_BASE_URL}/pagamentoreservavalormes/${anoSelecionado}`, {
                method: "GET",
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token}
            })
                .then((response) => response.json())
                .then((data) => {
                    setDadoAno(data);

                })
                .catch((error) => console.log(error));
            fetch(`${process.env.REACT_APP_BASE_URL}/reservas`, {
                method: "GET",
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token}
            })
                .then((response) => response.json())
                .then((data) => {
                    if(data.fatal === false){
                        setReservas(false)
                    }else{
                        setReservas(data);
                    }

                })
                .catch((error) => console.log(error));
            fetch(`${process.env.REACT_APP_BASE_URL}/tour`, {
                method: "GET",
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token}
            })
                .then((response) => response.json())
                .then((data) => {
                    setTour(data);

                })
                .catch((error) => console.log(error));
            
            fetch(`${process.env.REACT_APP_BASE_URL}/reservaPagamento`, {
                method: "GET",
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token}
            })
                .then((response) => response.json())
                .then((data) => {
                    setPagamentoreservas(data);

                })
                .catch((error) => console.log(error));
                fetch(`${process.env.REACT_APP_BASE_URL}/estorno`, {
                    method: "GET",
                    headers:{ 
                        'Content-Type': 'application/json',
                        "authorization": JSON.parse(localStorage.getItem('user')).token}
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.fatal === false){
                            setEstorno(false)
                        }else{
                            setEstorno(data);
                        }

                    })
                    .catch((error) => console.log(error));
    
            setTimeout(() => {setUpdateData(true)
            }, 1000)
            setTimeout(() => setUpdateData(false), 1500)  
            setUpdateCount(false)        
    
        },[updateCount])
        return(
        <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bolder text-success text-uppercase mb-1">
                                    FATURAMENTO {anoSelecionado}</div>
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
                                    ESTORNOS {anoSelecionado}</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno&&dadoAno.cancelado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-times-circle fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <PainelGrafico title1={"Faturamento"}  title2={"Estorno"} size={"12"} dadoAno={dadoAno} anoSelecionado={anoSelecionado} setAnoSelecionadol={setAnoSelecionadol} setUpdateCount={setUpdateCount} />
        </div>
            <TabelaFinanceiro dadoAno={dadoAno} setUpdateCount={setUpdateCount} updateCount={updateData} estorno={estorno} reservas={reservas} tour={tour} pagamentoreservas={pagamentoreservas} anoSelecionado={anoSelecionado}/>
        </>)
}