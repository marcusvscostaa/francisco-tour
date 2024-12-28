import { use, useEffect } from "react"
import { useState } from "react"

export default function TourPag(props){

    const [valorRestante, setValorRestante] = useState(props.valorTotal)
    const [nomeArquivo, setNomeArquivo] = useState("Escolher Arquivo")
    const [image, setImage] = useState("")
    const [arquvio, setArqivo] = useState("")
    
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
        fetch('http://localhost:8800/upload-imagem', reqPagReserva)
        .then( response => console.log(response.json()))
    }
    console.log(nomeArquivo)
    return(
        <div className="col-md-12">
        <div className="card mb-4 border-dark">
          <div className="card-header text-lg">
              Informações do Pagamento
          </div>
          <div className="card-body">
              <form>
              <div className="row g-3">
                  <div className="col-md-2 mb-3">
                      <label for="inputDate" className="form-label">Data</label>
                      <input type="date" name="dataPagamento" onChange={handleChange} className="form-control form-control-sm" id="inputDate" required/>
                  </div>
                
                  <div className="col-md-3 mb-3">
                      <label className="form-label" for="formaPag">Forma de Pagamento</label>
                      <select className="form-control form-control-sm" onChange={handleChange} name="formaPagamento" id="formaPag">
                          <option selected>Escolher...</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                      </select>
                  </div>
                  
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroAdultos" className="form-label">Valor Total</label>
                      <input type="number"  value={props.valorTotal.toFixed(2)} className="form-control form-control-sm disabledTextInput" id="numeroAdultos"/>
                      </fieldset>
                  </div>
                  <div className="col-md-2 mb-3">
                      <label for="valorAdulto" className="form-label">Valor Pago</label>
                      <input type="number" name="valorPago" className="form-control form-control-sm" onChange={handleChange}  id="valorAdulto" required/>
                  </div>
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroCriancas" className="form-label">Valor Restante</label>
                      <input type="number" name="valorRestante" className="form-control form-control-sm" onChange={handleChange} value={(props.valorTotal - valorRestante)} id="numeroCriancas"/>
                      </fieldset>
                  </div>
                  <div className="col-md-3 mb-3">
                      <label for="valorCriancas"  className="form-label">Comprovante</label>
                            <div class="custom-file mb-2">
                                <input type="file" name="comprovante" class="custom-file-input form-control-sm" id="customFile" onChange={handleChange} />
                                <label class="custom-file-label col-form-label-sm" for="customFile">{nomeArquivo !== "Escolher Arquivo"?(nomeArquivo.name):nomeArquivo}</label>
                            </div>
                            <img class="img-thumbnail" src={image}></img>
                  </div>
                  <div class="col-md-6 mb-3">
                      <label for="validationTextarea">Comentário do Pagamento</label>
                  <textarea name="comentario" class="form-control" onChange={handleChange} id="validationTextarea" placeholder="Escreva um comentário..."></textarea>
                  </div>
              </div>
              </form>
          </div>
          </div>
          
      </div>
    )
}