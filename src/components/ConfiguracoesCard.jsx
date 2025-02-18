import { useState } from "react";
import { useEffect } from "react"

export default function ConfiguracoesCard(){
    const [dados, setDadosPagForm] = useState('')
    const [inputOption, setInputOption] = useState({zona: '', paisOrigem: '', idioma:'', destino:'', tour:'', formaPagamento:''})
    const [updateCount, setUpdateCount] = useState(false)
    useEffect(()=>{
        fetch("http://192.168.0.105:8800/opcoesForm", {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                setDadosPagForm(data);
                console.log(dados)
                //console.log(data);
            })
            .catch((error) => console.log(error));
        
        setUpdateCount(false)

        console.log(dados)
    },[updateCount])
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        const newData ={...inputOption, [name]: value}

        setInputOption(newData)

        console.log(inputOption)

    }
    const handleSubmit = (typeData, item) => {
        console.log(typeData, item)
        if(item !== null && item !== '') {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({typeData: typeData, item: item})
        };
        fetch('http://192.168.0.105:8800/opcoesForm', requestOptions)
        .then(response => {
            console.log(response)
            setInputOption({zona: '', paisOrigem: '', idioma:'', destino:'', tour:'', formaPagamento:''});
            setUpdateCount(true)
          })
        }else{alert("O campo está vazio")}

    }
    const handleDelete = (typeData, item) => {
        const requestOptions = {
            method: 'DELETE'
        };
        fetch(`http://192.168.0.105:8800/opcoesForm/${typeData}/${item}`, requestOptions)
        .then(response => {
            console.log(response)
          })
          setUpdateCount(true)

    }
    return(
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Configurações Formulário</h6>
            </div>
            
            <div className="card-body">
               
               {dados&&
               <div className="row g-3  d-flex">
                <div class="p-3 col-md-3 mb-3">
                    <h5>Zona</h5>
                    <div class="input-group mb-3">
                        <input type="text" name='zona' value={inputOption.zona} class="form-control" placeholder="Nova zona" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('zona', inputOption.zona)}>Add</button>
                        </div>
                    </div>
 
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.zona.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('zona', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div class="p-3 col-md-3 mb-3">
                    <h5>Pais de Origem</h5>
                    <div class="input-group mb-3">
                        <input type="text" value={inputOption.paisOrigem} name="paisOrigem" class="form-control" placeholder="Novo Pais" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('paisOrigem', inputOption.paisOrigem)}>Add</button>
                        </div>
                    </div>
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.paisOrigem.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('paisOrigem', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div class="p-3 col-md-3 mb-3">
                    <h5>Idioma</h5>
                    <div class="input-group mb-3">
                        <input name="idioma" value={inputOption.idioma} type="text" class="form-control" placeholder="Novo Idioma" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('idioma', inputOption.idioma)}>Add</button>
                        </div>
                    </div>
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.idioma.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('idioma', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div class="p-3 col-md-3 mb-3">
                    <h5>Destino</h5>
                    <div class="input-group mb-3">
                        <input name="destino" value={inputOption.destino} type="text" class="form-control" placeholder="Novo Destino" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('destino', inputOption.destino)}>Add</button>
                        </div>
                    </div>
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.destino.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('destino', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div class="p-3 col-md-3 mb-3">
                    <h5>Tour</h5>
                    <div class="input-group mb-3">
                        <input name="tour" value={inputOption.tour} type="text" class="form-control" placeholder="Novo Tour" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange} />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('tour', inputOption.tour)}>Add</button>
                        </div>
                    </div>
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.tour.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('tour', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                <div class="p-3 col-md-3 mb-3">
                    <h5>Forma de Pagamento</h5>
                    <div class="input-group mb-3">
                        <input name="formaPagamento" value={inputOption.formaPagamento} type="text" class="form-control" placeholder="Nova Forma Pagamento" aria-label="Recipient's username" aria-describedby="button-addon2" onChange={handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleSubmit('formaPagamento', inputOption.formaPagamento)}>Add</button>
                        </div>
                    </div>
                    <div data-spy="scroll">
                    <ul class="list-group list-group-flush" style={{overflow:'scroll', maxHeight: '200px',overflowX: 'hidden'}}>
                        {dados.formaPagamento.map((dado) => {
                            return (
                                <li class="list-group-item">
                                    <div className="d-flex">
                                        {dado}
                                        <button type="button" title="Deletar" data-toggle="modal" className="btn btn-sm btn-danger ml-auto" onClick={() => handleDelete('formaPagamento', dado)}><i className="fa fa-trash"></i></button> 
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    </div>
                </div>
                </div>}
            </div>
        </div>
    )
}