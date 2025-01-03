import ReactDOM from 'react-dom';
import ModalAdicionarTour from './ModalAdiconarTour';

export default function RowTabelaChild(props){
    return ReactDOM.createPortal(
            <td colSpan="9" className="bg-dark text-white noHover" >
                <p>Tours: {props.nomeCliente}</p>
            <table className="table table-sm table-dark noHover" style={{pointerEvents: 'none'}}>
                            <thead>
                                <tr>
                                    <th>Destino</th>
                                    <th>Tour</th>
                                    <th>Data</th>
                                    <th>N° Adultos</th>
                                    <th>Valor Adultos</th>
                                    <th>N° Crianças</th>
                                    <th>Valor Criança</th>
                                    <th>Valor Total</th>
                                    <th>Configurações</th>
                                </tr>
                            </thead>
                {props.dadosTour.map((dataT) =>
                    <tbody>                    
                        <tr>
                                <td>{dataT.destino}</td>
                                <td>{dataT.tour}</td>
                                <td>{dataT.data.substr(0, 10).split('-').reverse().join('/')}</td>
                                <td>{dataT.quantidadeAdultos}</td>
                                <td>R$: {dataT.valorAdulto.toFixed(2).replace(".", ",")}</td>
                                <td>{dataT.quantidadeCriancas}</td>
                                <td>R$: {dataT.valorCrianca.toFixed(2).replace(".", ",")}</td>
                                <td>R$: {((dataT.quantidadeAdultos*dataT.valorAdulto) +( dataT.quantidadeCriancas*dataT.valorCrianca)).toFixed(2).replace(".", ",")}</td>
                                <td>
                                <button type="button" title="Editar" class="btn btn-sm mr-2 btn-warning cpointer"><i className="fas fa-edit"></i></button>
                                <button type="button" title="Deletar" class="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                </td>
                        </tr>
                    </tbody>
                       
                    )
                }
            </table>
            <div className='w-100 d-flex'>
                <button type="button" data-toggle="modal" data-target={`#modalT${props.idcollapseTable.substr(0, 11)}`} class="ml-auto btn btn-sm btn-info">Adiconar Tour</button>
                <ModalAdicionarTour id={props.idcollapseTable.substr(0, 11)} />
            </div>
            </td>
       ,
        document.getElementById(props.idcollapseTable)
    )
}