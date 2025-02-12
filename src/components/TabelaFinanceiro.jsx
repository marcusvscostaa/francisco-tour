import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { use, useEffect } from 'react';
import TabelaFinanceiroRow from './TabelaFinanceiroRow';

DataTable.use(DT);
export default function TabelaFinanceiro(props) {
    useEffect(() => {
        console.log(props.dadoAno.dados)
    })
    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">TABELA RESERVAS</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    {props.reservas &&  props.tour && props.pagamentoreservas?
                        <DataTable
                            className="table table-sm table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable">
                            <thead>
                                <tr>
                                    <th className="text-left">ID Reserva</th>
                                    <th className="text-left">Nome</th>
                                    <th className="text-left">Data</th>
                                    <th className="text-left">Total</th>
                                    <th className="text-left">Pago</th>
                                    <th className="text-left">Devido</th>
                                    <th className="text-left">Estorno</th>
                                    <th className="text-left">Sts Estorno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.reservas && props.reservas.map((item) => {
                                    return (
                                        <TabelaFinanceiroRow dados={item} estorno={props.estorno.filter((estorno) => estorno.id_reserva === item.idR )} tour={props.tour} pagamentoreservas={props.pagamentoreservas}/>
                                    )
                                })}
                            </tbody>
                        </DataTable>
                        : <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}