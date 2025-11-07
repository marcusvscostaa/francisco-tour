import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import RowTabelaChild from "./RowTabelaChild";
import ModalPagamento from "./ModalPagamento";
import ModalComentario from "./ModalComentario";
import ModalDeleteReserva from "./ModalDeleteReserva";
import ModalEditarReserva from "./ModalEditarReserva";
import { 
    editarStatusReserva, 
    editarStatusTours, 
    editarStatusPagamento 
} from '../FranciscoTourService';

const STATUS = {
    CONFIRMADO: { status: 'Confirmado', className: "fas fa-check-circle text-success", isDisabled: false },
    CANCELADO: { status: 'Cancelado', className: "fas fa-ban text-danger", isDisabled: true }
};

export default function RowTabela(props){
const { 
        reserva, 
        tour, 
        pagamentoreservas, 
        updateCount: parentUpdateCount, 
        setUpdateCount: setParentUpdateCount, 
        index 
    } = props;

    const [collapseTable, setCollapseTable] = useState(false);
    const [collapsePagamento, setCollapsePagamento] = useState(false);
    const [valorPago, setValorPago] = useState(0); 
    const [statusReserva, setStatusReserva] = useState(STATUS.CONFIRMADO);
    
    const dadosTour = useMemo(() => 
        tour.filter((tourR) => tourR.id_reserva === reserva.idR), 
        [tour, reserva.idR]
    );

    const valorTotal = useMemo(() => 
        dadosTour
            .filter((tourR) => tourR.status === STATUS.CONFIRMADO.status)
            .reduce((sum, element) => 
                sum + (element.quantidadeAdultos * element.valorAdulto) + (element.quantidadeCriancas * element.valorCrianca), 
                0
            ),
        [dadosTour]
    );

    const { dataISO, dataFormatadaBr } = useMemo(() => {
        const dataISO = reserva.dataReserva.substr(0, 10); 
        return {
            dataISO,
            dataFormatadaBr: dataISO.split('-').reverse().join('/'),
        };
    }, [reserva.dataReserva]);

    const nomeExibido = useMemo(() => {
        const nomeCompleto = reserva.nome;
        const partesDoNome = nomeCompleto ? nomeCompleto.trim().split(/\s+/) : []; 
        
        if (partesDoNome.length === 1) {
            return partesDoNome[0];
        } else if (partesDoNome.length > 1) {
            const primeiroNome = partesDoNome[0];
            const ultimoSobrenome = partesDoNome[partesDoNome.length - 1]; 
            return `${primeiroNome} ${ultimoSobrenome}`;
        }
        return '';
    }, [reserva.nome]);

    useEffect(() => {
        if (!reserva) {
            return;
        }

        let initialStatus = STATUS.CONFIRMADO;
        if(reserva.status) { 
            switch(reserva.status) {
                case STATUS.CONFIRMADO.status:
                    initialStatus = STATUS.CONFIRMADO;
                    break;
                case STATUS.CANCELADO.status:
                    initialStatus = STATUS.CANCELADO;
                    break;
                default:
                    break;
            }
        }
        setStatusReserva(initialStatus);
        if (pagamentoreservas) {
           const pago = (pagamentoreservas || []) 
                .filter((item) => item.id_reserva === reserva.idR && item.status === "Pago")
                .reduce((sum, element) => sum + element.valorPago, 0);
           setValorPago(pago);
        }
        
    }, [parentUpdateCount, pagamentoreservas, reserva])

    const handleStatusUpdate = useCallback(async (status) => {
        try {
        
            await editarStatusReserva({ status, idR: reserva.idR });
            
            const toursToUpdate = dadosTour.map(item => 
                editarStatusTours({ status: status, idtour: item.idtour })
            );

            const pagamentosToUpdate = (pagamentoreservas || [])
                .filter(item => item.id_reserva === reserva.idR)
                .map(item => {
                    let pagamentoStatus = item.status; 
                    if (status === STATUS.CONFIRMADO.status) {
                        pagamentoStatus = 'Pago'; 
                    } else if (status === STATUS.CANCELADO.status) {
                        pagamentoStatus = 'Cancelado'; 
                    } 

                    return editarStatusPagamento({ 
                        status: pagamentoStatus, 
                        idPagamento: item.idPagamento 
                    });
                });

            await Promise.all([...toursToUpdate, ...pagamentosToUpdate]);

            const newStatus = STATUS[Object.keys(STATUS).find(key => STATUS[key].status === status)];
            setStatusReserva(newStatus || STATUS.CONFIRMADO);
            setParentUpdateCount();

        } catch (err) {
            console.error(`Erro ao atualizar status para ${status}:`, err);
        }
    }, [reserva?.idR, dadosTour, pagamentoreservas, setParentUpdateCount]);

    const handleDropdownChange = (e) => {
        handleStatusUpdate(e.target.value);
    }
    
    const getPagamentoBadge = () => {
        if (valorTotal <= valorPago) {
            return <span className="badge badge-pill badge-success">Pago</span>;
        }
        if (valorTotal > valorPago && valorPago > 0) {
            return <span className="badge badge-pill badge-warning">Pendente</span>;
        }
        if (valorPago === 0 && valorTotal !== 0) {
            return <span className="badge badge-pill badge-danger">Não Pago</span>;
        }
        return null;
    };
    
    const isButtonDisabled = statusReserva.isDisabled;

    const handleCollapseClick = () => {
        setCollapsePagamento(prev => !prev);
    }
    return (
        <Fragment>
            <tr id={props.reserva.idR}>
            
                <td><i className="fas fa-user-alt"></i> {nomeExibido}</td>
                <td data-order={dataISO} className="text-left"><i className="fas fa-calendar-alt"></i> {dataFormatadaBr}</td>
                
                <td><a className="cpointer" data-toggle="collapse" data-target={"linha"+props.index}
                onClick={
                    (e) =>{
                        
                        if(collapseTable === false)
                        {
                            const myElement = document.getElementById(props.reserva.idR);
                            const newHTML = `<tr id=${props.reserva.idR+'x'}></tr>`;
                            myElement.insertAdjacentHTML('afterend', newHTML);
                            setCollapseTable(true);
                        }else{
                            setCollapseTable(false)
                        }
                    }
                }><i className={collapseTable?"fas fa-arrow-alt-circle-down	":"fas fa-arrow-alt-circle-right"}></i> Ver</a> {props.reserva.tour}
                        {/* collapseTable && <RowTabelaChild dadosTour={dadosTour} collapseTable={collapseTable} idcollapseTable={idcollapseTable}/> */}    
                </td>
                <td><a title="Ver Pagamento" data-toggle="modal"  onClick={handleCollapseClick} className="cpointer" data-target={`#modal${props.reserva.idR}`}>
                        {getPagamentoBadge()}
                    </a>
                    {collapsePagamento&&<ModalPagamento 
                        id={reserva.idR} 
                        disabledButton={isButtonDisabled} 
                        pagamento={pagamentoreservas} 
                        updateCount={parentUpdateCount} 
                        valorTotal={valorTotal} 
                        setUpdateCount={setParentUpdateCount}
                    />           }         </td>
                <td className="text-left"><a href={`https://api.whatsapp.com/send?phone=${props.reserva.telefone}`} title="Abrir Whatsapp" target="_blank" rel="noopener noreferrer"><i className="fas fa-phone"></i> {props.reserva.telefone}</a></td>
                <td>R$: {valorTotal.toFixed(2).replace(".", ",")}</td>
                <td>
                    <a type="button" className="btn btn-sm btn-light" data-trigger="hover" data-toggle="modal" data-target={`#comentario${props.reserva.idR}`} title="Comentário">
                    <i className="fas fa-comment-alt"></i>
                        &nbsp; Ver
                    </a>
                    <ModalComentario title={'Comentário Reserva'} id={reserva.idR} comentario={reserva.comentario}/>
                </td>
                <td>
                    <div className="dropdown">
                    
                    <a type="button" data-toggle="dropdown" aria-expanded="false">
                    <i title={statusReserva.status} className={statusReserva.className}></i>
                    </a>
                        <div style={{minWidth: "40px"}} className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" value={STATUS.CONFIRMADO.status} onClick={handleDropdownChange}><i className={STATUS.CONFIRMADO.className}></i> {STATUS.CONFIRMADO.status}</button>
                            <button className="dropdown-item" value={STATUS.CANCELADO.status} onClick={handleDropdownChange}><i className={STATUS.CANCELADO.className}></i> {STATUS.CANCELADO.status}</button>
                        </div>
                    </div>                    
                </td>
                <td>
                    <button type="button" title="Editar" className="btn btn-sm mr-2 btn-warning" data-toggle='modal' data-target={`#reservaEditar${props.reserva.idR}`}><i className="fas fa-edit"></i></button>
                    <ModalEditarReserva dadosReserva={reserva} setUpdateCount={setParentUpdateCount} idR={reserva.idR}/>        
                    <button type="button" title="Deletar" data-toggle='modal' data-target={`#reservaDelete${props.reserva.idR}`}className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                    <ModalDeleteReserva idR={reserva.idR} setUpdateCount={setParentUpdateCount}/>
                </td>
            </tr>
                {collapseTable && <RowTabelaChild 
                    idcollapseTable={reserva.idR + 'x'} 
                    disabledButton={isButtonDisabled} 
                    dadosTour={dadosTour} 
                    updateCount={parentUpdateCount} 
                    reserva={reserva} 
                    setUpdateCount={setParentUpdateCount}
                />}
        </Fragment>
    )
}