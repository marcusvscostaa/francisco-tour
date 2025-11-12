import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import PainelPizza from "./PainelPizza";
import { getDadoAno, getDadoMesAtual, getDadoQuantidade, getQuantidadeAtua, getUsuarios } from "../FranciscoTourService";
import { Select, Button as AntButton } from 'antd';
import { useAuth } from '../context/AuthContext.jsx'; 


const { Option } = Select;
const date = new Date();
const currentYear = date.getFullYear();

const formatarNumero = (valor) => {
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

export default function PainelPrincipal() {
    const {  userRole } = useAuth();
    const isAdmin = userRole === "ADMIN";
    const [dadoAno, setDadoAno] = useState(false)
    const [dadoMesAtual, setDadoMesAtual] = useState(false)
    const [dadoQuantidade, setDadoQuantidade] = useState(false)
    const [dadoQuantidadeAtual, setQuantidadeAtua] = useState(false)
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [updateCount, setUpdateCount] = useState(0)

    const [vendedorSelecionado, setVendedorSelecionado] = useState(null); 
    const [listaVendedores, setListaVendedores] = useState([]);

    const handleVendedorChange = (value) => {
        setVendedorSelecionado(value);
        setUpdateCount(prev => prev + 1); 
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (listaVendedores.length === 0 && isAdmin) {
                    const dataUsuarios = await getUsuarios();
                    if (Array.isArray(dataUsuarios)) {
                        setListaVendedores(dataUsuarios);
                    }
                }
                const idParaBusca = vendedorSelecionado || null;
                const [dataAno, dataMes, dataQuantidade, dataQuantidadeAtual] = await Promise.all([
                    getDadoAno(anoSelecionado, idParaBusca),
                    getDadoMesAtual(idParaBusca),
                    getDadoQuantidade(anoSelecionado, idParaBusca),
                    getQuantidadeAtua(idParaBusca),
                ]);

                setDadoAno(dataAno);
                setDadoMesAtual(dataMes);
                setDadoQuantidade(dataQuantidade);
                setQuantidadeAtua(dataQuantidadeAtual);

            } catch (error) {
                console.error("Erro ao carregar dados do painel :", error);
                setDadoAno(false); 
                setDadoMesAtual(false);
                setDadoQuantidade(false);
                setQuantidadeAtua(false);

            } finally {
                setUpdateCount(false); 
            }
        };
        fetchData();

    }, [anoSelecionado, vendedorSelecionado])
 

    
    return(
    <>
    {dadoAno&&dadoMesAtual&&dadoQuantidade&&dadoQuantidadeAtual?
    <>
    <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary border border-secondary h-100 py-2">
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
            <div class="card border-left-success border border-secondary h-100 py-2">
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
            <div class="card border-left-danger border border-secondary h-100 py-2">
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
            <div class="card border-left-info border border-secondary h-100 py-2">
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
    {isAdmin&&<div className=" d-block d-md-flex">
        <div className="mb-4 mr-3">
            <label className="form-label d-block">Vendedor:</label>
            <Select
                allowClear
                placeholder="Todos os Vendedores"
                style={{ width: 200 }}
                value={vendedorSelecionado}
                onChange={handleVendedorChange}
            >
                {listaVendedores.map(vendedor => (
                    <Option key={vendedor.idUsuario} value={vendedor.idUsuario}>
                        {vendedor.username}
                    </Option>
                ))}
            </Select>
        </div>
        <div className="mt-auto mb-4 d-flex flex-row-reverse d-md-block">
            <AntButton 
                onClick={() => handleVendedorChange(null)}
                type="default"
                icon={<i className="fas fa-eraser"></i>}
                disabled={!vendedorSelecionado} 
            >
                Limpar Vendedor
            </AntButton>
        </div>
   </div>}
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
