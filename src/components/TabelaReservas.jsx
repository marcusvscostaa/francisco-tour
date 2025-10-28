import { useEffect, useState } from "react";
import "../dataTable/dataTables.bootstrap4.min.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import RowTabela from "./RowTabela";
import {getReservas, getTours, getPagamentoReservas} from "../FranciscoTourService";


DataTable.use(DT);
const table = new DT;

export default function TabelaReservas(props) {
    const [tour, setTour] = useState(false);
    const [reservas, setReservas] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [updateData, setUpdateData] = useState(false);
    const [pagamentoreservas, setPagamentoreservas] = useState(false);
    const dataTableOptions = {
        order: [[1, 'desc']], 
        
        columns: [
            { orderable: true },    
            { orderable: true, type: 'date' }, 
            { orderable: false },   
            { orderable: false },    
            { orderable: false },   
            { orderable: false },    
            { orderable: false },    
            { orderable: false },    
            { orderable: false }    
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataReservas, dataTours, dataPagamentos] = await Promise.all([
                    getReservas(),
                    getTours(),
                    getPagamentoReservas()
                ]);

                if (dataReservas.fatal || dataReservas.code) {
                    setReservas([]);
                } else {
                    
                    const reservasOrdenadas = dataReservas.sort((a, b) => {
                        const dataA = new Date(a.data); 
                        const dataB = new Date(b.data);
                        return dataA - dataB; 
                    });
                    
                    setReservas(reservasOrdenadas);
                }

                setTour(dataTours);
                setPagamentoreservas(dataPagamentos);

            } catch (error) {
                console.error("Erro no carregamento de dados: ", error);
            }
        };
        fetchData();
    }, [updateCount]);

    const handleUpdate = () => {
        setUpdateCount(prevCount => prevCount + 1);
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tabela Reservas</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    {reservas && tour && pagamentoreservas?
                        <DataTable
                            options={dataTableOptions}
                            className="table table-sm table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable"
                            
                        >
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th className="text-left">Data</th>
                                    <th>Tour</th>
                                    <th>Pagamento</th>
                                    <th className="text-left">Telefone</th>
                                    <th>Total</th>
                                    <th>Comentário</th>
                                    <th>Status</th>
                                    <th>Configurações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas&&reservas.map((reserva, index) => {                                   
                                    return (<RowTabela pagamentoreservas={pagamentoreservas} setUpdateCount={handleUpdate} updateCount={updateCount} reserva={reserva} index={index} tour={tour} />)   
                                })}
                            </tbody>
                        </DataTable>
                        :<div className="d-flex justify-content-center">
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