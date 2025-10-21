import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import PainelPizza from "./PainelPizza";
import { getDadoAno, getDadoMesAtual, getDadoQuantidade, getQuantidadeAtua } from "../FranciscoTourService";
const date = new Date();
const currentYear = date.getFullYear();

const formatarNumero = (valor) => {
    const numero = typeof valor === 'number' ? valor : parseFloat(valor);
    if (isNaN(numero)) {
        return "0,00";
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2, // Garante que dois decimais sejam exibidos
        maximumFractionDigits: 2,
    }).format(numero);
};

export default function PainelPrincipal() {
    const [dadoAno, setDadoAno] = useState(false)
    const [dadoMesAtual, setDadoMesAtual] = useState(false)
    const [dadoQuantidade, setDadoQuantidade] = useState(false)
    const [dadoQuantidadeAtual, setQuantidadeAtua] = useState(false)
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [updateCount, setUpdateCount] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataAno, dataMes, dataQuantidade, dataQuantidadeAtual] = await Promise.all([
                    getDadoAno(anoSelecionado),
                    getDadoMesAtual(),
                    getDadoQuantidade(anoSelecionado),
                    getQuantidadeAtua(),
                ]);

                setDadoAno(dataAno);
                setDadoMesAtual(dataMes);
                setDadoQuantidade(dataQuantidade);
                setQuantidadeAtua(dataQuantidadeAtual);

            } catch (error) {
                console.error("Erro ao carregar dados do painel:", error);
                setDadoAno(false); 
                setDadoMesAtual(false);
                setDadoQuantidade(false);
                setQuantidadeAtua(false);

            } finally {
                setUpdateCount(false); 
            }
        };
        fetchData();

    }, [anoSelecionado])


    
    return(
    <>
    {dadoAno&&dadoMesAtual&&dadoQuantidade&&dadoQuantidadeAtual?
    <>
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bolder text-primary text-uppercase mb-1">
                                Vendas {`${date.toLocaleString('default', { month: 'long' })}/${date.getFullYear()}`}</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {formatarNumero(dadoMesAtual?.vendaMesAtual)}</div>
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
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {formatarNumero(dadoAno.valorTotal)}</div>
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
                            <div class="h5 mb-0 font-weight-bold text-gray-800">R$ R$ {formatarNumero(dadoAno.cancelado)}</div>
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
        <PainelGrafico title1={"Vendas Confirmadas"}  title2={"Vendas Canceladas"} size={"8"} dadoAno={dadoAno} anoSelecionado={anoSelecionado} setAnoSelecionadol={setAnoSelecionadol} setUpdateCount={setUpdateCount} />
        <PainelPizza dadoQuantidade={dadoQuantidade} dadoQuantidadeAtual={dadoQuantidadeAtual}  anoSelecionado={anoSelecionado}/>
    </div>
    </>:<div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
}
</>
   
    )
}
