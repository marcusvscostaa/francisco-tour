import { Fragment, useEffect, useState } from "react";
import "../dataTable/dataTables.bootstrap4.min.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import RowTabela from "./RowTabela";
import RowTabelaChild from "./RowTabelaChild";

DataTable.use(DT);
const table = new DT;

export default function TabelaReservas(props) {
    const [tour, setTour] = useState(false);
    const [reservas, setReservas] = useState(false);
    const [pagamentoreservas, setPagamentoreservas] = useState(false);
    const columns =  {"columns": [{
        className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: ''
    }]}

    useEffect( async () => {
        await fetch("http://127.0.0.1:8800/reservas", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setReservas(data);
                console.log(reservas)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        
        
        await fetch("http://127.0.0.1:8800/tour", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setTour(data);
                console.log(tour)
                //console.log(data);
            })
            .catch((error) => console.log(error));
       
        await fetch("http://127.0.0.1:8800/reservaPagamento", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setPagamentoreservas(data);
                console.log(pagamentoreservas)
                //console.log(data);
            })
            .catch((error) => console.log(error));
            

    }, []);



    return (
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Tabela Reservas</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    {reservas && tour && pagamentoreservas?
                    
                        <DataTable
                            className="table table-sm table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable"
                        >
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Data</th>
                                    <th>Tour/Endereço</th>
                                    <th>Pagamento</th>
                                    <th className="text-left">Telefone</th>
                                    <th>Valor Total</th>
                                    <th>Comentário</th>
                                    <th>Status</th>
                                    <th>Configurações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas&&reservas.map((reserva, index) => {                                   
                                    return (<RowTabela pagamentoreservas={pagamentoreservas} reserva={reserva} index={index} tour={tour} />)   
                                })}
                            </tbody>
                        </DataTable>
                        :<div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div> 
                    }
                </div>
            </div>
        </div>
    )
}