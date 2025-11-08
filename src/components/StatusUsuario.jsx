import React, { useState, useEffect, useCallback } from 'react';
import { editarStatusUsuario } from '../FranciscoTourService';

const STATUS_USER = {
    ATIVO: { status: 'ATIVO', className: "badge badge-success" },
    BLOQUEADO: { status: 'BLOQUEADO', className: "badge badge-danger" }
};



export default function StatusUsuario({ idUsuario, acesso, initialStatus, setUpdateKey }) {

    const getInitialStatus = (status) => {
        if(status === 'ATIVO') return { status: 'ATIVO', className: "badge badge-success" }
        if(status === 'BLOQUEADO') return { status: 'BLOQUEADO', className: "badge badge-danger" }
    };

    const tipoAcesso = (tipo) => {
        return tipo === 'VENDEDOR';
    }

    const [statusLocal, setStatusLocal] = useState(() => getInitialStatus(initialStatus));

    useEffect(() => {
        setStatusLocal(getInitialStatus(initialStatus));
    }, [initialStatus, idUsuario]);

    const handleChange = useCallback(async (newStatusValue) => {

        try {
            if(newStatusValue){
                await editarStatusUsuario(idUsuario, { status: newStatusValue });           
                setUpdateKey(prev => prev + 1);
            }

        } catch (err) {
            console.error("Erro ao atualizar status do Usuário:", err);
        }
    }, [idUsuario, initialStatus, setUpdateKey]);

    return (
        <div className="dropdown">

            {tipoAcesso(acesso)?<a type="button" data-toggle="dropdown" aria-expanded="false">
                <span title={statusLocal.status} className={statusLocal.className}>{statusLocal.status}</span>
            </a>: <span title={statusLocal.status} className={statusLocal.className}>{statusLocal.status}</span>}
            {tipoAcesso(acesso)&&<div style={{ minWidth: "40px" }} className="dropdown-menu">
                
                <button 
                    className="dropdown-item" 
                    value='ATIVO'
                    onClick={() => handleChange(STATUS_USER.ATIVO.status)}
                >
                    <span ><i className='fas fa-check-circle text-success'></i> {STATUS_USER.ATIVO.status}</span> 
                </button>
                <button 
                    className="dropdown-item" 
                    value='BLOQUEADO'
                    onClick={() => handleChange(STATUS_USER.BLOQUEADO.status)}
                >
                    <span><i className='fas fa-ban text-danger'></i> {STATUS_USER.BLOQUEADO.status}</span> 
                </button>
            </div>}
        </div>
    );
}