import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { Table, Tag } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import ModalEstorno from "./ModalEstorno.jsx";
import { useAuth } from '../context/AuthContext.jsx'; 


DataTable.use(DT);

export default function TabelaFinanceiro(props) {
    const {  userRole } = useAuth();
    const isAdmin = userRole === "ADMIN";
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);   
    
    useEffect(() => {
    },[props.updateCount])

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const getEstornoBadge = (record) => {
        const valorTotal = record.valorTotalCalculado;
        const pagamento = record.valorPagoCalculado;
        const calculoEstorno = record.valorEstornoPagoCalculado;
        const saldoDevido = pagamento - valorTotal;
        return saldoDevido > 0 || calculoEstorno > 0?
        <a href='' title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#estorno${record.idR}`}>
            { calculoEstorno === 0 && <Tag title='Adicionar Estorno' color='error'>NÃO DEVOLVIDO</Tag>}
            { calculoEstorno < saldoDevido && calculoEstorno > 0 &&<Tag title='Adicionar Estorno'color='warning'>INCOMPLETO</Tag>}
            { calculoEstorno === saldoDevido &&<Tag title='Ver Estorno'color='success'>DEVOLVIDO</Tag>}
            { calculoEstorno > saldoDevido &&<Tag title='Ver Estorno'color='blue'>EXCEDENTE</Tag>}
            <ModalEstorno valorTotal={saldoDevido > 0 ?pagamento - valorTotal:0} updateCount={props.updateCount} setUpdateCount={props.setUpdateCount} idR={record.idR} formatarMoeda={props.formatarMoeda}/>
        </a>
        :'SEM ESTORNO';
    };

    const reservasFiltradas = useMemo(() => {
        let filtrado = props.reservas;
        if (props.vendedorSelecionado && isAdmin) {
            filtrado = filtrado.filter(reserva => 
                reserva.vendedor && reserva.vendedor.toUpperCase() === props.vendedorSelecionado.toUpperCase()
            );
        }

        if (props.dataInicio && props.dataFim) {
            const inicioTimestamp = new Date(props.dataInicio).getTime(); 

            const dataFimObj = new Date(props.dataFim);
            dataFimObj.setDate(dataFimObj.getDate() + 1); 
            const fimTimestamp = dataFimObj.getTime() - 1; 

            filtrado = filtrado.filter(reserva => {
                const dataReservaTimestamp = new Date(reserva.dataReserva).getTime(); 
                return dataReservaTimestamp >= inicioTimestamp && dataReservaTimestamp <= fimTimestamp;
            });
        }

        if (props.filtroBusca) {
            const termo = props.filtroBusca.toLowerCase().trim();

            filtrado = filtrado.filter(reserva => {
                const idMatch = reserva.idR?.toLowerCase().includes(termo);
                const nomeMatch = reserva.nomeExibido?.toLowerCase().includes(termo);
                return idMatch || nomeMatch;
            });
        }
        
        return filtrado;
    }, [props.reservas, props.vendedorSelecionado, props.filtroBusca, props.dataInicio, props.dataFim]);

    const columns = useMemo(() => [
        { 
            title: 'ID Reserva', 
            dataIndex: 'idR', 
            key: 'idR', 
            width: 120, sorter: (a, b) => a.idR.localeCompare(b.idR) 
        },
        { 
            title: 'Nome', 
            dataIndex: 'nomeExibido', 
            key: 'nomeExibido', sorter: (a, b) => a.nome.localeCompare(b.nome), 
            width: 150 
        },
        { 
            title: 'Data', 
            dataIndex: 'dataReserva', 
            key: 'dataReserva', 
            sorter: (a, b) => new Date(a.dataReserva) - new Date(b.dataReserva), 
            defaultSortOrder: 'descend',
            render: (text) => text ? text.substr(0, 10).split('-').reverse().join('/') : '', 
            width: 100 
        },
        {  
            title: 'Total', 
            dataIndex: 'valorTotalCalculado',
            key: 'valorTotalCalculado', 
            render: (text) => `R$ ${props.formatarMoeda(text)}`, 
            width: 100 
        },
        { 
            title: 'Pago', 
            dataIndex: 'valorPagoCalculado', 
            key: 'valorPagoCalculado', 
            render: (_, record) => {
                return <span className={record.valorPagoCalculado > 0 ? 'text-success' : ''}>R$ {props.formatarMoeda(record.valorPagoCalculado)}</span>;
            },
            width: 100
        },
        { 
            title: 'Devido', 
            dataIndex: 'valorDevidoCliente', 
            key: 'devido',
            render: (_, record) => {
                const devido = Math.max(0, record.valorTotalCalculado - record.valorPagoCalculado);
                return <span className={devido > 0 ? 'text-danger' : ''}>R$ {props.formatarMoeda(devido)}</span>;
            },
            width: 100 
        },
        { 
            title: 'Estorno', 
            dataIndex: 'valorEstornoPagoCalculado', 
            key: 'estornoDevolver',
            render: (_, record) => {
                const aDevolver = Math.max(0, record.valorPagoCalculado - record.valorTotalCalculado);
                return <span className={aDevolver > 0 ? 'text-danger' : ''}>R$ {props.formatarMoeda(aDevolver)}</span>;
            },
            width: 100
        },
        { title: 'Sts Estorno', key: 'statusEstorno', width: 100, 
            render:getEstornoBadge
        },
    ], [props.formatarMoeda]);
    return (

        <div className="table-responsive card border border-secondary mb-5">
            {props.reservas ?
                <Table
                    rowKey="idR"
                    bordered={true}
                    columns={columns}
                    dataSource={reservasFiltradas} 
                    loading={false} 
                    size="small"
                    scroll={{ y: 450 }}
                    pagination={{ 
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true, 
                        pageSizeOptions: ['10', '25', '50', '100'], 
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
                        className: 'pagination-centered',
                    }}
                    onChange={(pagination, filters, sorter) => handleTableChange(pagination)}
                />
                : <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
        </div>

    )
}