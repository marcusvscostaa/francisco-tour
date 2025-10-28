import React, { useState, useEffect } from 'react';
import { deleteTourCadastro } from '../../FranciscoTourService'; 

export default function ModalDeleteTourCadastro(props) {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldUpdateParent, setShouldUpdateParent] = useState(false);

    const modalId = `modalDeletarTourCadastro-${props.id_tour}`;
    const nomeTour = props.nome_tour || 'este tour'; 

    useEffect(() => {
        const $modal = window.jQuery ? window.jQuery(`#${modalId}`) : null;
        const handleModalHidden = () => {
            if (shouldUpdateParent && props.setUpdateCount) {
                props.setUpdateCount(prev => !prev);
                setShouldUpdateParent(false); 
            }
        };

        if ($modal && $modal.length) {
            $modal.on('hidden.bs.modal', handleModalHidden);
            return () => {
                $modal.off('hidden.bs.modal', handleModalHidden);
            };
        }
    }, [modalId, shouldUpdateParent, props.setUpdateCount]);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {            
            setShouldUpdateParent(true);
            
            if (window.jQuery) {
                window.jQuery(`#${modalId}`).modal('hide');
            } else {
                document.querySelector(`#${modalId} [data-dismiss="modal"]`)?.click();
           }

        } catch (err) {
            console.error('Erro ao deletar tour:', err);
            setError('Não foi possível deletar o tour. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby={`${modalId}Label`} aria-hidden="true">
            <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h5 className="modal-title text-danger" id={`${modalId}Label`}>
                            <i className="fas fa-exclamation-triangle mr-2"></i> Confirmar Exclusão
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <p>Você tem certeza que deseja **EXCLUIR PERMANENTEMENTE** o tour:</p>
                        <p className="font-weight-bold text-center text-dark">"{nomeTour}" (ID: {props.id_tour})?</p>
                        <p className="text-muted small">Essa ação é irreversível.</p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={loading}>
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={handleDelete} 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <>
                                    <i className="fa fa-trash mr-1"></i> Deletar
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}