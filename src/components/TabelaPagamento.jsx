import { useState, useEffect, useCallback } from "react";
import { Popconfirm   } from 'antd';
import { editarStatusPagamento } from '../FranciscoTourService';

export default function TabalaPagamento(props){
    const getInitialPagStatus = (status) => {
        if (status === 'Pago') return { status: 'Pago', className: "fas fa-check-circle text-success" };
        if (status === 'Cancelado') return { status: 'Cancelado', className: "fas fa-ban text-danger" };
        return { status: '', className: "" };
    };
    const [statusLocal, setStatusLocal] = useState(() => getInitialPagStatus(props.pag.status));

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    useEffect(()=>{
        setStatusLocal(getInitialPagStatus(props.pag.status));
    },[props.pag.status])

    const handleChange = useCallback(async (e)=> {
        const newStatusValue = e.target.value;
        try {
            await editarStatusPagamento({idPagamento: props.pag.idPagamento, status: newStatusValue });
            
            if(newStatusValue === 'Confirmado'){
                setStatusLocal({status: newStatusValue, className: "fas fa-check-circle text-success"})
            }else if(newStatusValue === 'Cancelado'){
                setStatusLocal({status: newStatusValue, className: "fas fa-ban text-danger"})
            }
            
            props.setUpdateCount(prevCount => prevCount + 1); 

        } catch (err) {
            console.error("Erro ao atualizar status do Tour:", err);
        }
    }, [props.pag.idPagamento, props.setUpdateCount]);

    return(
        <>
            <td>{props.pag.idPagamento}</td>
            <td>{props.pag.dataPagamento.substr(0, 10).split('-').reverse().join('/')}</td>
            <td>R$: {props.pag.valorPago.toFixed(2).replace(".", ",")}</td>
            <td>               
                <Popconfirm  
                    placement="bottom"
                    title="Comentário"
                    description={props.pag.comentario?props.pag.comentario:'Sem Comentário'}
                    icon={<><i className="fas fa-comment-alt"></i>&nbsp;</>}
                    open={isModalOpen}
                    onConfirm={handleOk}
                    showCancel={false}
                >
                    <a type="button" className="btn btn-sm btn-light" onClick={showModal}>
                        <i className="fas fa-comment-alt"></i>
                        &nbsp; Ver
                    </a>
                </Popconfirm  >
            </td>
            <td>
                <a type="button" className="btn btn-sm btn-light" target="_blank" href={`${process.env.REACT_APP_BASE_URL}/pagamento/comprovante/${props.pag.idPagamento}`}>
                    <i className="fas fa-image	"></i>
                    &nbsp; Ver
                </a>
            </td>
            <td>
                <div className="dropdown">
                
                <a type="button" data-toggle="dropdown" aria-expanded="false">
                    <i title={statusLocal.status} className={statusLocal.className}></i>                
                </a>
                <div style={{minWidth: "40px"}} className="dropdown-menu dropdown-menu-right">
                    <button className="dropdown-item" value="Pago" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-check-circle text-success"></i> Pago</button>
                    <button className="dropdown-item" value="Cancelado"  onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-ban text-danger"></i> Cancelado</button>
                </div>
                </div>                    
            </td>

        </>
    )
}