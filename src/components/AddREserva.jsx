import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";
const idReserva = uid().toString();
const idPagamento = uid().toString();

export default  function AddReserva(props){
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
        const [modalStatus, setModalStatus] = useState([]);
    
        useEffect(() => {
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
    
            const newFormFields = { ...formFields, id: props.id ,[name]: value }
    
            setFormFields(newFormFields)
        }
        
        const pagCheck = () => {
            setaddPag(!addPag);
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
                 
            const reqReserva = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                           "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
                 },
                body: JSON.stringify({
                    id: idReserva,
                    id_cliente: props.id,
                    comentario: comentarioReserva
                })
            }   
            await fetch(`${process.env.REACT_APP_BASE_URL}/reserva`, reqReserva)
            .then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Reserva"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))},10000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
              }).then(data => {
                setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: true, message: "Sucesso ao Salvar Reserva", titulo: "Reserva"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))},10000)
              }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:2, mostrar:true, status: false, message: "Erro ao Salvar Reserva: " + e, titulo: "Reserva"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))},10000)})
     
      
               
            numberTour.map(async (tour) => {        
                const requestOps = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                            "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
                },
                body: JSON.stringify(calculoTotal[tour-1])
            };
                
            await fetch(`${process.env.REACT_APP_BASE_URL}/tour`, requestOps)
            .then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},10000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
              }).then(data => {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Tour" , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},10000)
              }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Tour: " + e , titulo: "Tour"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},10000)})
        
                
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
    
                await fetch(`${process.env.REACT_APP_BASE_URL}/reservaPagamento/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`, reqPagReserva)
                .then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Pagamento"}])
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},10000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},10000)
                }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Pagamento: " + e, titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))},10000)})
            }
            
    
            
        }
    return(
        <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
            <div className="col-md-5 mb-3">
                <label for="inputEndereco" className="form-label">Endereço</label>
                <input type="text" value={formFields.endereco || formFields.endereco ==''?formFields.endereco:props.dataClient.endereco} className="form-control form-control-sm" name="endereco" id="inpuEndereco" onChange={handleChange}  required/>
            </div>
            <div className="col-md-2 mb-3">
                <label for="inputHotel" className="form-label">Hotel</label>
                <input type="text" value={formFields.hotel || formFields.hotel ==''?formFields.hotel:props.dataClient.hotel} className="form-control form-control-sm" name="hotel" id="inputHotel" onChange={handleChange} />
            </div>
            <div className="col-md-2 mb-3">
                <label for="inputQuarto" className="form-label">Nº Quarto</label>
                <input type="number" value={formFields.quarto || formFields.quarto ==''?formFields.quarto:props.dataClient.quarto} className="form-control form-control-sm" name="quarto" id="inputQuarto" onChange={handleChange} />
            </div>
            <div className="col-md-3 mb-3">
                <label className="form-label" for="zona">Zona</label>
                <select value={formFields.zona || formFields.zona ==''?formFields.zona:props.dataClient.zona} className="form-control form-control-sm" name="zona" id="zona" onChange={handleChange}>
                    <option selected>Zona...</option>
                    <option value="Centro">Centro</option>
                    <option value="Bairro">Bairro</option>
                    <option value="Sul">Sul</option>
                </select>
            </div>
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
                addPag == true ? <TourPag dadosPagForm={dadosPagForm} idReserva ={idReserva} setImagemUpload={setImagemUpload} setDadosPagForm = {setDadosPagForm} numbTour="pag" valorTotal={
                    calculoTotal.reduce((sum, item) => sum + ((item.numeroAdultos * item.valorAdulto) + (item.numeroCriancas*item.valorCriancas)),0)} /> : null
            }
            <div className="w-100 d-flex ml-3 mr-3 mb-3">
                <div className=" ml-auto mt-auto">
                    <button type="submit" className="btn btn-lg btn-primary" >Cadastrar</button>
                </div>
            </div>
        </form>
    )
}