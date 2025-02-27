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
    const [updateCount, setUpdateCount] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [pagamentoreservas, setPagamentoreservas] = useState(false);
    const columns =  {"columns": [{
        className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: ''
    }]}

    useEffect( () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/reservas`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token}
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.fatal === false){
                    setReservas(false)
                }else{
                    setReservas(data);
                }
                console.log(reservas)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        
        
        fetch(`${process.env.REACT_APP_BASE_URL}/tour`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token}
        })
            .then((response) => response.json())
            .then((data) => {
                setTour(data);
                console.log(tour)
                //console.log(data);
            })
            .catch((error) => console.log(error));
       
        fetch(`${process.env.REACT_APP_BASE_URL}/reservaPagamento`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token}
        })
            .then((response) => response.json())
            .then((data) => {
                setPagamentoreservas(data);
                console.log(pagamentoreservas)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        
        setTimeout(() => {setUpdateData(true)
        }, 1000)
        setTimeout(() => setUpdateData(false), 1500)  
        setUpdateCount(false)        
    }, [updateCount]);



    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tabela Reservas</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    {reservas && tour && pagamentoreservas?
                        <DataTable
                            className="table table-sm table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable"
                            {...console.log(reservas)}
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
                                    return (<RowTabela pagamentoreservas={pagamentoreservas} setUpdateCount={setUpdateCount} updateCount={updateData} reserva={reserva} index={index} tour={tour} />)   
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