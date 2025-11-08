import React, { useState, useEffect, useCallback } from 'react';
import { Tag } from 'antd';
import { editarStatusTours } from '../../FranciscoTourService.js'; 

const STATUS = {
    CONFIRMADO: { status: 'Confirmado', color: 'success', className: "fas fa-check-circle text-success" },
    CANCELADO: { status: 'Cancelado', color: 'error', className: "fas fa-ban text-danger" }
};

const getStatusObject = (status) => {
    return STATUS[status] || STATUS.CONFIRMADO;
};

export default function StatusTourDropdown({ tourRecord, setUpdateCount }) {
    const [statusLocal, setStatusLocal] = useState(() => getStatusObject(tourRecord.status));

    useEffect(() => {
        setStatusLocal(getStatusObject(tourRecord.status.toUpperCase()));
    }, [tourRecord.status]);

    const handleChange = useCallback(async (newStatusValue) => {
        
        try {
            setStatusLocal(getStatusObject(newStatusValue.toUpperCase())); 
            
            await editarStatusTours({ status: newStatusValue, idtour: tourRecord.idtour }); 

            setUpdateCount(prev => prev + 1);

        } catch (err) {
            console.error("Erro ao atualizar status do Tour:", err);
            setStatusLocal(getStatusObject(tourRecord.status.toUpperCase())); 
        }
    }, [tourRecord.idtour, tourRecord.status]);

    return (
        <div className="dropdown">
            <a type="button" data-toggle="dropdown" aria-expanded="false">
                <Tag color={statusLocal.color} title={statusLocal.status} style={{ cursor: 'pointer' }}>
                    <i className={statusLocal.className}></i> {statusLocal.status}
                </Tag>
            </a>
            <div style={{ minWidth: "40px" }} className="dropdown-menu">
                {Object.values(STATUS).map(option => (
                    <button 
                        key={option.status}
                        className="dropdown-item" 
                        onClick={() => handleChange(option.status)}
                    >
                        <i className={option.className}></i> {option.status}
                    </button>
                ))}
            </div>
        </div>
    );
}