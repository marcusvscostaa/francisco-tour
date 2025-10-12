import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import ModalAlert from "./ModalAlert";
import optionForm from "./lista.json"
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
      }
  });



export default function ModalAdicionarTour(props){
        const [calculoTotal, setcalculoTotal] = useState([
        { id: "1", id_reserva: props.id, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 } ]);
        const [modalStatus, setModalStatus] = useState([]);
        const [modalSpinner, setModalSpinner] = useState(false);
        const [options, setOptions] = useState("");

        useEffect(()=>{
            setOptions(optionForm)    
        },[])

        const handleSubmit = async (e) => {
            e.preventDefault()

            instance.post('/tour', JSON.stringify(calculoTotal[0]))
            .then((response) => {
                console.log(response)
                if (response.data) {
                    setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                                    props.setUpdateCount(true)
                                    setModalSpinner(false)
                                    document.getElementById(`modalX${props.id}`).click()
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
    
    return(
        <div className="modal fade text-dark" id={`modalT${props.id}`} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <ModalAlert dados={modalStatus} />
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Adicionar Tour</h5>
                    <button id={`modalX${props.id}`} className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <TourForm
                            options={options}
                            numbTour={'1'} 
                            atualizarValor={setcalculoTotal}
                            key={'1'}
                            id_reserva = {props.id}
                            calculoTotal= {calculoTotal} />
                             <div className="col-md-12 d-flex">
                                <button type="submit" className="ml-auto btn btn-primary" >Salvar Tour</button>
                            </div>
                    </form>                   
                </div>
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