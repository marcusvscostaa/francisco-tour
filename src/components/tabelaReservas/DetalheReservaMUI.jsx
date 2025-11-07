import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Button as AntButton, Typography } from 'antd';
import { getToursByReservaId } from '../../FranciscoTourService.js'; 

import ModalAdicionarTour from '../ModalAdiconarTour.jsx';
import ModalDeleteTour from '../ModalDeleteTour.jsx';
import ModalEditarTour from '../ModalEditarTour.jsx';
import StatusTour from '../StatusTour.jsx'; 

const TOUR_STATUS_MAP = {
    'Confirmado': 'success',
    'Cancelado': 'error',
};

export default function DetalheReservaMUI({ reserva, setUpdateCount }) {
    const [dadosTour, setDadosTour] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getToursByReservaId(reserva.idR)
            .then(data => setDadosTour(data))
            .catch(error => {
                console.error("Erro ao buscar tours da reserva:", error);
                setDadosTour([]);
            })
            .finally(() => setLoading(false));
    }, [reserva.idR, setUpdateCount]); 

    const sortedTours = useMemo(() => {
        return [...dadosTour].sort((a, b) => {
            const dateA = new Date(a.data.substr(0, 10));
            const dateB = new Date(b.data.substr(0, 10));
            return dateB - dateA; 
        });
    }, [dadosTour]);
    
    const tourColumns = [
        { title: 'Tour', dataIndex: 'tour', key: 'tour', width: 150 },
        { title: 'Data', dataIndex: 'data', key: 'data', render: (text) => text.substr(0, 10).split('-').reverse().join('/') },
        { title: 'Adultos', dataIndex: 'quantidadeAdultos', key: 'adultos', width: 80 },
        { title: 'Valor Adulto',key: 'valorAdultos', render: (record) => `R$ ${record.valorAdulto.toFixed(2).replace(".", ",")}` },
        { title: 'Crianças', dataIndex: 'quantidadeCriancas', key: 'Criancas', width: 80 },
        { title: 'Valor Criança',key: 'valorCrianca', render: (record) => `R$ ${record.valorCrianca.toFixed(2).replace(".", ",")}` },
        { title: 'Total', key: 'total', render: (record) => `R$ ${((record.quantidadeAdultos * record.valorAdulto) + (record.quantidadeCriancas * record.valorCrianca)).toFixed(2).replace(".", ",")}` },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => (
            <Tag color={TOUR_STATUS_MAP[status] || 'default'}>{status}</Tag>
        )},
        {
            title: 'Ações',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <AntButton size="small" title="Editar" icon={<i className="fas fa-edit"></i>} />
                    <AntButton size="small" danger title="Deletar" icon={<i className="fa fa-trash"></i>} />
                </div>
            )
        },
    ];

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }} className='bg-dark text-white'>Carregando Tours...</div>;
    }
    
    return (
        <div style={{ padding: '15px' }} className='bg-dark'> 
            <Typography.Title level={5} className='text-white'>Informações Adicionais</Typography.Title>
            
            <div style={{ marginBottom: 15 }}>
            <address className='text-white'>
                {reserva.idR && <> <span className="badge badge-secondary"><i className='fas fa-hot-tub'></i> ID Reserva: </span> {reserva.idR}<br/></>}
                {reserva.endereco && <> <span className="badge badge-secondary"><i className='fas fa-map-marker-alt'></i> Endereço: </span> {reserva.endereco}<br/></>}
                {reserva.hotel && <> <span className="badge badge-secondary"><i className='fas fa-hotel'></i> Hotel: </span> {reserva.hotel}</>}
                {reserva.quarto && <> <span className="badge badge-secondary"><i className='fas fa-bed'></i> Quarto: </span> {reserva.quarto}<br/></>}
                {reserva.zona && <> <span className="badge badge-secondary"><i className='fas fa-city'></i> Zona: </span> {reserva.zona}<br/></>}
                {reserva.telefone && (
                    <>
                        <a 
                            href={`https://api.whatsapp.com/send?phone=${reserva.telefone}`} 
                            title="Abrir Whatsapp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        > <span className="badge badge-light">
                                <i className='fas fa-phone'></i> Telefone: {reserva.telefone}
                            </span> 
                        </a> 
                        <br/>
                    </>
                )}
            </address>
            </div> 

            <Table
                rowKey="idtour"
                columns={tourColumns}
                dataSource={sortedTours}
                pagination={false}
                size="small"
            />

            {/* BOTÃO ADICIONAR TOUR */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <AntButton type="primary" icon={<i className="fas fa-plus-circle"></i>} >
                    Adicionar Tour
                </AntButton>
            </div>
        </div>
    );
}