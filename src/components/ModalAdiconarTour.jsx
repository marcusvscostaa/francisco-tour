import { useState } from "react";
import TourForm from "./TourForm";
import ModalAlert from "./ModalAlert";

export default function ModalAdicionarTour(props){
        const [calculoTotal, setcalculoTotal] = useState([
        { id: "1", id_reserva: props.id, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 } ]);
        const [modalStatus, setModalStatus] = useState([]);

        const handleSubmit = async (e) => {
            e.preventDefault()
            const requestOps = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calculoTotal[0])
            };
                
            await fetch('http://localhost:8800/tour', requestOps)
            .then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                if(data){
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    window.location.reload();
                 },5000)
                }
            }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Tour: " + e , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)})
        }
    
    return(
        <div className="modal fade text-dark" id={`modalT${props.id}`} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <ModalAlert dados={modalStatus} />
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Adicionar Tour</h5>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <TourForm
                            numbTour={'1'} 
                            atualizarValor={setcalculoTotal}
                            key={'1'}
                            idReserva = {props.id}
                            calculoTotal= {calculoTotal} />
                             <div className="col-md-12 d-flex">
                                <button type="submit" className="ml-auto btn btn-primary" >Salvar Tour</button>
                            </div>
                    </form>                   
                </div>
            </div>
        </div>
    </div>
    )
}