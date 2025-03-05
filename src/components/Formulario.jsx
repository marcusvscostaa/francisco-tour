import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
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

const idReserva = uid().toString();
const idCliente = uid(16).toString();
const idPagamento = uid().toString();

export default function Formulario(props) {

    const [numberTour, setNumberTour] = useState([1]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [addTour, setaddTour] = useState(2);
    const [dadosTour, setdadosTour] = useState(2);
    const [addPag, setaddPag] = useState(false);
    const [formReserva, setformReserva] = useState({id: idReserva, status: 'Confirmado'});
    const [formCliente, setformCliente] = useState(false);
    const [imagemUpload, setImagemUpload] = useState(false);
    const [comentarioReserva, setcomentarioReserva] = useState("");
    const [options, setOptions] = useState("");
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: idReserva});
    const [calculoTotal, setcalculoTotal] = useState([
        { id: "1", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' },
        { id: "2", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' },
        { id: "3", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' },
        { id: "4", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' },
        { id: "5", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' },
        { id: "6", id_reserva: 0, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0,status: 'Confirmado' }
    ]);
    const [modalStatus, setModalStatus] = useState([]);

    useEffect(() => {
        setOptions(optionForm)
    },[])
    const handleClick = () => {
        if (numberTour.length <= 5) {
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

        const newformCliente = { ...formCliente, id: idCliente ,[name]: value }

        setformCliente(newformCliente)
    }
    function handleReserva(event) {
        const name = event.target.name
        const value = event.target.value

        const id = props.idCliente.status? props.idCliente.id: idCliente

        const newformReservsa = { ...formReserva,[name]: value, id_cliente: id, status: 'Confirmado', dataReserva: new Date().toISOString().split('T')[0] }

        setformReserva(newformReservsa)

    }
    
    const pagCheck = () => {
        setaddPag(!addPag);
    };
    const handleSubmit = (e) => {
        e.preventDefault();     

        if((!props.addReserva)){
            instance.post('/cliente', JSON.stringify(formCliente))
            .then(response => {
                console.log(response)
                if (response.data){
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: true, message: "Sucesso ao Salvar Cliente", titulo: "Cliente"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1));
                        setModalSpinner(false)
                    },2000)
                }else{
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Cliente"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                        setModalSpinner(false)
                    },2000)
                    throw new Error('Network response was not ok');
                }})
                .catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: false, message: "Erro ao Salvar Cliente: " + e , titulo: "Cliente"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                    setModalSpinner(false)
                },2000)})   
        }

        setTimeout(()=>{
            instance.post('/reserva', JSON.stringify(formReserva))
            .then(response => {
                console.log(response)
                if (response.data){
                    setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: true, message: "Sucesso ao Salvar Reserva", titulo: "Reserva"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                    setModalSpinner(false)
                },2000) 
                }else{
                    setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Reserva"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                        setModalSpinner(false)
                    },2000)
                    throw new Error('Network response was not ok');
                }})
                .catch(e => {
                    setModalStatus(prevArray => [...prevArray, {id:2, mostrar:true, status: false, message: "Erro ao Salvar Reserva: " + e, titulo: "Reserva"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                        setModalSpinner(false)
                    },2000)})
        },'300')
          
        setTimeout(() => {
            numberTour.map((tour)=>{            
                setTimeout(()=>{          
                    instance.post('/tour', JSON.stringify(calculoTotal[tour-1]))
                    .then((response) => {
                        console.log(response)
                        if (response.data) {
                            setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                                window.location.replace("/minhasReservas");
                            },3000)
                        }else{
                            setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)
                            throw new Error('Network response was not ok');
                        }
                    }).catch(e => {
                        setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Tour: " + e , titulo: "Tour"}])
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)})
                },'300')
            })
        },'600') 
               
        
        if(addPag){
            const formData = new FormData();
            //if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            if(idPagamento){formData.append("idPagamento", idPagamento);}
            formData.append("status", "Pago");

            setTimeout(() =>{
                instance.post('/reservaPagamento', formData)
                .then(response => {
                    console.log(response)
                    if (response.data){
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}])
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},3000)
                    }else{
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Pagamento"}])
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},3000)
                        throw new Error('Network response was not ok');
                    }})
                .catch(e => {
                    setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Pagamento: " + e, titulo: "Pagamento"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},3000)})
            }, '900')
        }
        

        
    }

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
                        <input type="text" value={formReserva.endereco} className="form-control form-control-sm" name="endereco" id="inpuEndereco" onChange={handleReserva}  required/>
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
                            {options&& options.paisOrigem.map((item) => {
                                    return <option value={item}>{item}</option>
                                })}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3" >
                        <label className="form-label" for="idioma">Idioma</label>
                        <select value={formCliente.idioma} className="form-control form-control-sm" name="idioma" id="idioma" onChange={handleChange} required>
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

                    {numberTour.map((index) => {
                        return (<TourForm numbTour={index.toString()} removerTour={removerTour}
                            atualizarValor={setcalculoTotal}
                            key={index}
                            idReserva ={idReserva}
                            calculoTotal={calculoTotal}
                            options={options}
                        />);
                    })

                    }
                    <div className="col-md-12">

                        {
                            addTour <= 6 ? <button type="button" onClick={handleClick} className="btn btn-icon-split btn-dark btn-sm mb-3">
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
                        addPag == true ? <TourPag title='Adicionar' 
                                            dadosPagForm={dadosPagForm} 
                                            idReserva ={idReserva} 
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