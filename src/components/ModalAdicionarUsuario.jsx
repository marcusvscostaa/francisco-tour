import React, { useState, useCallback } from "react";
import ModalAlert from "./ModalAlert";
import { createUsuario } from '../FranciscoTourService'; 

export default function ModalAdicionarUsuario({ setUpdateKey, id }) {
    const MODAL_ID = `addUserModal`; 
    
    const [dataForm, setDataForm] = useState({
        username: '',
        password: '',
        acesso: 'ADMIN'
    });
    const [modalSpinner, setModalSpinner] = useState(false);
    const [modalStatus, setModalStatus] = useState([]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setDataForm((prevDado) => ({
            ...prevDado,
            [name]: value
        }));
    }, []);

    const resetForm = () => {
        setDataForm({
            username: '',
            password: '',
            acesso: 'ADMIN'
        });
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setModalSpinner(true);
        let success = false;
        
        try {
            if (!dataForm.username || !dataForm.password) {
                throw new Error("Usuário e Senha são obrigatórios.");
            }

            const response = await createUsuario(dataForm);
            
            if (response.data) {
                setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: true, message: "Sucesso ao Cadastrar Usuário", titulo: "Usuário"}]);
                success = true;
            } else {
                throw new Error('Erro de Conexão com banco de dados ou resposta vazia.');
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
            const message = error.message.includes("Erro de Conexão") 
                            ? error.message 
                            : "Erro ao Cadastrar Usuário: " + error.message;
                            
            setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: false, message: message , titulo: "Usuário"}]);
        } finally {
            setTimeout(() => {
                setModalStatus([]);
                setModalSpinner(false);
                if (success) {
                    resetForm(); 
                    setUpdateKey(prev => prev + 1); 
                    if (window.$) {
                        window.$(`#${MODAL_ID}`).modal('hide');
                    }
                }
            }, 3000);
        }
    }, [dataForm, setUpdateKey, MODAL_ID]);


    return (
        <div className="modal fade" tabIndex="-1" id={MODAL_ID} data-backdrop="static" data-keyboard="false" role="dialog" aria-hidden="true">
            <ModalAlert dados={modalStatus} />
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Adicionar Novo Usuário</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={resetForm}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <p>Usuário</p>
                            <input name="username" type="text" className="form-control mb-3" value={dataForm.username} onChange={handleChange} required/>
                            
                            <p>Senha</p>
                            <input name="password" type="password" className="form-control mb-2" value={dataForm.password} onChange={handleChange} required/>
                            
                            <label className="form-label">Acesso</label>
                            <select className="form-control form-control-sm" name="acesso" value={dataForm.acesso} onChange={handleChange} required> 
                                <option value='ADMIN'>ADMIN</option>
                                <option value='VENDEDOR'>VENDEDOR</option> 
                                <option value='GUIA'>GUIA</option> 
                                <option value='MOTORISTA'>MOTORISTA</option> 
                                <option value='AGENCIA'>AGENCIA</option> 

                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" disabled={modalSpinner}>
                                {modalSpinner ? 'Cadastrando...' : 'Cadastrar'} 
                                {modalSpinner && <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>}
                            </button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={resetForm}>Fechar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}