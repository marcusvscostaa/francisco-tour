import { useEffect } from "react";
import ModalAlert from "./ModalAlert"
import { useState } from "react";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
      }
  });

export default function ModalDeletarCliete(props) {
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [reservas, setReservas] = useState(false)

    useEffect(async () => {
        await fetch(`${process.env.REACT_APP_BASE_URL}/idReservas/${props.id}`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.fatal || data.code) {
                    setReservas(false)
                } else {
                    setReservas(data);
                }

            })
            .catch((error) => console.log(error));
    }, [])

    const handerDelete = async () => {

        reservas.map(async (dado) => {
            const deletePagReserva = {
                method: 'DELETE',headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
            };

            await fetch(`${process.env.REACT_APP_BASE_URL}/pagreserva/${dado.idR}`, deletePagReserva)
                .then(response => {
                    if (!response.ok) {
                        setModalStatus(prevArray => [...prevArray, { id: 1, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Pagamento" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 1))
                            setModalSpinner(false)
                        }, 2000)
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    if (data) {
                        setModalStatus(prevArray => [...prevArray, { id: 1, mostrar: true, status: true, message: "Sucesso Excluir Pagamento", titulo: "Pagamento" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 1))
                            setModalSpinner(false)
                        }, 2000)
                    }
                }).catch(e => {
                    setModalStatus(prevArray => [...prevArray, { id: 1, mostrar: true, status: false, message: "Erro ao Excluir Pagamento: " + e, titulo: "Pagamento" }])
                    setModalSpinner(true)
                    setTimeout(() => {
                        setModalStatus(modalStatus.filter((data) => data.id !== 1))
                        setModalSpinner(false)
                    }, 2000)
                })

            const deleteTour = {
                method: 'DELETE',
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
            };

            await fetch(`${process.env.REACT_APP_BASE_URL}/reservatour/${dado.idR}`, deleteTour)
                .then(response => {
                    if (!response.ok) {
                        setModalStatus(prevArray => [...prevArray, { id: 2, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Tour" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 2))
                            setModalSpinner(false)
                        }, 2000)
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    if (data) {
                        setModalStatus(prevArray => [...prevArray, { id: 2, mostrar: true, status: true, message: "Sucesso Excluir Tour", titulo: "Tour" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 2))
                            setModalSpinner(false)
                        }, 2000)
                    }
                }).catch(e => {
                    setModalStatus(prevArray => [...prevArray, { id: 2, mostrar: true, status: false, message: "Erro ao Excluir Tour: " + e, titulo: "Tour" }])
                    setModalSpinner(true)
                    setTimeout(() => {
                        setModalStatus(modalStatus.filter((data) => data.id !== 2))
                        setModalSpinner(false)
                    }, 2000)
                })

            const deleteReserva = {
                method: 'DELETE',
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
            };

            await fetch(`${process.env.REACT_APP_BASE_URL}/reserva/${dado.idR}`, deleteReserva)
                .then(response => {
                    if (!response.ok) {
                        setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Reserva" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 3))
                            setModalSpinner(false)
                        }, 2000)
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    if (data) {
                        setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: true, message: "Sucesso Excluir Reserva", titulo: "Reserva" }])
                        setModalSpinner(true)
                        setTimeout(() => {
                            setModalStatus(modalStatus.filter((data) => data.id !== 3))
                            setModalSpinner(false)
                            //window.location.reload();
                            props.setUpdateCount(true)
                            document.getElementById(`reservaDelete${props.idR}`).click()
                        }, 2000)
                    }
                }).catch(e => {
                    setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: false, message: "Erro ao Excluir Reserva: " + e, titulo: "Reserva" }])
                    setModalSpinner(true)
                    setTimeout(() => {
                        setModalStatus(modalStatus.filter((data) => data.id !== 3))
                        setModalSpinner(false)
                    }, 2000)
                })
        })

        const deleteCliente = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        };

        await fetch(`${process.env.REACT_APP_BASE_URL}/cliente/${props.id}`, deleteCliente)
            .then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Cliente" }])
                    setModalSpinner(true)
                    setTimeout(() => {
                        setModalStatus(modalStatus.filter((data) => data.id !== 3))
                        setModalSpinner(false)
                    }, 2000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                if (data) {
                    setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: true, message: "Sucesso Excluir Cliente", titulo: "Cliente" }])
                    setModalSpinner(true)
                    setTimeout(() => {
                        setModalStatus(modalStatus.filter((data) => data.id !== 3))
                        setModalSpinner(false)
                        //window.location.reload();
                        props.setUpdateCount(true)
                        document.getElementById(`clienteDelete${props.id}`).click()
                    }, 2000)
                }
            }).catch(e => {
                setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: false, message: "Erro ao Excluir Cliente: " + e, titulo: "Cliente" }])
                setModalSpinner(true)
                setTimeout(() => {
                    setModalStatus(modalStatus.filter((data) => data.id !== 3))
                    setModalSpinner(false)
                }, 2000)
            })
    }

    return (
        <div className="modal fade" tabindex="-1" id={`clienteDelete${props.id}`}>
            <ModalAlert dados={modalStatus} />

            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-light text-dark " role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Excluir dados de {props.dados.nome}</h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        <p style={{ fontSize: '1.2rem' }} class="font-weight-normal">Todos os dados serão <span class="badge badge-danger text-monospace" >excluídos permanentemente</span>,
                            inclusive <span class="badge badge-danger text-monospace">Reservas, pagamentos e tours</span> relacionados a  {props.dados.nome}.
                            Você realmente deseja excluir os dados do cliente ?</p>
                        {reservas &&
                            <table className="table table-sm table-bordered ">
                                <thead>
                                    <tr>
                                        <th>ID Reserva</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map((dado) => {
                                        return (
                                            <tr>
                                                <td>{dado.idR}</td>
                                                <td>{dado.dataReserva.substr(0, 10).split('-').reverse().join('/')}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>}
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="button" className="btn btn-danger" onClick={handerDelete} ><i className="fa fa-trash"></i> Sim</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Não</button>
                    </div>
                    {modalSpinner && <div className="position-absolute w-100 h-100 d-flex" style={{ backgroundColor: 'rgba(0, 0, 0, .2)' }}>
                        <div className="spinner-border text-secondary m-auto" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}