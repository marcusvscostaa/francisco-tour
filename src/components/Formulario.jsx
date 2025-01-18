import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";

const idReserva = uid().toString();
const idCliente = uid(16).toString();
const idPagamento = uid().toString();

export default function Formulario(props) {

    const [numberTour, setNumberTour] = useState([1]);
    const [addTour, setaddTour] = useState(2);
    const [dadosTour, setdadosTour] = useState(2);
    const [addPag, setaddPag] = useState(false);
    const [formReserva, setformReserva] = useState({id: idReserva});
    const [formCliente, setformCliente] = useState(false);
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
    const [modalStatus, setModalStatus] = useState([]);

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

        const newformCliente = { ...formCliente, id: idCliente ,[name]: value }

        setformCliente(newformCliente)
    }
    function handleReserva(event) {
        const name = event.target.name
        const value = event.target.value

        const id = props.idCliente.status? props.idCliente.id: idCliente

        const newformReservsa = { ...formReserva,[name]: value, id_cliente: id }

        setformReserva(newformReservsa)

        console.log(formReserva)
    }
    
    const pagCheck = () => {
        setaddPag(!addPag);
        console.log(numberTour)
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        console.log(formCliente)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formCliente)
        };        

        if((!props.addReserva)){
            await fetch('http://localhost:8800/cliente', requestOptions)
            .then(response => {
                if(response.status === 200) {
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: true, message: "Sucesso ao Salvar Cliente", titulo: "Cliente"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1));
                    },5000)
                }
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Cliente"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))},5000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
              }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: false, message: "Erro ao Salvar Cliente: " + e , titulo: "Cliente"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))},5000)})
     
        }

        
        
        const reqReserva = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formReserva)
        }   
        await fetch('http://localhost:8800/reserva', reqReserva)
        .then(response => {
            if(response.status === 200) {
                setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: true, message: "Sucesso ao Salvar Reserva", titulo: "Reserva"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                },5000)
            }
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Reserva"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))},5000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:2, mostrar:true, status: false, message: "Erro ao Salvar Reserva: " + e, titulo: "Reserva"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))},5000)})
 
  
           
        numberTour.map(async (tour) => {        
            const requestOps = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(calculoTotal[tour-1])
        };
            
        await fetch('http://localhost:8800/tour', requestOps)
        .then(response => {
            if(response.status === 200) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    window.location.reload();
                },5000)
            }
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Tour: " + e , titulo: "Tour"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)})
    
            
        })
               
        
        if(addPag){
            const formData = new FormData();
            if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            if(idPagamento){formData.append("idPagamento", idPagamento);}
        
    
            const reqPagReserva = {
                method: 'POST',
                body: formData
            }

            await fetch('http://localhost:8800/reservaPagamento', reqPagReserva)
            .then(response => {
            if(response.status === 200){
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},5000)
            }
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},5000)
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Pagamento: " + e, titulo: "Pagamento"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},5000)})
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
                            <option selected>Zona...</option>
                            <option value="Centro">Centro</option>
                            <option value="Bairro">Bairro</option>
                            <option value="Sul">Sul</option>
                        </select>
                    </div>
                    {!(props.addReserva)&&
                    <>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="paisOrigem">Pais de Origem</label>
                        <select value={formCliente.paisOrigem} className="form-control form-control-sm" name="paisOrigem" id="paisOrigem" onChange={handleChange}>
                            <option value="" disabled selected>Pais...</option>
                            <option value="Brasil">Brasil</option>
                            <option value="Chile">Chile</option>
                            <option value="Argentina">Argentina</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" for="idioma">Idioma</label>
                        <select value={formCliente.idioma} className="form-control form-control-sm" name="idioma" id="idioma" onChange={handleChange} required>
                            <option value='' disabled selected>Idioma...</option>
                            <option value="Português">Português</option>
                            <option value="Espanhol">Espanhol</option>
                            <option value="Inglês">Inglês</option>
                        </select>
                    </div></>
                    }
                    <div className="col-md-6 mb-3">
                        <label for="validationTextarea">Comentário da Reserva</label>
                        <textarea value={comentarioReserva} className="form-control" id="validationTextarea" placeholder="Escreva um comentário..." onChange={(e)=> setcomentarioReserva(e.target.value)}></textarea>
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
                        addPag == true ? <TourPag title='Adicionar' dadosPagForm={dadosPagForm} idReserva ={idReserva} setImagemUpload={setImagemUpload} setDadosPagForm = {setDadosPagForm} numbTour="pag" valorTotal={
                            calculoTotal.reduce((sum, item) => sum + ((item.numeroAdultos * item.valorAdulto) + (item.numeroCriancas*item.valorCriancas)),0)} /> : null
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