import { useState } from "react"

export default function PainelUsuario(){
    const [dataForm, setDataForm] = useState('')
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
        const requestOps = {
            method: 'POST',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'},
            body: JSON.stringify(dataForm)
        };
        fetch(`${process.env.REACT_APP_BASE_URL}/signup`, requestOps)
        .then(response => response.json()) // recebe a resposta e transforma em json 
        .then(data => { 
        alert(data.mensagem)
        if(data.status === "sucesso"){
            alert("Funciona")
            }
        })
        .catch(error => { // se der error no servidor ele retornara uma msg de error
            console.error('erro',error)
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <p>usuário</p>
            <input name="username" type="text"className="form-control w-25 mb-3" onChange={handleChange} required/>
            <p>senha</p>
            <input name="password" type="password" className="form-control w-25 mb-2" onChange={handleChange} required/>
            <label className="form-label" for="zona">Acesso</label>
                <select className="form-control form-control-sm w-25" name="acesso" id="acesso" onChange={handleChange}>                    
                    <option value='ADMIN'>ADMIN</option>
                    <option value='VENDEDOR'>VENDEDOR</option>                
                </select>
            <button type="submit" className="btn btn-primary">Cadastrar</button>
        </form>
    )
}