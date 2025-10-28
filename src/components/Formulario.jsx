import { useEffect, useState, useCallback, useRef } from "react";
import { createCliente, createReserva, createTour, createPagamento } from "../FranciscoTourService";
import TourForm from "./TourForm";
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";
import optionForm from "./lista.json"
import axios from "axios";

const idCliente = uid(16).toString();

function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);
    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
}

export default function Formulario(props) {

    const [modalSpinner, setModalSpinner] = useState(false);
    const [addTour, setaddTour] = useState(2);
    const [addPag, setaddPag] = useState(false);
    const [formReserva, setformReserva] = useState({});
    const [formCliente, setformCliente] = useState(false);
    const [imagemUpload, setImagemUpload] = useState(false);
    const [options, setOptions] = useState("");
    const [dadosPagForm, setDadosPagForm] = useState({});
    const [calculoTotal, setCalculoTotal] = useState([
        { 
            id: 1,
            data:'', 
            destino: '', 
            tour: "", 
            numeroAdultos: 0, 
            valorAdulto: 0, 
            numeroCriancas: 0, 
            valorCriancas: 0,
        }
    ]);
    const nextTourId = useRef(2);
    const [modalStatus, setModalStatus] = useState([]);
    const [sugestoesAPI, setSugestoesAPI] = useState([]);

    useEffect(() => {
        setOptions(optionForm)
    },[])
    const adicionarTour = () => {
        if (calculoTotal.length < 6) {
            const novoTour = {
                id: nextTourId.current,
                data:'', 
                destino: '', 
                tour: "", 
                numeroAdultos: 0, 
                valorAdulto: 0, 
                numeroCriancas: 0, 
                valorCriancas: 0,
            };
            
            setCalculoTotal(prevTours => [...prevTours, novoTour]);
            nextTourId.current += 1; 
        } else {
            alert("Não é possivel add mais tour");
        }
    };

    const buscarSugestoesAPI = async (termoBusca) => {
        if (!termoBusca || termoBusca.length < 3) {
            setSugestoesAPI([]);
            return;
        }

        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: termoBusca,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: 'cl' 
                }
            });
            
            const sugestoesFormatadas = response.data.map(item => item.name);

            setSugestoesAPI(sugestoesFormatadas);
        } catch (error) {
            console.error("Erro ao buscar sugestões de endereço (Nominatim):", error.response || error);
            setSugestoesAPI([]);
        }
    };

    const buscarSugestoesDebounced = useDebounce(buscarSugestoesAPI, 500);
 
    const removerTour = (tourId) => {
        setCalculoTotal(prevTours => prevTours.filter(tour => tour.id !== tourId));
    };
    
    function handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        const newformCliente = { ...formCliente ,[name]: value }

        setformCliente(newformCliente)
    }

    function handleReserva(event) {
        const name = event.target.name
        const value = event.target.value

        const id = props.idCliente.status? props.idCliente.id: idCliente

        const newformReservsa = { ...formReserva,[name]: value, id_cliente: id, status: 'Confirmado', dataReserva: new Date().toISOString().split('T')[0] }

        setformReserva(newformReservsa)

        if (name === 'endereco') {
            buscarSugestoesDebounced(value);
        }

    }
    
    const pagCheck = () => {
        setaddPag(!addPag);
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();     
        setModalSpinner(true);
        let success = true; 

        let idClienteFinal = props.idCliente.status ? props.idCliente.id : null; 
        let idReservaFinal = null; 

        if (!props.addReserva && formCliente) {
            idClienteFinal = formCliente.id || idCliente;
        }

        try {
            if (!props.addReserva) {
                const clienteResponse = await createCliente(formCliente); 
                if (!clienteResponse.data || !clienteResponse.data.id) throw new Error('Falha ao Salvar Cliente');
                idClienteFinal = clienteResponse.data.id;
                setModalStatus(prev => [...prev, {id:1, mostrar:true, status: true, message: "Sucesso ao Salvar Cliente", titulo: "Cliente"}]);
            }

            const dadosReservaFinal = {
                ...formReserva,
                id_cliente: idClienteFinal, 
            };

            const reservaResponse = await createReserva(dadosReservaFinal); 
            if (!reservaResponse.data || !reservaResponse.data.idR) throw new Error('Falha ao Salvar Reserva');
            
            idReservaFinal = reservaResponse.data.idR;
            console.log(idClienteFinal);
            setModalStatus(prev => [...prev, {id:2, mostrar:true, status: true, message: "Sucesso ao Salvar Reserva", titulo: "Reserva"}]);

            if (idReservaFinal) { 
                const tourPromises = calculoTotal.map(tourData => {
                    
                    const tourDataParaEnvio = { 
                        ...tourData, 
                        id_reserva: idReservaFinal 
                    };

                    delete tourDataParaEnvio.id; 
                    return createTour(tourDataParaEnvio);
                });

                const tourResponses = await Promise.all(tourPromises);

                if (tourResponses.some(res => !res.data)) {
                    throw new Error('Falha em um ou mais Tours'); 
                }
                setModalStatus(prev => [...prev, {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tours", titulo: "Tour"}]);

                if (addPag) {
                const formData = new FormData();
                if(idReservaFinal){formData.append("id_reserva", idReservaFinal);}
                if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
                if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
                if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
                if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}

                if(imagemUpload){
                    formData.append("imagem", imagemUpload); 
                }

                const pagamentoResponse = await createPagamento(formData);
                if (!pagamentoResponse.data) throw new Error('Falha ao Salvar Pagamento');
                setModalStatus(prev => [...prev, {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}]);
            }

            } else {
                throw new Error('Falha crítica: ID da Reserva não pôde ser determinado para Tours.');
            }
            
            

        } catch (e) {
            success = false;
            const errorMessage = e.message.includes("Falha") ? e.message : `Erro de Conexão/Sistema: ${e.message}`;
            setModalStatus(prev => [...prev, {id:5, mostrar:true, status: false, message: errorMessage, titulo: "Erro Global"}]);
            console.error("Erro no fluxo de submissão:", e);

        } finally {
            setModalSpinner(false);
            
            setTimeout(() => {
                setModalStatus([]); 
                if (success) {
                    window.location.replace("/minhasReservas");
                }
            }, 3000); 
        }
    };

    return (
        <div className="card shadow mb-4">
            <ModalAlert dados={modalStatus} />
            {props.modalAlert}
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">{props.title}</h6>
            </div>
            
            <div className="card-body">
                <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                    {!(props.addReserva)?
                    <>
                    <div className="col-md-5 mb-3">
                        <label for="validationCustom01" className="form-label" >Nome Completo</label>
                        <input type="text" value={formCliente.nome} className="form-control form-control-sm" name="nome" id="validationCustom01" onChange={handleChange}  required/>
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputTelefone" className="form-label">Telefone</label>
                        <input type="tel" value={formCliente.telefone} className="form-control form-control-sm" name="telefone" id="validationCustom02" onChange={handleChange}  required/>
                    </div>
                    <div className="col-md-5 mb-3">
                        <label for="inputEmail" className="form-label aria-describedby">Email</label>
                        <input type="email" value={formCliente.email} className="form-control form-control-sm" name="email" id="inputEmail" onChange={handleChange} required/>
                    </div></>:""
                    }
                    <div className="col-md-5 mb-3">
                        <label for="inputEndereco" className="form-label">Endereço</label>
                        <input type="text" value={formReserva.endereco} className="form-control form-control-sm" name="endereco" id="inputEndereco" list="sugestoes-api-endereco" onChange={handleReserva}  required/>
                        <datalist id="sugestoes-api-endereco">
                            {sugestoesAPI.map((sugestao, index) => (
                                <option key={index} value={sugestao} /> 
                            ))}
                        </datalist>
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputHotel" className="form-label">Hotel</label>
                        <input type="text" value={formReserva.hotel} className="form-control form-control-sm" name="hotel" id="inputHotel" onChange={handleReserva} />
                    </div>
                    <div className="col-md-2 mb-3">
                        <label for="inputQuarto" className="form-label">Nº Quarto</label>
                        <input type="number" value={formReserva.quarto} className="form-control form-control-sm" name="quarto" id="inputQuarto" onChange={handleReserva} />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="zona">Zona</label>
                        <select value={formReserva.zona} className="form-control form-control-sm" name="zona" id="zona" onChange={handleReserva}>
                            <option value="" disabled>Selecione a Zona</option>  
                            {options&& options.zona.map((item) => {
                                return <option value={item}>{item}</option>
                            })}
                        </select>
                    </div>
                    {!(props.addReserva)&&
                    <>
                    <div className="col-md-3 mb-3" >
                        <label className="form-label" for="paisOrigem">Pais de Origem</label>
                        <select value={formCliente.paisOrigem} className="form-control form-control-sm" name="paisOrigem" id="paisOrigem" onChange={handleChange}>
                            <option value="" disabled>Selecione Pais de Origem</option>  
                            {options&& options.paisOrigem.map((item) => {
                                    return <option value={item}>{item}</option>
                                })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3" >
                        <label className="form-label" for="idioma">Idioma</label>
                        <select value={formCliente.idioma} className="form-control form-control-sm" name="idioma" id="idioma" onChange={handleChange} required>
                            <option value="" disabled>Selecione o Idioma</option>  
                            {options&& options.idioma.map((item) => {
                                    return <option value={item}>{item}</option>
                                })}
                        </select>
                    </div></>
                    }
                    <div className="col-md-6 mb-3">
                        <label for="validationTextarea">Comentário da Reserva</label>
                        <textarea value={formReserva.comentario} name="comentario" className="form-control" placeholder="Escreva um comentário..." onChange={handleReserva}></textarea>
                    </div>

                    {calculoTotal.map((tourData, index) => {
                        return (
                            <TourForm 
                                numbTour={tourData.id} 
                                tourIndex={index}    
                                removerTour={removerTour}
                                atualizarValor={setCalculoTotal} 
                                key={tourData.id}
                                calculoTotal={calculoTotal}
                                options={options}
                            />
                        );
                    })}
                    <div className="col-md-12">

                        {
                            addTour <= 6 ? <button type="button" onClick={adicionarTour} className="btn btn-icon-split btn-dark btn-sm mb-3">
                                <span className="icon text-white-50">
                                    <i className="fa fa-plus"></i>
                                </span>
                                <span className="text">Adicionar Outro Tour</span>

                            </button> : null

                        }
                    </div>
                    <div className="col-md-12 mb-2 d-flex border-bottom">
                        <div className="form-check">
                            <input className="form-check-input" checked={addPag} onChange={pagCheck} type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                                Adicionar Pagamento
                            </label>
                        </div>
                        <div className="ml-auto mb-2">
                            <p className="text-gray-900 text-lg mb-2">
                                Valor total: R$ {
                                    calculoTotal.reduce((sum, item) => sum + ((item.numeroAdultos * item.valorAdulto) + (item.numeroCriancas*item.valorCriancas)),0).toFixed(2).replace(".", ",")
                                }
                            </p>
                        </div>
                    </div>
                    {
                        addPag === true ? <TourPag title='Adicionar' 
                                            dadosPagForm={dadosPagForm} 
                                            setImagemUpload={setImagemUpload}
                                            namePago={'Pago'} 
                                            removerPag={setaddPag} 
                                            type={"Pagamento"} 
                                            devido={'Devido'} 
                                            setDadosPagForm = {setDadosPagForm}
                                            numbTour="pag"
                                            options={options} 
                                            valorTotal={
                            calculoTotal.reduce((sum, item) => sum + ((item.numeroAdultos * item.valorAdulto) + (item.numeroCriancas*item.valorCriancas)),0)} /> : null
                    }
                    <div className="w-100 d-flex ml-3 mr-3 mb-3">
                        <div className=" ml-auto mt-auto">
                            <button type="submit" className="btn btn-lg btn-primary" >Cadastrar</button>
                        </div>
                    </div>
                </form>
            </div>
            {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                                <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>}
        </div>
    )
}