import { useEffect, useState, useMemo, useCallback } from "react"
import TourPag from "./TourPag"
import ModalAlert from "./ModalAlert";
import ModalDelete from "./ModalDelete";
import TabalaPagamento from "./TabelaPagamento";
import optionForm from "./lista.json"
import {createPagamento, editarPagamento, getPagamentosByReservaId } from "../FranciscoTourService";


export default function ModalPagamento(props){
    const [showAddPag, setShowAddPag] = useState(false)
    const [showEditPag, setShowEditPag] = useState({status: false})
    const [imagemUpload, setImagemUpload] = useState(false);
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: props.id});
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [options, setOptions] = useState("");
    const [pagamentosLocais, setPagamentosLocais] = useState([]); 
    const [loadingPagamentos, setLoadingPagamentos] = useState(true);
    const idReserva = props.id;

    const dadosPag = useMemo(() => {
        return pagamentosLocais},
        [pagamentosLocais]
    );

    const valorPagoAtual = useMemo(() => 
        dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) => sum + item.valorPago, 0),
        [dadosPag]
    );
    
    const valorRestante = useMemo(() => 
        props.valorTotal - valorPagoAtual,
        [props.valorTotal, valorPagoAtual]
    );

    const valorParaFormularioEdicao = useMemo(() => {
        if (!showEditPag.status) return valorRestante;
        const pagEditado = dadosPag.find(pag => pag.idPagamento === showEditPag.id);
        if (!pagEditado) return valorRestante;
        return props.valorTotal - (valorPagoAtual - pagEditado.valorPago);
    }, [valorRestante, showEditPag.status, showEditPag.id, dadosPag, valorPagoAtual, props.valorTotal]);

    const sortedPagamentos = [...dadosPag].sort((a, b) => {
        const dateA = new Date(a.dataPagamento.substr(0, 10));
        const dateB = new Date(b.dataPagamento.substr(0, 10));
        return dateB - dateA;
    });
    
    useEffect(()=>{
        const fetchPagamentos = async () => {
            setLoadingPagamentos(true);
            try {
                const data = await getPagamentosByReservaId(idReserva);
                setPagamentosLocais(data);
            } catch (error) {
                console.error("Erro ao buscar pagamentos:", error);
                setPagamentosLocais([]);
            } finally {
                setLoadingPagamentos(false);
            }
        };
        window.$('#modal'+props.id).on('shown.bs.modal',fetchPagamentos);
        setOptions(optionForm)
    },[idReserva, props.updateCount])
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = true; 

        try{
            const formData = new FormData();
            if(imagemUpload){formData.append("imagem", imagemUpload)};
            if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.valorRestante){formData.append("valorRestante", dadosPagForm.valorRestante);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}

            const pagamentoResponse = await createPagamento(formData);
            if (!pagamentoResponse.data) throw new Error('Falha ao Salvar Pagamento');
            
            setModalStatus(prev => [...prev, {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}]);

        }catch{
            success = false;
            const errorMessage = e.message.includes("Falha") ? e.message : `Erro de Conexão/Sistema: ${e.message}`;
            setModalStatus(prev => [...prev, {id:5, mostrar:true, status: false, message: errorMessage, titulo: "Erro Global"}]);
            console.error("Erro no fluxo de submissão:", e);
        }finally {            
            setTimeout(() => {
                setModalStatus([]); 
                props.setUpdateCount(prevCount => prevCount + 1);
                setShowEditPag({status: false})
            }, 3000); 
        }
    };

    const handerEdit = async (e) => {
        e.preventDefault();
        let success = true; 

        try{
            const formData = new FormData();
            if(imagemUpload){formData.append("imagem", imagemUpload)};
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}

            const pagamentoResponse = await editarPagamento(showEditPag.id ,formData);
            if (!pagamentoResponse.data) throw new Error('Falha ao Salvar Pagamento');
            
            setModalStatus(prev => [...prev, {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}]);

        }catch{
            success = false;
            const errorMessage = e.message.includes("Falha") ? e.message : `Erro de Conexão/Sistema: ${e.message}`;
            setModalStatus(prev => [...prev, {id:5, mostrar:true, status: false, message: errorMessage, titulo: "Erro Global"}]);
            console.error("Erro no fluxo de submissão:", e);
        }finally {            
            setTimeout(() => {
                setModalStatus([]); 
                props.setUpdateCount(prevCount => prevCount + 1);
                setShowEditPag({status: false})
            }, 3000); 
        }


    }


    return(        
    <div className="modal fade text-dark" id={`modal${props.id}`} data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
        <ModalAlert dados={modalStatus} />
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Dados Pagamento</h5>
                    <button className="close" type="button" onClick={() => setShowEditPag({status: false})} data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {loadingPagamentos ? (
                        <div className="d-flex justify-content-center py-5">
                            <div className="spinner-border text-secondary" role="status"></div>
                        </div>
                    ) : dadosPag.length !== 0 ? 
                        <>
                    <div className="table-responsive">
                    <table className="table table-sm table-bordered ">
                    <thead>
                        <tr>
                            <th>ID Pagamento</th>
                            <th>Data</th>
                            <th>Valor Pago</th>
                            <th>Comentário</th>
                            <th>Comprovante</th>
                            <th>Status</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                    {dadosPag&&sortedPagamentos.map( (pag) =>
                    <tr>
                        <TabalaPagamento updateCount={props.updateCount} disabledButton={props.disabledButton} setUpdateCount={props.setUpdateCount} pag={pag} />
                        <td>
                            <button type="button" className="btn btn-sm mr-2 btn-warning" onClick={() => setShowEditPag({status: true, id: pag.idPagamento})} disabled={showEditPag.status || showAddPag} ><i className="fas fa-edit	"></i></button>
                            {/* <button type="button" data-toggle="modal" data-target={`#deletePag${pag.idPagamento}`} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button> */}
                            {/* <ModalDelete title="Pagamento" setUpdateCount={props.setUpdateCount} idPag={pag.idPagamento}/> */}
                        </td>
                    </tr>
                        )}
                    </tbody>
                    </table>
                    </div>
                    <div  className="row ">
                    <div className=" border rounded mb-3 ml-auto col-4 mr-3">
                        <div className=" mb-4">
                                <div className="">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                            Valor Total
                                            <span>R$ {(props.valorTotal).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                            Valor Pago
                                            <span>R$ {dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Valor Restante</strong>                                            
                                            </div>
                                        <span><strong>R$ {(props.valorTotal - dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0)).toFixed(2).replace(".", ",")}</strong></span>
                                        </li>
                                    </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    </>
                    :<p>Não há dados de pagamento</p> }
                    {!showAddPag && !(showEditPag.status) && 
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" onClick={() => {setShowAddPag(true) 
                                setDadosPagForm({id_reserva: props.id})}}>
                                Adicionar Pagamento
                            </button>
                        </div>}
                    {showAddPag&& 
                    <form onSubmit={handleSubmit}>
                        <TourPag title='Adicionar'
                        options={options}
                        namePago={'Pago'} 
                        removerPag={setShowAddPag} 
                        type={"Pagamento"} 
                        devido={'Devido'}  
                        valorTotal = {valorRestante}
                        dadosPagForm={dadosPagForm} 
                        setImagemUpload={setImagemUpload} 
                        setDadosPagForm = {setDadosPagForm}/>
                        
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form> }    
                    {showEditPag.status&& 
                    <form onSubmit={handerEdit}>
                        <TourPag 
                            title='Editar'
                            namePago={'Pago'} 
                            options={options}
                            removerPag={setShowEditPag} 
                            type={"Pagamento"} 
                            devido={'Devido'} 
                            editPag={showEditPag.status} 
                            idPag={showEditPag.id} 
                            dados={dadosPag.filter((pag) => pag.idPagamento === showEditPag.id)} 
                            valorTotal = {valorParaFormularioEdicao} 
                            dadosPagForm={dadosPagForm} 
                            setImagemUpload={setImagemUpload} 
                            setDadosPagForm = {setDadosPagForm}/>
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form> }
                </div>
                {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                        <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}  
            </div>
        </div>
    </div>)
}