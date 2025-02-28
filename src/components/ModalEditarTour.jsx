import { useState, useEffect } from "react";
import ModalAlert from "./ModalAlert";
import TourForm from "./TourForm";

export default function ModalEditarTour(props){
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [calculoTotal, setcalculoTotal] = useState(
        [{  id: "1",
            data:(props.dados.data).substr(0, 10), 
            destino: props.dados.destino, 
            tour: props.dados.tour, 
            numeroAdultos: props.dados.quantidadeAdultos, 
            valorAdulto: props.dados.valorAdulto, 
            numeroCriancas: props.dados.quantidadeCriancas, 
            valorCriancas: props.dados.valorCrianca }]
    );
    const [options, setOptions] = useState("");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/opcoesForm`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token}
        })
            .then((response) => response.json())
            .then((data) => {
                setOptions(data);

            })
            .catch((error) => console.log(error));
    },[])

    const handerEdit = (e) => {
        e.preventDefault();
        
        const editTour = {
            method: 'PUT',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token},
            body: JSON.stringify(calculoTotal[0])
        }
        fetch(`${process.env.REACT_APP_BASE_URL}/tour/${props.idtour}`, editTour).then(response => {
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com API", titulo: "Tour"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).then(data => {
                if(data){
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Editar Tour", titulo: "Tour"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                        props.setUpdateCount(true)
                        document.getElementById(`CloseEditarTour${props.idtour}`).click()
                    },2000)
                }
            })
            .catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Editar Tour: " + e, titulo: "Tour"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                setModalSpinner(false)
            },2000)})



    }

    return (
        <div className="modal fade" tabindex="-1" id={`editarTour${props.idtour}`} data-backdrop="static" data-keyboard="false"  role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar o Tour {props.idtour}</h5>
                        <button className="close" id={`CloseEditarTour${props.idtour}`} type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form>
                    <div className="modal-body">
                        <TourForm atualizarValor={setcalculoTotal}
                            numbTour="1"
                            idReserva ='ppp'
                            options={options}
                            calculoTotal={calculoTotal}/>
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="button" className="btn btn-warning" onClick={handerEdit} ><i className="fas fa-edit"></i> Editar Tour</button>
                    </div>
                    </form>
                    {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                        <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}
                </div>
            </div>

        </div>
    )
}