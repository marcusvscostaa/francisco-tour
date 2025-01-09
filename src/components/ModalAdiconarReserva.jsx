import AddReserva from "./AddREserva";
import Formulario from "./Formulario";

export default function ModalAdiconarReserva(props){

    return(
         <div className="modal fade text-dark" id={`mr${props.id}`} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">Nova Reserva</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Formulario title="Dados Reserva" idCliente={{status: true, id: props.id}}addReserva={true} dataClient ={props.dados} />                  
                        </div>
                    </div>
                </div>
            </div>
    )
}