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
    const [updateCount, setUpdateCount] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [pagamentoreservas, setPagamentoreservas] = useState(false);
    const dataTableOptions = {
        // 1. Define a coluna 1 (Data) como a coluna de ordenação padrão (0 = Nome, 1 = Data)
        order: [[1, 'desc']], 
        
        // 2. Define o tipo e a capacidade de ordenação de cada coluna (0 a 8)
        columns: [
            { orderable: true },    // 0: Nome
            { orderable: true, type: 'date' }, // 1: Data (CRUCIAL: Define o tipo 'date')
            { orderable: false },    // 2: Tour/Endereço
            { orderable: false },    // 3: Pagamento
            { orderable: false },    // 4: Telefone
            { orderable: false },    // 5: Valor Total
            { orderable: false },    // 6: Comentário
            { orderable: false },    // 7: Status
            { orderable: false }    // 8: Configurações (Geralmente não é ordenável)
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

                // Trata as reservas e armazena (usando dataReservas)
                if (dataReservas.fatal || dataReservas.code) {
                    setReservas([]);
                } else {
                    
                    // 💡 SOLUÇÃO DE ORDENAÇÃO #1: Ordenar os dados ANTES de salvar no estado
                    const reservasOrdenadas = dataReservas.sort((a, b) => {
                        // Assume que a data está no campo 'data' ou 'dataDoTour' na reserva
                        const dataA = new Date(a.data); 
                        const dataB = new Date(b.data);
                        return dataA - dataB; // Ordena do mais antigo para o mais novo
                    });
                    
                    setReservas(reservasOrdenadas);
                }

                setTour(dataTours);
                setPagamentoreservas(dataPagamentos);

            } catch (error) {
                console.error("Erro no carregamento de dados: ", error);
                // Trate erros
            }
        };
            if (updateCount === false) { 
            fetchData();
        }
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