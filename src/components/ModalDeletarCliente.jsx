import { useEffect, useState, useCallback } from "react";
import ModalAlert from "./ModalAlert"
import { getReservaFind, deletarPagamentoReserva, deletarReservaTour, deletarReserva, deletarCliente } from "../FranciscoTourService"; 

export default function ModalDeletarCliete(props) {
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [reservas, setReservas] = useState(null); 
    const [carregando, setCarregando] = useState(false);
    const MODAL_ID = `clienteDelete${props.id}`;
    
    const fetchReservas = useCallback(async (clienteId) => {
        setCarregando(true);
        setReservas(null); 
        try {
            const data = await getReservaFind(clienteId);
            if (data.fatal || data.code) {
                setReservas([]);
            } else {
                const sorted = data.sort((a, b) => new Date(b.dataReserva) - new Date(a.dataReserva));
                setReservas(sorted);
            }
        } catch (e) {
            console.error("Erro ao carregar reservas:", e);
            setReservas([]);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        if (props.clicado === props.id) {
            fetchReservas(props.id);
        }
    }, [props.clicado, props.id, fetchReservas]);


    const handerDelete = async () => {
        if (!reservas) return;

        setModalSpinner(true);
        let success = true;
        const reservasIds = reservas.map(r => r.idR);
        
        try {
            if (reservasIds.length > 0) {
                // Criamos um array de promessas que devem todas ser bem-sucedidas.
                const deletePromises = [];
                
                for (const idR of reservasIds) {
                    // Adicionamos as promessas de exclusão de Pagamentos e Tours
                    // Não usamos .catch() aqui; deixamos o try/catch externo lidar com o erro.
                    deletePromises.push(deletarPagamentoReserva(idR));
                    deletePromises.push(deletarReservaTour(idR));
                }
                
                // Aguardamos todas as exclusões de Pagamentos e Tours.
                // Se alguma falhar, o Promise.all lança um erro e move para o bloco catch.
                await Promise.all(deletePromises);
                
                setModalStatus(prev => [...prev, { id: 1, mostrar: true, status: true, message: `Pagamentos e Tours de ${reservasIds.length} Reservas Excluídos!`, titulo: "Dependências" }]);
            } else {
                setModalStatus(prev => [...prev, { id: 1, mostrar: true, status: true, message: "Nenhuma dependência de Reserva encontrada.", titulo: "Dependências" }]);
            }
            
            if (reservasIds.length > 0) {
                await Promise.all(reservasIds.map(idR => deletarReserva(idR)));
                setModalStatus(prev => [...prev, { id: 2, mostrar: true, status: true, message: `Reservas Excluídas!`, titulo: "Reservas" }]);
            }
            
            await deletarCliente(props.id);
            setModalStatus(prev => [...prev, { id: 3, mostrar: true, status: true, message: "Sucesso ao Excluir Cliente", titulo: "Cliente" }]);

        } catch (error) {
            console.error("Erro fatal ao deletar:", error);           
            const errorMessage = error.code === '23503' || error.constraint === 'fk_pagamentoreservas_reservas1' 
                ? "Falha na exclusão! Certifique-se de que o Pagamento de todas as reservas foi removido no banco de dados." 
                : `Exclusão Falhou: ${error.message}`;

            setModalStatus(prev => [...prev, { id: 4, mostrar: true, status: false, message: errorMessage, titulo: "ERRO FATAL" }]);
            success = false;
        } finally {
            setTimeout(() => {
                setModalStatus([]);
                setModalSpinner(false);
                
                if (success) {
                    props.setUpdateCount(prevCount => prevCount + 1); 
                    if (window.$) {
                        window.$(`#${MODAL_ID}`).modal('hide');
                    }
                }
            }, 3000);
        }
    };

    return (
        <div className="modal fade" 
             tabIndex="-1" 
             id={MODAL_ID}          
             data-backdrop="static" 
             data-keyboard="false"
        >
            <ModalAlert dados={modalStatus} />

            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Excluir dados de {props.dados.nome}</h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p style={{ fontSize: '1.2rem' }} className="font-weight-normal">
                            Todos os dados serão <span className="badge badge-danger text-monospace" >excluídos permanentemente</span>,
                            inclusive <span className="badge badge-danger text-monospace">Reservas, pagamentos e tours</span> relacionados a {props.dados.nome}.
                            Você realmente deseja excluir os dados do cliente ?
                        </p>
                        
                        {/* Tabela de Reservas */}
                        {carregando ? ( 
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Carregando Reservas...</span>
                                </div>
                            </div>
                        ) : reservas && reservas.length > 0 ? (
                            <table className="table table-sm table-bordered ">
                                <thead>
                                    <tr>
                                        <th>ID Reserva</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Exibe as reservas ordenadas */}
                                    {reservas.map((dado) => (
                                        <tr key={dado.idR}>
                                            <td>{dado.idR}</td>
                                            <td>{dado.dataReserva.substr(0, 10).split('-').reverse().join('/')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (<p>Sem Reservas</p>)}
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="button" className="btn btn-danger" onClick={handerDelete} disabled={modalSpinner} ><i className="fa fa-trash"></i> Sim</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Não</button>
                    </div>
                    {modalSpinner && <div className="position-absolute w-100 h-100 d-flex" style={{ backgroundColor: 'rgba(0, 0, 0, .2)' }}>
                        <div className="spinner-border text-secondary m-auto" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}