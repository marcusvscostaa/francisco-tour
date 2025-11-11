import { useEffect, useState } from "react";
import PainelGrafico from "./PainelGrafico";
import TabelaFinanceiro from "./TabelaFinanceiro";
import {getPagamentoReservaValorMes, getReservas, getTours, getPagamentoReservas, getEstorno, getUsuarios} from "../FranciscoTourService";
import { Table, Tag, Button as AntButton, Select, DatePicker, Input } from 'antd'; 
import { useAuth } from '../context/AuthContext.jsx'; 

const { Option } = Select;
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
    const {  userRole } = useAuth();
    const isAdmin = userRole === "ADMIN";
    const [dadoAno, setDadoAno] = useState('')
    const [reservas, setReservas] = useState(false);
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [updateCount, setUpdateCount] = useState(false)
    const [updateData, setUpdateData] = useState(false);

    const [vendedorSelecionado, setVendedorSelecionado] = useState(null); 
    const [listaVendedores, setListaVendedores] = useState([]);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [filtroBusca, setFiltroBusca] = useState('');

    useEffect(()=>{

        const fetchData = async () => {
        try {
            const usuarioEncontrado = vendedorSelecionado&&listaVendedores.find(usuario => usuario.username === vendedorSelecionado);

            const idParaBusca = usuarioEncontrado ? usuarioEncontrado.idUsuario : null;
            if (listaVendedores.length === 0 && isAdmin) {
                    const dataUsuarios = await getUsuarios();
                    if (Array.isArray(dataUsuarios)) {
                        setListaVendedores(dataUsuarios);
                    }
                }
            const dadoAnoPromise = getPagamentoReservaValorMes(anoSelecionado, idParaBusca);

            const [
                dataReservas                
            ] = await Promise.all([
                getReservas()
            ]);

            const dataAno = await dadoAnoPromise;

            if(dataAno.fatal || dataAno.code){
                setDadoAno(false);
            } else {
                setDadoAno(dataAno);
            }
            
            if (Array.isArray(dataReservas)) {
                const processedReservas = dataReservas.map(r => {
                    const partesDoNome = r.nome ? r.nome.trim().split(/\s+/) : [];
                    const nomeExibido = partesDoNome.length > 1 
                        ? `${partesDoNome[0]} ${partesDoNome[partesDoNome.length - 1]}`
                        : r.nome;
                    return { ...r, nomeExibido };
                });
                setReservas(processedReservas);
            } else { setReservas([]); }

        } catch (error) {
            console.error("Erro ao carregar dados do Financeiro:", error);
            setDadoAno(false);
            setReservas(false);
        } finally {
            setUpdateCount(false);
        }
    };

    fetchData();

    },[updateCount, anoSelecionado, listaVendedores, vendedorSelecionado])
    
    const handleSingleDateChange = (date, type) => {
        if (type === 'start') {
            setDataInicio(date);
        } else {
            setDataFim(date);
        }
    };

        const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setDataInicio(dates[0]);
            setDataFim(dates[1]);
        } else {
            setDataInicio(null);
            setDataFim(null);
        }
    };
    
    const handleClearFilters = () => {
        setVendedorSelecionado(null);
        setDataInicio(null);
        setDataFim(null);
        setFiltroBusca(null);
    };

    return(
    <>
    {dadoAno&&reservas?
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
        <div className="row pt-3 justify-content-between">
            <div className="col-md-2 mb-4">
                <label className="form-label">Buscar por Cliente ou ID</label>
                <Input
                    allowClear
                    prefix={<i className="fas fa-search" />}
                    placeholder="ID, Nome, ou Sobrenome"
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                />
            </div>
            {isAdmin&&<div className="col-md-2 mt-auto mb-4">
                <label className="form-label">Vendedor</label>
                <Select
                    allowClear
                    placeholder="Todos os Vendedores"
                    style={{ width: '100%' }}
                    value={vendedorSelecionado}
                    onChange={(value) => setVendedorSelecionado(value)}
                >
                    {listaVendedores.map(vendedor => (
                        <Option key={vendedor.id} value={vendedor.username}>
                            {vendedor.username}
                        </Option>
                    ))}
                </Select>
            </div>}

            <div className="col-md-4 mt-auto mb-4 d-none d-sm-block">
                <label className="form-label">Intervalo de Datas</label>
                <DatePicker.RangePicker 
                    style={{ width: '100%' }}
                    value={[dataInicio, dataFim]}
                    onChange={handleDateRangeChange}
                    format="DD/MM/YYYY"
                />
            </div>
            <div className="col-12 mb-4 d-sm-none">
                <label className="form-label">Data Início</label>
                    <DatePicker 
                        placeholder="Início"
                        className='mb-4'
                        style={{ width: '100%', marginBottom: '10px' }}
                        value={dataInicio}
                        onChange={(date) => handleSingleDateChange(date, 'start')}
                        format="DD/MM/YYYY"
                        getPopupContainer={trigger => trigger.parentElement || document.body} 
                    />
                
                <label className="form-label">Data Fim</label>
                    <DatePicker 
                        placeholder="Fim"
                        style={{ width: '100%' }}
                        value={dataFim}
                        onChange={(date) => handleSingleDateChange(date, 'end')}
                        format="DD/MM/YYYY"
                        minDate={dataInicio}
                        getPopupContainer={trigger => trigger.parentElement || document.body} 
                    />
            </div>
            
            <div className="col-md-3 mt-auto mb-4 d-flex flex-row-reverse d-sm-block">
                <AntButton
                    onClick={handleClearFilters}
                    icon={<i className="fas fa-eraser"></i>}
                    type="default"
                    disabled={!vendedorSelecionado && !dataInicio && !dataFim && !filtroBusca}
                >
                    Limpar Filtros
                </AntButton>
            </div>
        </div>
        <TabelaFinanceiro  
            dadoAno={dadoAno} 
            setUpdateCount={setUpdateCount} 
            updateCount={updateData} 
            reservas={reservas} 
            listaVendedores={listaVendedores} 
            formatarMoeda={formatarMoedaBRL} 
            vendedorSelecionado={vendedorSelecionado}
            dataInicio={dataInicio}
            dataFim={dataFim}
            filtroBusca={filtroBusca}
            
            />
    </>:<div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>}
    </>)
}