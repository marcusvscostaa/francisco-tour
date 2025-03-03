import { useState, useEffect } from "react";
import ModalAlert from "./ModalAlert";
import TourForm from "./TourForm";
import optionForm from "./lista.json"
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
      }
  });



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
        setOptions(optionForm)
    },[])

    const handerEdit = (e) => {
        e.preventDefault();
        instance.put(`/tour/${props.idtour}`, JSON.stringify(calculoTotal[0]))
        .then((response) => {
            console.log(response)
            if (response.data) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                                setModalSpinner(false)
                                props.setUpdateCount(true)
                                document.getElementById(`CloseEditarTour${props.idtour}`).click()
                },3000)
            }else{
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)
                throw new Error('Network response was not ok');
            }
        }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Tour: " + e , titulo: "Tour"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)})

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