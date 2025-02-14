import { use, useEffect } from "react"
import { useState } from "react"

export default function TourPag(props){

    const [valorRestante, setValorRestante] = useState(props.valorTotal)
    const [nomeArquivo, setNomeArquivo] = useState("Escolher Arquivo")
    const [image, setImage] = useState("")
    const [arquvio, setArqivo] = useState("")

    useEffect(()=>{
        if(props.editPag){
            props.setDadosPagForm({
                dataPagamento: props.dados[0].dataPagamento.substr(0, 10),
                formaPagamento: props.dados[0].formaPagamento,
                valorPago: props.dados[0].valorPago,
                comentario: props.dados[0].comentario,
            })
            if(props.type === 'Pagamento'){
                setImage(`http://192.168.0.105:8800/imagem/${props.dados[0].idPagamento}`)
            }else{
                setImage(`http://192.168.0.105:8800/imagemEstorno/${props.dados[0].idPagamento}`)
            }
            setValorRestante(props.dados[0].valorPago)
        }
    },[])
    
    const handleChange = (e) => {
        
        const name = e.target.name
        const value = e.target.value
        if(name === "valorPago"){
            
            setValorRestante(value)
            const newFormFields = { ...props.dadosPagForm,valorRestante:(props.valorTotal - valorRestante) ,[name]: value}
            props.setDadosPagForm(newFormFields)
        }else if(name === "comprovante"){
            setNomeArquivo(e.target.files[0])
            const file = e.target.files[0]
            const reader = new FileReader();
            reader.onloadend = () => {
              setImage(reader.result);
              console.log(image)
              props.setImagemUpload(e.target.files[0])
            };
            reader.readAsDataURL(file);

        }else{
            const newFormFields = { ...props.dadosPagForm ,[name]: value}
            props.setDadosPagForm(newFormFields)
            console.log(props.dadosPagForm.dataPagamento)
        }
        console.log(props.dadosPagForm)

    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("comprovante", nomeArquivo);
        formData.append("id_reserva", props.idReserva);


        const reqPagReserva = {
            method: 'POST',
            body: formData
        }
        fetch('http://192.168.0.105:8800/upload-imagem', reqPagReserva)
        .then( response => console.log(response.json()))
    }
    return(
        <div className="col-md-12">
        <div className="card mb-4 border-dark">
          <div className="card-header text-lg">
              {`${props.title} ${props.type} ${props.editPag ? props.dados[0].idPagamento : ''}`}
              <button type="button" onClick={() => props.removerPag(false)} className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
          </div>
          <div className="card-body">
              <form>
              <div className="row g-3">
                  <div className="col-md-2 mb-3">
                      <label for="inputDate" className="form-label">Data</label>
                      <input type="date" name="dataPagamento" value={props.dadosPagForm.dataPagamento} onChange={handleChange} className="form-control form-control-sm" id="inputDate" required/>
                  </div>
                
                  <div className="col-md-3 mb-3">
                      <label className="form-label" for="formaPag">Forma de {props.type}</label>
                      <select className="form-control form-control-sm" value={props.dadosPagForm.formaPagamento} onChange={handleChange} name="formaPagamento" id="formaPag">
                          <option selected>Escolher...</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                      </select>
                  </div>
                  
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroAdultos" className="form-label">Valor {props.devido}</label>
                      <input type="number"  value={props.valorTotal.toFixed(2)} className="form-control form-control-sm disabledTextInput" id="numeroAdultos"/>
                      </fieldset>
                  </div>
                  <div className="col-md-2 mb-3">
                      <label for="valorAdulto" className="form-label">Valor {props.namePago}</label>
                      <input type="number" name="valorPago" value={props.dadosPagForm.valorPago} className="form-control form-control-sm" onChange={handleChange}  id="valorAdulto" required/>
                  </div>
                  
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroCriancas" className="form-label">Valor Restante</label>
                      <input type="number" name="valorRestante" className="form-control form-control-sm" onChange={handleChange} value={(props.valorTotal - valorRestante).toFixed(2)} id="numeroCriancas"/>
                      </fieldset>
                  </div>
                  <div className="col-md-3 mb-3">
                      <label for="valorCriancas"  className="form-label">Comprovante</label>
                            <div className="custom-file mb-2">
                                <input type="file" name="comprovante" className="custom-file-input form-control-sm" id="customFile" onChange={handleChange} />
                                <label className="custom-file-label col-form-label-sm" for="customFile">{nomeArquivo !== "Escolher Arquivo"?(nomeArquivo.name):nomeArquivo}</label>
                            </div>
                            <img className="img-thumbnail" src={image}></img>
                  </div>
                  <div className="col-md-6 mb-3">
                      <label for="validationTextarea">Comentário do {props.type}</label>
                  <textarea name="comentario" value={props.dadosPagForm.comentario} className="form-control" onChange={handleChange} id="validationTextarea" placeholder="Escreva um comentário..."></textarea>
                  </div>
              </div>
              </form>
          </div>
          </div>
      </div>
    )
}