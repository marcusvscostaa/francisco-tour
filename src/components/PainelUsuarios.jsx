import { useState } from "react";
import TabelaUsuarios from "./TabelaUsuários";
import ModalAdicionarUsuario from './ModalAdicionarUsuario';

export default function PainelUsuario(){
    
    const [updateKey, setUpdateKey] = useState(0); 
    const handleUpdate = () => {
        setUpdateKey(prev => prev + 1);
    };

    const MODAL_ID = "addUserModal";
    return(
        <>
        <div className="d-flex justify-content-end mb-3">
            <button 
                type="button" 
                className="btn btn-sm btn-primary" 
                data-toggle="modal" 
                data-target="#addUserModal"
            >
                <i className="fas fa-plus-circle"></i> Adicionar Usuário
            </button>
        </div>
        <ModalAdicionarUsuario                         
            setUpdateKey={handleUpdate} 
            id={MODAL_ID}/>
       
        <TabelaUsuarios 
            updateKey={updateKey} 
            handleUpdate={handleUpdate}
        />


        </>
    )
}