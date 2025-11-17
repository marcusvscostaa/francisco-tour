import { useState, useEffect } from "react";
import "../../dataTable/dataTables.bootstrap4.min.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import {getToursCadastro} from "../../FranciscoTourService";
import ModalCriarTourCadastro from './ModalCriarTourCadastro'; 
import ModalDeleteTourCadastro from "./ModalDeleteTourCadastro";

DataTable.use(DT);

export default function ConfiguracoesCard(){
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateCount, setUpdateCount] = useState(false);

    const dataTableOptions = {
        columns: [
            { orderable: true },  
            { orderable: true },  
            { orderable: true },  
            { orderable: true },  
            { orderable: true },
            { orderable: true },    
            { orderable: false }, 
            { orderable: false },
            { orderable: false }
        ]
    };
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getToursCadastro(); 
                setTours(data); 
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar Tours:", err);
                setError("Falha ao carregar os dados de tours.");
                setLoading(false);
            }
        };
        fetchTours();
    }, [updateCount]);
    if (loading) {
        return <p>Carregando tabela de tours...</p>;
    }

    if (error) {
        return <p className="text-danger">Erro: {error}</p>;
    }
    
    return(
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Tabela de Tours</h6>
                <button type="button" className="btn btn-sm btn-primary" data-toggle="modal" 
                    data-target="#modalCriarTourCadastro">Adicionar Tour</button>
            </div>
            <ModalCriarTourCadastro id={`modalCriarTourCadastro`} tourParaEdicao={null} setUpdateCount={setUpdateCount}/>
            <div className="card-body">
                <div className="table-responsive">
                     <DataTable
                            options={dataTableOptions}
                            className="table table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable"
                        >
                            <thead>
                                <tr>
                                    <th className="text-left">id_tour</th>
                                    <th>destino</th>
                                    <th>nome_tour</th>
                                    <th className="text-left">valor_adulto</th>
                                    <th className="text-left">valor_crianca</th>
                                    <th className="text-left">Custo Adulto</th>
                                    <th className="text-left">Custo Criança</th>
                                    <th>EDT</th>
                                    <th>DLT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tours.map((tour) => (
                                    <tr key={tour.id_tour}>
                                        <td className="text-left">{tour.id_tour}</td>
                                        <td>{tour.destino}</td>
                                        <td>{tour.nome_tour}</td>
                                        <td className="text-left">R$ {parseFloat(tour.valor_adulto || 0).toFixed(2).replace('.', ',')}</td> 
                                        <td className="text-left">R$ {parseFloat(tour.valor_crianca || 0).toFixed(2).replace('.', ',')}</td>
                                        <td className="text-left">R$ {parseFloat(tour.custo_adulto || 0).toFixed(2).replace('.', ',')}</td>
                                        <td className="text-left">R$ {parseFloat(tour.custo_crianca || 0).toFixed(2).replace('.', ',')}</td>
                                        <td><button type="button" data-toggle="modal" data-target={`#modalEditarTourCadastro-${tour.id_tour}`} title="Editar" className="btn btn-sm mr-2 btn-warning"><i className="fas fa-edit	"></i></button></td>
                                        <td><button type="button" data-toggle="modal" data-target={`#modalDeletarTourCadastro-${tour.id_tour}`} title="Deletar" className="btn btn-sm mr-2 btn-danger"><i className="fas fa-trash"></i></button></td>
                                            <ModalCriarTourCadastro 
                                                id={`modalEditarTourCadastro-${tour.id_tour}`}
                                                tourParaEdicao={tour} 
                                                setUpdateCount={setUpdateCount}
                                            />
                                            <ModalDeleteTourCadastro 
                                                id_tour={tour.id_tour} 
                                                nome_tour={tour.nome_tour} 
                                                setUpdateCount={setUpdateCount} 
                                            />
                                    </tr>
                                ))}
                        </tbody>
                        </DataTable>
                </div>
            </div>
        </div>
    )
}