import { useState } from "react"
import ModalAlert from "./ModalAlert";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
      }
  });

export default function PainelUsuario(){
    const [dataForm, setDataForm] = useState('')
    const [modalSpinner, setModalSpinner] = useState(false);
    const [modalStatus, setModalStatus] = useState([]);

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setDataForm((dado)=> ({
            ...dado,
            [name]: value

        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        instance.post('/signup', JSON.stringify(dataForm))
            .then(response => {
                console.log(response)
                if (response.data){
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: true, message: "Sucesso ao Cadastrar Usuário", titulo: "Usuário"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1));
                        setModalSpinner(false)
                    },3000)
                }else{
                    setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Usuário"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                        setModalSpinner(false)
                    },3000)
                    throw new Error('Network response was not ok');
                }})
                .catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: false, message: "Erro ao Cadastrar Usuário: " + e , titulo: "Usuário"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                    setModalSpinner(false)
                },3000)})   
       
    }

    return(
        <div>
           <ModalAlert dados={modalStatus} />
        <form onSubmit={handleSubmit}>
            <p>usuário</p>
            <input name="username" type="text"className="form-control w-25 mb-3" onChange={handleChange} required/>
            <p>senha</p>
            <input name="password" type="password" className="form-control w-25 mb-2" onChange={handleChange} required/>
            <label className="form-label" for="zona">Acesso</label>
                <select className="form-control form-control-sm w-25" name="acesso" id="acesso" onChange={handleChange} required>                    
                    <option selected value='ADMIN'>ADMIN</option>
                    <option value='VENDEDOR'>VENDEDOR</option>                
                </select>
            <button type="submit" className="btn btn-primary" disabled={modalSpinner}>{modalSpinner?'Cadastrando...':'Cadastrar'} 
            {modalSpinner&&
            <>
                <span class="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                <span class="sr-only">Loading...</span>
             </> 
                }
            </button>
        </form>
        
        </div>
    )
}