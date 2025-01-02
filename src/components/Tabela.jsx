import { useEffect, useState } from "react";
import "../dataTable/dataTables.bootstrap4.min.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

export default function Tabela(props) {
    const [clients, setClients] = useState({});
    useEffect(() => {

        fetch("http://127.0.0.1:8800/clientes", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setClients(data);
                console.log(clients)
                //console.log(data);
            })
            .catch((error) => console.log(error));


        console.log(clients)


    }, []);



    return (
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Tabela Clientes</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    {!clients?.length ? <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div> :
                        <DataTable
                            className="table table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable"
                        >
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th>Endereço</th>
                                    <th>Hotel</th>
                                    <th>Quarto</th>
                                    <th>Zona</th>
                                    <th>Pais Origem</th>
                                    <th>Idioma</th>
                                    <th>Configurações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(clients.map((client, index) => {
                                    return (<tr key={index}>
                                        <td>{client.nome}</td>
                                        <td>{client.email}</td>
                                        <td>{client.telefone}</td>
                                        <td>{client.endereco}</td>
                                        <td>{client.hotel}</td>
                                        <td>{client.quarto}</td>
                                        <td>{client.zona}</td>
                                        <td>{client.paisOrigem}</td>
                                        <td>{client.idioma}</td>
                                        <td>
                                            <button type="button" title="Reserva" className="btn btn-sm mr-2 btn-primary"><i className="fas fa-hot-tub"></i></button>
                                            <button type="button" title="Editar" class="btn btn-sm mr-2 btn-warning"><i className="fas fa-edit	"></i></button>
                                            <button type="button" title="Deletar" class="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                        </td>

                                    </tr>)
                                }))}

                            </tbody>
                        </DataTable>
                    }
                </div>
            </div>
        </div>
    )
}