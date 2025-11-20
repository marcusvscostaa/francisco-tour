import { useEffect, useState } from "react";
import ModalAdiconarReserva from "./ModalAdiconarReserva";
import ModalEditarCliente from "./ModalEditarCliente";
import {getClientes} from "../FranciscoTourService";
import { Table, Card } from 'antd';


export default function Tabela(props) {
    const [clients, setClients] = useState([]);
    const [updateCount, setUpdateCount] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {

        setTimeout(() => {
            getClientes().then(
                data => {
                    if(data.fatal || data.code){
                        setClients([]);
                    }else{
                        setClients(data)
                    }    
                }
                ).catch((error) => console.log(error));
            },"300")

        setUpdateCount(false)

    }, [updateCount]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
            sorter: (a, b) => a.nome.localeCompare(b.nome),
            render: (nome) => (
                <>
                    <i className="fas fa-user-alt"></i>&nbsp;{nome}
                </>
            ),
            width: 250,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <>
                    <i className="fa fa-envelope"></i>&nbsp;{email}
                </>
            ),
            width: 250,
        },
        {
            title: 'Telefone',
            dataIndex: 'telefone',
            key: 'telefone',
            render: (telefone) => (
                <a href={`https://api.whatsapp.com/send?phone=${telefone}`} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-phone"></i>&nbsp;{telefone}
                </a>
            ),
            width: 150,
        },
        {
            title: 'País Origem',
            dataIndex: 'paisOrigem',
            key: 'paisOrigem',
            render: (paisOrigem) => (
                <>
                    <i className="fas fa-globe-americas"></i>&nbsp;{paisOrigem}
                </>
            ),
            width: 120,
        },
        {
            title: 'Idioma',
            dataIndex: 'idioma',
            key: 'idioma',
            render: (idioma) => (
                <>
                    <i className="fa fa-language"></i>&nbsp;{idioma}
                </>
            ),
            width: 120,
        },
        {
            title: 'Configurações',
            key: 'acoes',
            render: (text, client) => ( 
                <>
                    <button type="button" data-toggle="modal" data-target={`#mr${client.id}`} title="Adicionar Reserva" className="btn btn-sm mr-2 btn-primary"> 
                        <i className="fas fa-hot-tub"></i> <i className="fa fa-plus"></i>
                    </button>
                    <ModalAdiconarReserva dados={client} id={client.id} />

                    <button type="button" data-toggle="modal" data-target={`#clienteEditar${client.id}`} title="Editar" className="btn btn-sm mr-2 btn-warning">
                        <i className="fas fa-edit"></i>
                    </button>
                    <ModalEditarCliente setUpdateCount={setUpdateCount} dados={client} id={client.id}/>
                </>
            ),
            width: 120,
        },
    ];


    return (
        <div className="table-responsive card border border-secondary mb-5">

            <Table
                dataSource={clients} 
                columns={columns}   
                rowKey="id"
                loading={clients.length===0}
                bordered={true}         
                pagination={{ 
                            current: currentPage,
                            pageSize: pageSize,
                            showSizeChanger: true, 
                            pageSizeOptions: ['10', '25', '50', '100'], 
                            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
                            className: 'pagination-centered',
                        }}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination)}
                size="small"
                scroll={{ 
                    y: 450
                }}
            />
        </div>                

    )
}