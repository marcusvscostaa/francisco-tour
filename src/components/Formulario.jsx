import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";
import { data } from "jquery";
const idReserva = uid().toString();
const idCliente = uid(16).toString();
const idPagamento = uid().toString();

export default function Formulario(props) {

    const [numberTour, setNumberTour] = useState([1]);
    const [addTour, setaddTour] = useState(2);
    const [dadosTour, setdadosTour] = useState(2);
    const [addPag, setaddPag] = useState(false);
    const [formFields, setFormFields] = useState(false);
    const [imagemUpload, setImagemUpload] = useState(false);
    const [comentarioReserva, setcomentarioReserva] = useState("");
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: idReserva});
    const [calculoTotal, setcalculoTotal] = useState([
        { id: "1", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 },
        { id: "2", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 },
        { id: "3", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 },
        { id: "4", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 },
        { id: "5", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 },
        { id: "6", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 }
    ]);

    useEffect(() => {
        console.log(dadosTour)
    },[])
    const handleClick = () => {
        if (numberTour.length < 5) {
            setaddTour(addTour + 1);
            setNumberTour([...numberTour, addTour]);
        } else {
            alert("Não é possivel add mais tour")
        }

    }
 
    const removerTour = (index) => {
        setNumberTour(numberTour => { return numberTour.filter(numberTour => numberTour != index) });
        const dados = calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === index ? { ...tour, numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 } : tour
        );
        setcalculoTotal(dadosAtualizados)
    }
    function handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        const newFormFields = { ...formFields, id: idCliente ,[name]: value }

        setFormFields(newFormFields)
    }
    
    const pagCheck = () => {
        setaddPag(!addPag);
        console.log(numberTour)
    };
    const handleSubmit = (e) => {
        e.preventDefault();
       
        console.log(formFields)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formFields)
        };

        fetch('http://localhost:8800/cliente', requestOptions)
            .then( response => console.log(response.json()))
            .then(data => {
                const reqReserva = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: idReserva,
                        id_cliente: idCliente,
                        comentario: comentarioReserva,
                        valorTotal: (calculoTotal[0].numeroAdultos * calculoTotal[0].valorAdulto + calculoTotal[0].numeroCriancas * calculoTotal[0].valorCriancas
                            + calculoTotal[1].numeroAdultos * calculoTotal[1].valorAdulto + calculoTotal[1].numeroCriancas * calculoTotal[1].valorCriancas
                            + calculoTotal[2].numeroAdultos * calculoTotal[2].valorAdulto + calculoTotal[2].numeroCriancas * calculoTotal[2].valorCriancas
                            + calculoTotal[3].numeroAdultos * calculoTotal[3].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[3].valorCriancas
                            + calculoTotal[4].numeroAdultos * calculoTotal[4].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[4].valorCriancas
                            + calculoTotal[5].numeroAdultos * calculoTotal[5].valorAdulto + calculoTotal[5].numeroCriancas * calculoTotal[5].valorCriancas)
                    })
                }
                fetch('http://localhost:8800/reserva', reqReserva)
                .then( response => console.log(response.json()))
                
                numberTour.map((tour) => {        
                    const requestOps = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(calculoTotal[tour-1])
                };
                    fetch('http://localhost:8800/tour', requestOps)
                    .then( response => console.log(response.json()))
                    console.log(calculoTotal[tour-1])
                })
                const formData = new FormData();
                if(imagemUpload){formData.append("comprovante", imagemUpload)}
                if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
                if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
                if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
                if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
                if(dadosPagForm.valorRestante){formData.append("valorRestante", dadosPagForm.valorRestante);}
                if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
                if(idPagamento){formData.append("idPagamento", idPagamento);}
            

                const reqPagReserva = {
                    method: 'POST',
                    body: formData
                }
                fetch('http://localhost:8800/reservaPagamento', reqPagReserva)
                .then( response => console.log(response.json()))
            })

        
    }

    return (
        <div className="card shadow mb-4">
            {props.modalAlert}
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Dados do Cliente</h6>
            </div>
            
            <div className="card-body">
                <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                    <div className="col-md-5 mb-3">
                        <label for="validationCustom01" className="form-label" >Nome Completo</label>
                        <input type="text" className="form-control form-control-sm" name="nome" id="validationCustom01" onChange={handleChange}  required/>
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputTelefone" className="form-label">Telefone</label>
                        <input type="tel" className="form-control form-control-sm" name="telefone" id="validationCustom02" onChange={handleChange}  required/>
                    </div>
                    <div className="col-md-5 mb-3">
                        <label for="inputEmail" className="form-label aria-describedby">Email</label>
                        <input type="email" className="form-control form-control-sm" name="email" id="inputEmail" onChange={handleChange} required/>
                    </div>
                    <div className="col-md-5 mb-3">
                        <label for="inputEndereco" className="form-label">Endereço</label>
                        <input type="text" className="form-control form-control-sm" name="endereco" id="inpuEndereco" onChange={handleChange}  required/>
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputHotel" className="form-label">Hotel</label>
                        <input type="text" className="form-control form-control-sm" name="hotel" id="inputHotel" onChange={handleChange} />
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputQuarto" className="form-label">Nº Quarto</label>
                        <input type="number" className="form-control form-control-sm" name="quarto" id="inputQuarto" onChange={handleChange} />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="zona">Zona</label>
                        <select className="form-control form-control-sm" name="zona" id="zona" onChange={handleChange}>
                            <option selected>Zona...</option>
                            <option value="Centro">Centro</option>
                            <option value="Bairro">Bairro</option>
                            <option value="Sul">Sul</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="paisOrigem">Pais de Origem</label>
                        <select className="form-control form-control-sm" name="paisOrigem" id="paisOrigem" onChange={handleChange}>
                            <option value="" disabled selected>Pais...</option>
                            <option value="Brasil">Brasil</option>
                            <option value="Chile">Chile</option>
                            <option value="Argentina">Argentina</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="idioma">Idioma</label>
                        <select className="form-control form-control-sm" name="idioma" id="idioma" onChange={handleChange} required>
                            <option value='' disabled selected>Idioma...</option>
                            <option value="Português">Português</option>
                            <option value="Espanhol">Espanhol</option>
                            <option value="Inglês">Inglês</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="validationTextarea">Comentário da Reserva</label>
                        <textarea class="form-control" id="validationTextarea" placeholder="Escreva um comentário..." onChange={(e)=> setcomentarioReserva(e.target.value)}></textarea>
                    </div>

                    {numberTour.map((index) => {
                        return (<TourForm numbTour={index.toString()} removerTour={removerTour}
                            atualizarValor={setcalculoTotal}
                            key={index}
                            idReserva ={idReserva}
                            calculoTotal={calculoTotal}
                        />);
                    })

                    }
                    <div className="col-md-12">

                        {
                            addTour <= 6 ? <button type="button" onClick={handleClick} class="btn btn-icon-split btn-dark btn-sm mb-3">
                                <span class="icon text-white-50">
                                    <i class="fa fa-plus"></i>
                                </span>
                                <span class="text">Adicionar Outro Tour</span>

                            </button> : null

                        }
                    </div>
                    <div className="col-md-12 mb-2 d-flex border-bottom">
                        <div class="form-check">
                            <input class="form-check-input" checked={addPag} onChange={pagCheck} type="checkbox" value="" id="flexCheckDefault" />
                            <label class="form-check-label" for="flexCheckDefault">
                                Adicionar Pagamento
                            </label>
                        </div>
                        <div className="ml-auto mb-2">
                            <p class="text-gray-900 text-lg mb-2">
                                Valor total: R$ {
                                    (calculoTotal[0].numeroAdultos * calculoTotal[0].valorAdulto + calculoTotal[0].numeroCriancas * calculoTotal[0].valorCriancas
                                        + calculoTotal[1].numeroAdultos * calculoTotal[1].valorAdulto + calculoTotal[1].numeroCriancas * calculoTotal[1].valorCriancas
                                        + calculoTotal[2].numeroAdultos * calculoTotal[2].valorAdulto + calculoTotal[2].numeroCriancas * calculoTotal[2].valorCriancas
                                        + calculoTotal[3].numeroAdultos * calculoTotal[3].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[3].valorCriancas
                                        + calculoTotal[4].numeroAdultos * calculoTotal[4].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[4].valorCriancas
                                        + calculoTotal[5].numeroAdultos * calculoTotal[5].valorAdulto + calculoTotal[5].numeroCriancas * calculoTotal[5].valorCriancas).toFixed(2).replace(".", ",")
                                }
                            </p>
                        </div>
                    </div>
                    {
                        addPag == true ? <TourPag dadosPagForm={dadosPagForm} idReserva ={idReserva} setImagemUpload={setImagemUpload} setDadosPagForm = {setDadosPagForm} numbTour="pag" valorTotal={(calculoTotal[0].numeroAdultos * calculoTotal[0].valorAdulto + calculoTotal[0].numeroCriancas * calculoTotal[0].valorCriancas
                            + calculoTotal[1].numeroAdultos * calculoTotal[1].valorAdulto + calculoTotal[1].numeroCriancas * calculoTotal[1].valorCriancas
                            + calculoTotal[2].numeroAdultos * calculoTotal[2].valorAdulto + calculoTotal[2].numeroCriancas * calculoTotal[2].valorCriancas
                            + calculoTotal[3].numeroAdultos * calculoTotal[3].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[3].valorCriancas
                            + calculoTotal[4].numeroAdultos * calculoTotal[4].valorAdulto + calculoTotal[4].numeroCriancas * calculoTotal[4].valorCriancas
                            + calculoTotal[5].numeroAdultos * calculoTotal[5].valorAdulto + calculoTotal[5].numeroCriancas * calculoTotal[5].valorCriancas)} /> : null
                    }
                    <div className="w-100 d-flex ml-3 mr-3 mb-3">
                        <div className=" ml-auto mt-auto">
                            <button type="submit" className="btn btn-lg btn-primary" >Cadastrar</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}