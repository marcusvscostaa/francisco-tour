import ReactDOM from 'react-dom';
import ModalAdicionarTour from './ModalAdiconarTour';
import ModalDeleteTour from './ModalDeleteTour';
import ModalEditarTour from './ModalEditarTour';
import { useState, useEffect } from 'react';
import StatusTour from './StatusTour';

export default function RowTabelaChild(props){
        const [statusReserva, setStatusReserva] = useState('Confirmado')
    
    return ReactDOM.createPortal(
            <td colSpan="9" className="bg-dark text-white" >
            <div>

            <address>
                {props.reserva.endereco && <> <span className="badge badge-secondary"><i className='fas fa-map-marker-alt'></i> Endereço: </span> {props.reserva.endereco}<br/></>}
                {props.reserva.hotel && <> <span className="badge badge-secondary"><i className='fas fa-hotel'></i> Hotel: </span> {props.reserva.hotel}</>}
                {props.reserva.quarto && <> <span className="badge badge-secondary"><i className='fas fa-bed'></i> Quarto: </span> {props.reserva.quarto}<br/></>}
                {props.reserva.zona && <> <span className="badge badge-secondary"><i className='fas fa-city'></i> Zona: </span> {props.reserva.zona}<br/></>}
            </address>
            </div>   
            <div>     
            <table id="tabelaTour" className="table table-sm table-hover table-dark" >
                    <thead>
                        <tr className='noneEventPointer'>
                            <th>ID</th>
                            <th>Destino</th>
                            <th>Tour</th>
                            <th>Data</th>
                            <th>N° Adultos</th>
                            <th>Valor Adultos</th>
                            <th>N° Crianças</th>
                            <th>Valor Criança</th>
                            <th>Valor Total</th>
                            <th>Status</th>
                            <th>Configurações</th>
                        </tr>
                    </thead>
                {props.dadosTour.map((dataT) =>
                    <tbody>                    
                        <tr>    
                                <td>{dataT.idtour}</td>
                                <td>{dataT.destino}</td>
                                <td>{dataT.tour}</td>
                                <td>{dataT.data.substr(0, 10).split('-').reverse().join('/')}</td>
                                <td>{dataT.quantidadeAdultos}</td>
                                <td>R$: {dataT.valorAdulto.toFixed(2).replace(".", ",")}</td>
                                <td>{dataT.quantidadeCriancas}</td>
                                <td>R$: {dataT.valorCrianca.toFixed(2).replace(".", ",")}</td>
                                <td>R$: {((dataT.quantidadeAdultos * dataT.valorAdulto) + (dataT.quantidadeCriancas * dataT.valorCrianca)).toFixed(2).replace(".", ",")}</td>
                                <td>
                                    <StatusTour id={dataT.idtour} status={dataT.status} />
                                </td>
                                <td>
                                <button type="button" title="Editar" data-toggle="modal" data-target={`#editarTour${dataT.idtour}`}  className="btn btn-sm mr-2 btn-warning cpointer"><i className="fas fa-edit"></i></button>
                                <ModalEditarTour dados={dataT} idtour={dataT.idtour}/>
                                <button type="button" title="Deletar" data-toggle="modal" data-target={`#tourDelete${dataT.idtour}`} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>                                
                                <ModalDeleteTour title="Tour" idTour={dataT.idtour}/>
                                </td>
                        </tr>
                    </tbody>
                       
                    )
                }
            </table>
            </div>
            <div className='w-100 d-flex'>
                <button type="button" data-toggle="modal" data-target={`#modalT${props.idcollapseTable.substr(0, 11)}`} className="ml-auto btn btn-sm btn-info">Adiconar Tour</button>
                <ModalAdicionarTour id={props.idcollapseTable.substr(0, 11)} />
            </div>
            </td>
       ,
        document.getElementById(props.idcollapseTable)
    )
}