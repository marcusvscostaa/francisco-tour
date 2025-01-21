import { useState } from "react";
import ModalAlert from "./ModalAlert";
import TourForm from "./TourForm";

export default function ModalEditarTour(props){
    const [modalStatus, setModalStatus] = useState([]);
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
    const [dadosEnviar, setDadosEnviar]   = useState({})

    const handerEdit = (e) => {
        e.preventDefault();
        let dadosAtualizado = {}  
        if((props.dados.data).substr(0, 10) !== calculoTotal[0].data){
            dadosAtualizado = {...dadosEnviar, data: calculoTotal[0].data}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar) 
            console.log("data diferente")   
        }
        if(props.dados.destino != calculoTotal[0].destino){
            dadosAtualizado = {...dadosEnviar, destino: calculoTotal[0].destino}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)
            console.log("detino diferente")   

        }
        if(props.dados.tour != calculoTotal[0].tour){
            dadosAtualizado = {...dadosEnviar, tour: calculoTotal[0].tour}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)  
            console.log("tour diferente")   

        }
        if(props.dados.quantidadeAdultos != calculoTotal[0].numeroAdultos){
            dadosAtualizado = {...dadosEnviar, quantidadeAdultos: calculoTotal[0].numeroAdultos}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)    
        }
        if(props.dados.valorAdulto != calculoTotal[0].valorAdulto){
            dadosAtualizado = {...dadosEnviar, valorAdulto: calculoTotal[0].valorAdulto}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)    
        }
        if(props.dados.quantidadeCriancas != calculoTotal[0].numeroCriancas){
            dadosAtualizado = {...dadosEnviar, quantidadeCriancas: calculoTotal[0].numeroCriancas}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)    
        }
        if(props.dados.valorCrianca != calculoTotal[0].valorCriancas){
            dadosAtualizado = {...dadosEnviar, valorCrianca: calculoTotal[0].valorCriancas}
            setDadosEnviar(dadosAtualizado)
            console.log(dadosEnviar)    
        }

        
        const editTour = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizado)
        }
        fetch(`http://localhost:8800/tour/${props.idtour}`, editTour).then(response => {
            console.log(response);  
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},5000)
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).then(data => {
                if(data){
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Editar Tour", titulo: "Tour"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        //window.location.reload();
                    },5000)
                }
            })
            .catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Editar Tour: " + e, titulo: "Tour"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},5000)})



    }

    return (
        <div className="modal fade" tabindex="-1" id={`editarTour${props.idtour}`} data-backdrop="static" data-keyboard="false"  role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar o Tour {props.idtour}</h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form>
                    <div className="modal-body">
                        <TourForm atualizarValor={setcalculoTotal}
                            numbTour="1"
                            idReserva ='ppp'
                            calculoTotal={calculoTotal}/>
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="button" className="btn btn-warning" onClick={handerEdit} ><i className="fas fa-edit"></i> Editar Tour</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}