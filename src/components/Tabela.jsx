import { useEffect, useState } from "react";
import "../dataTable/dataTables.bootstrap4.min.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import ModalAdiconarReserva from "./ModalAdiconarReserva";
import ModalDeletarCliete from "./ModalDeletarCliente";
import ModalEditarCliente from "./ModalEditarCliente";
import {getClientes} from "../FranciscoTourService";

DataTable.use(DT);

export default function Tabela(props) {
    const [clients, setClients] = useState({});
    const [updateCount, setUpdateCount] = useState(false);

    useEffect(() => {

        setTimeout(() => {
            getClientes().then(
                data => {
                    if(data.fatal || data.code){
                        setClients(false);
                    }else{
                        setClients(data)
                    }    
                }
                ).catch((error) => console.log(error));
            },"300")

        setUpdateCount(false)


    }, [updateCount]);



    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Tabela Clientes</h6>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    {!clients?.length ? <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
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
                                    <th className="text-left">Telefone</th>
                                    <th>Pais Origem</th>
                                    <th>Idioma</th>
                                    <th>Configurações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(clients.map((client, index) => {
                                    return (<tr key={index}>
                                        <td><i className="fas fa-user-alt"></i>&nbsp;{client.nome}</td>
                                        <td><i className="fa fa-envelope"></i>&nbsp;{client.email}</td>
                                        <td className="text-left"> <a href={`https://api.whatsapp.com/send?phone=${client.telefone}`} target="_blank" rel="noopener noreferrer"><i className="fas fa-phone"></i>&nbsp;{client.telefone}</a></td>
                                        <td><i className="fas fa-globe-americas	"></i>&nbsp;{client.paisOrigem}</td>
                                        <td><i className="fa fa-language"></i>&nbsp;{client.idioma}</td>
                                        <td>
                                            <button type="button" data-toggle="modal" data-target={`#mr${client.id}`} title="Adicionar Reserva" className="btn btn-sm mr-2 btn-primary"> <i className="fas fa-hot-tub"></i> <i className="fa fa-plus"></i></button>
                                            <button type="button" data-toggle="modal" data-target={`#clienteEditar${client.id}`}title="Editar" className="btn btn-sm mr-2 btn-warning"><i className="fas fa-edit	"></i></button>
                                            <ModalEditarCliente setUpdateCount={setUpdateCount} dados={client} id={client.id}/>
                                            <button type="button" data-toggle="modal" data-target={`#clienteDelete${client.id}`} title="Deletar" className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                            <ModalDeletarCliete dados={client} setUpdateCount={setUpdateCount} id={client.id}/>
                                            <ModalAdiconarReserva dados={client} id={client.id} />
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