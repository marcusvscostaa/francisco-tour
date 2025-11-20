import { useState, useEffect } from 'react';
import { createTourCadastro, updateTourCadastro } from '../../FranciscoTourService.js';
import optionForm from "../lista.json"

export default function ModalCriarTourCadastro(props) {
    const [formData, setFormData] = useState({
        destino: '',
        nome_tour: '',
        valor_adulto: 0,
        valor_crianca: 0,
        custo_adulto: 0,
        custo_crianca: 0
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [shouldUpdateParent, setShouldUpdateParent] = useState(false);

    const isEditing = !!props.tourParaEdicao;
    const modalTitle = isEditing ? "Editar Tour" : "Novo Tour de Cadastro";
    const modalId = isEditing ? `modalEditarTourCadastro-${props.tourParaEdicao.id_tour}` : 'modalCriarTourCadastro';

    useEffect(() => {
        const $modal = window.jQuery ? window.jQuery(`#${modalId}`) : null;
        if (isEditing) {
            setFormData({
                destino: props.tourParaEdicao.destino || '',
                nome_tour: props.tourParaEdicao.nome_tour || '',
                valor_adulto: parseFloat(props.tourParaEdicao.valor_adulto) || 0,
                valor_crianca: parseFloat(props.tourParaEdicao.valor_crianca) || 0,
                custo_adulto: parseFloat(props.tourParaEdicao.custo_adulto) || 0,
                custo_crianca: parseFloat(props.tourParaEdicao.custo_crianca) || 0,
            });
        } else {
             setFormData({ destino: '', nome_tour: '', valor_adulto: 0, valor_crianca: 0, custo: 0 });
        }

        const handleModalHidden = () => {
            if (shouldUpdateParent && props.setUpdateCount) {
                props.setUpdateCount(prev => !prev);
                setShouldUpdateParent(false); 
            }
            setMessage(null);

        };

        if ($modal && $modal.length) {
            $modal.on('hidden.bs.modal', handleModalHidden);
            return () => {
                $modal.off('hidden.bs.modal', handleModalHidden);
            };
        }
    }, [modalId, props.tourParaEdicao, shouldUpdateParent, props.setUpdateCount]); 
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.startsWith('valor') ? parseFloat(value) || 0 : value,
        }));
        setMessage(null); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let response;
            
            if (isEditing) {
                const id_tour = props.tourParaEdicao.id_tour;
                response = await updateTourCadastro(id_tour, formData);
                setMessage({ type: 'success', text: `Tour ID ${id_tour} atualizado!` });
            } else {
                response = await createTourCadastro(formData);
                setMessage({ type: 'success', text: `Tour "${response.nome_tour}" criado!` });
                setFormData({ destino: '', nome_tour: '', valor_adulto: 0, valor_crianca: 0 }); 
            }
            setMessage({ type: 'success', text: `Operação realizada com sucesso! Fechando...` });

            setShouldUpdateParent(true);
            setTimeout(() => {

                if (window.jQuery) {
                    window.jQuery(`#${modalId}`).modal('hide');
                } else {
                    document.querySelector(`#${modalId} [data-dismiss="modal"]`)?.click();
                }   

            }, 2000);

        } catch (error) {
            console.error('Erro:', error);
            setMessage({ type: 'error', text: 'Falha na operação. Verifique os dados.' });
            setShouldUpdateParent(false);
        } finally {
            setLoading(false);
        }
    };

    const renderValue = (field) => {
        return formData[field] === 0 ? '' : formData[field];
    };
    

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="modalCriarTourCadastroLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalCriarTourCadastroLabel">
                            <i className="fas fa-plus-circle mr-2"></i> {modalTitle}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            
                            {message && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
                                    {message.text}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="destino">Destino:</label>
                                <select name='destino' 
                                        value={formData.destino} 
                                        className="form-control form-control-sm" 
                                        id="detino" 
                                        onChange={handleChange} 
                                        required>
                                    <option value="" disabled>
                                        Selecione o Destino
                                    </option>  
                                        {optionForm&& optionForm.destino.map((item) => {
                                            return <option value={item}>{item}</option>
                                        })}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="nome_tour">Nome do Tour:</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    id="nome_tour" 
                                    name="nome_tour" 
                                    value={formData.nome_tour} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="valor_adulto">Valor Adulto (R$):</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="form-control form-control-sm" 
                                        id="valor_adulto" 
                                        name="valor_adulto" 
                                        value={renderValue('valor_adulto')} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="valor_crianca">Valor Criança (R$):</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="form-control form-control-sm" 
                                        id="valor_crianca" 
                                        name="valor_crianca" 
                                        value={renderValue('valor_crianca')} 
                                        onChange={handleChange} 
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="custo_adulto">Custo (R$):</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="form-control form-control-sm" 
                                        id="custo_adulto" 
                                        name="custo_adulto" 
                                        value={renderValue('custo_adulto')} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="custo_crianca">Custo (R$):</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        className="form-control form-control-sm" 
                                        id="custo_crianca" 
                                        name="custo_crianca" 
                                        value={renderValue('custo_crianca')} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" disabled={loading}>
                                Fechar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Cadastro'
                                )}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}