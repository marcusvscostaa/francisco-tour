import React, { useEffect, useState } from 'react';
import { getUsuarios } from '../FranciscoTourService';
import StatusUsuario from './StatusUsuario';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import ModalAdicionarUsuario from './ModalAdicionarUsuario';

DataTable.use(DT);

const STATUS = {
    CONFIRMADO: { status: 'ATIVO', className: "fas fa-check-circle text-success", isDisabled: false },
    CANCELADO: { status: 'BLOQUEADO', className: "fas fa-ban text-danger", isDisabled: true }
};

export default function TabelaUsuarios(props) {
    const [usuarios, setUsuarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateKey, handleUpdate } = props;
    
    // Assumindo que você terá um ModalEditarUsuario e um ModalDeleteUsuario
    // import ModalEditarUsuario from './ModalEditarUsuario';
    // import ModalDeleteUsuario from './ModalDeleteUsuario';

    // Função para buscar os usuários
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getUsuarios();
                
                if (Array.isArray(data)) {
                    setUsuarios(data);
                } else {
                    console.error("Dados de usuários inválidos ou erro retornado:", data);
                    setUsuarios([]);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
                setUsuarios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [updateKey]); 

    if (loading) {
        return (
            <div className="d-flex justify-content-center pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Carregando Usuários...</span>
                </div>
            </div>
        );
    }
    
    if (!usuarios || usuarios.length === 0) {
        return <p className="pt-3">Nenhum usuário cadastrado ou erro ao carregar.</p>;
    }

    return (
        <div className="table-responsive pt-3">
                <DataTable
                    className="table table-hover mr-0 mt-3 w-100 "
                    cellspacing="0"
                    width="100%"
                    id="dataTable"
                >                
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Acesso</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.idUsuario}>
                            <td title={user.idUsuario}>{user.idUsuario.substring(0, 8)}...</td>
                            <td>{user.username}</td>
                            <td ><span className={user.acesso === 'ADMIN'?'badge badge-dark':'badge badge-info'}>{user.acesso}</span></td>
                            <td>
                                <StatusUsuario
                                    idUsuario={user.idUsuario} 
                                    acesso={user.acesso}
                                    initialStatus={user.status} 
                                    setUpdateKey={handleUpdate}
                                /> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </DataTable>
        </div>
    );
}
