import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import TabelaFinanceiro from "./TabelaFinanceiro";
import {getPagamentoReservaValorMes, getReservas, getTours, getPagamentoReservas, getEstorno} from "../FranciscoTourService";

const date = new Date();
const currentYear = date.getFullYear();

const formatarMoedaBRL = (valor) => {
    const numero = typeof valor === 'number' ? valor : parseFloat(valor);
    if (isNaN(numero)) {
        return "0,00"; 
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numero);
};

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
            const fetchData = async () => {
            try {
                const dadoAnoPromise = getPagamentoReservaValorMes(anoSelecionado);

                const [
                    dataReservas, 
                    dataTours, 
                    dataPagamentos, 
                    dataEstorno
                ] = await Promise.all([
                    getReservas(),
                    getTours(),
                    getPagamentoReservas(),
                    getEstorno()
                ]);

                const dataAno = await dadoAnoPromise;

                if(dataAno.fatal || dataAno.code){
                    setDadoAno(false);
                } else {
                    setDadoAno(dataAno);
                }
                
                setReservas(dataReservas);
                setTour(dataTours);
                setPagamentoreservas(dataPagamentos);
                setEstorno(dataEstorno);

            } catch (error) {
                console.error("Erro ao carregar dados do Financeiro:", error);
                setDadoAno(false);
                setReservas(false);
                setTour(false);
                setPagamentoreservas(false);
                setEstorno(false);
            } finally {
                setUpdateCount(false);
            }
        };

        fetchData();
    
        },[updateCount, anoSelecionado])
        return(
        <>
        {dadoAno&&reservas&&tour&&pagamentoreservas&&estorno?
        <>
        <div className="row">
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bolder text-success text-uppercase mb-1">
                                    FATURAMENTO {anoSelecionado}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">R$ {formatarMoedaBRL(dadoAno.valorTotal)}</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-danger shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                    ESTORNOS {anoSelecionado}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">R$ {formatarMoedaBRL(dadoAno.cancelado)}</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <PainelGrafico title1={"Faturamento"}  title2={"Estorno"} size={"12"} dadoAno={dadoAno} anoSelecionado={anoSelecionado} setAnoSelecionadol={setAnoSelecionadol} setUpdateCount={setUpdateCount} />
        </div>
            <TabelaFinanceiro dadoAno={dadoAno} setUpdateCount={setUpdateCount} updateCount={updateData} estorno={estorno} reservas={reservas} tour={tour} pagamentoreservas={pagamentoreservas} anoSelecionado={anoSelecionado} formatarMoeda={formatarMoedaBRL}/>
        </>:<div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
        </>)
}