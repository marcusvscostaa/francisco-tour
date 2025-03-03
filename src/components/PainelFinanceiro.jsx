import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import PainelPizza from "./PainelPizza";
import TabelaFinanceiro from "./TabelaFinanceiro";
import {getPagamentoReservaValorMes, getReservas, getTours, getPagamentoReservas, getEstorno} from "../FranciscoTourService";

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
            getPagamentoReservaValorMes(anoSelecionado).then(
                data => {
                    if(data.fatal || data.code){
                        setDadoAno(false);
                    }else{
                        setDadoAno(data)
                    }    
                }
            ).catch((error) => console.log(error));

            setTimeout(() => {
                getReservas().then(
                data => {
                    setReservas(data)
                    }
                ).catch((error) => console.log(error));
            }, "300");

            setTimeout(() => {
                getTours().then(
                data => {
                    setTour(data)
                    }
                ).catch((error) => console.log(error));
            }, "600");
            
            setTimeout(() => {
                getPagamentoReservas().then(
                data => {
                    setPagamentoreservas(data)
                    }
                ).catch((error) => console.log(error));
            }, "900");
            
            setTimeout(() => {
                getEstorno().then(
                data => {
                    setEstorno(data)
                    }
                ).catch((error) => console.log(error));
            }, "1200");
            

            setTimeout(() => {setUpdateData(true)
            }, 1000)
            setTimeout(() => setUpdateData(false), 1500)  
            setUpdateCount(false)        
    
        },[updateCount])
        return(
        <>
        {dadoAno&&reservas&&tour&&pagamentoreservas&&estorno?
        <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bolder text-success text-uppercase mb-1">
                                    FATURAMENTO {anoSelecionado}</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno.valorTotal.toFixed(2).replace(".", ",")}</div>
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
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno.cancelado.toFixed(2).replace(".", ",")}</div>
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
        </>:<div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
        </>)
}