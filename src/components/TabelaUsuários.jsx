import { useEffect, useState } from 'react';
import { getUsuarios } from '../FranciscoTourService';
import StatusUsuario from './StatusUsuario';
import { Table, Tag, Spin } from 'antd';


export default function TabelaUsuarios(props) {
    const [usuarios, setUsuarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateKey, handleUpdate } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns = [
        {
            title: 'Usuário',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            width: 150,
        },
        {
            title: 'Acesso',
            dataIndex: 'acesso',
            key: 'acesso',
            filters: [ 
                { text: 'ADMIN', value: 'ADMIN' },
                { text: 'VENDEDOR', value: 'VENDEDOR' },
                { text: 'MOTORISTA', value: 'MOTORISTA' },
            ],
            onFilter: (value, record) => record.acesso.indexOf(value) === 0,
            render: (acesso) => (
                <Tag color={acesso === 'ADMIN' ? 'default' : 'blue'}>
                    {acesso}
                </Tag>
            ),
            width: 150,
        },
        {
            title: 'Comissão',
            dataIndex: 'comissoes',
            key: 'comissoes',
            sorter: (a, b) => a.comissoes - b.comissoes,
            render: (comissoes) => `${comissoes}%`,
            align: 'left',
            width: 150,
        },
        {
            title: 'Status',
            key: 'statusAcao',
            width: 150,
            render: (text, user) => ( 
                <StatusUsuario
                    idUsuario={user.idUsuario} 
                    acesso={user.acesso}
                    initialStatus={user.status} 
                    setUpdateKey={handleUpdate} 
                /> 
            ),
            width: 150,
        },
    ];

    return (
        <Spin tip="Carregando Usuários..." spinning={loading}>
            <div className="table-responsive card border border-secondary mb-5">
                <Table
                dataSource={usuarios} 
                columns={columns} 
                bordered={true}    
                rowKey="idUsuario"  
                size="small"
                pagination={{ 
                            current: currentPage,
                            pageSize: pageSize,
                            showSizeChanger: true, 
                            pageSizeOptions: ['10', '25', '50', '100'], 
                            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
                            className: 'pagination-centered',
                        }}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination)}
                scroll={{ 
                    y: 450
                }}
            />
            </div>
        </Spin>
    );
}
