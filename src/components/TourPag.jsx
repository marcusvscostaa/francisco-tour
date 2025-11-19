import { useMemo, useEffect, useState } from "react"

const formatarNumero = (valor) => {
    const numero = typeof valor === 'number' ? valor : parseFloat(valor);
    if (isNaN(numero)) {
        return "0,00";
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2,
    }).format(numero);
};

const parseValorInput = (input) => {
    if (typeof input !== 'string') return input;
    const cleanInput = input.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanInput) || 0;
};

export default function TourPag(props){

    const [nomeArquivo, setNomeArquivo] = useState("Escolher Arquivo")
    const [image, setImage] = useState("")
    const [arquvio, setArqivo] = useState("")

    const valorRestante = useMemo(() => {
        const valorPago = parseFloat(props.dadosPagForm.valorPago || 0);
        return props.valorTotal - valorPago;
    }, [props.valorTotal, props.dadosPagForm.valorPago]);

    useEffect(()=>{
        if(props.editPag){
            props.setDadosPagForm({
                dataPagamento: props.dados[0].dataPagamento.substr(0, 10),
                formaPagamento: props.dados[0].formaPagamento,
                valorPago: props.dados[0].valorPago,
                comentario: props.dados[0].comentario,
            })
            if(props.type === 'Pagamento'){
                setImage(`${process.env.REACT_APP_BASE_URL}/pagamento/comprovante/${props.idPag}`)
            }else{
                setImage(`${process.env.REACT_APP_BASE_URL}/imagemEstorno/${props.dados[0].idPagamento}/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`)
            }
        }
    },[])
    
    const handleChange = (e) => {
        
        const name = e.target.name
        const value = e.target.value
        if(name === "valorPago"){
            const newFormFields = { ...props.dadosPagForm ,[name]: value}
            props.setDadosPagForm(newFormFields)
        }else if(name === "comprovante"){
            setNomeArquivo(e.target.files[0])
            const file = e.target.files[0]
            const reader = new FileReader();
            reader.onloadend = () => {
              setImage(reader.result);
              props.setImagemUpload(e.target.files[0])
            };
            reader.readAsDataURL(file);

        }else{
            const newFormFields = { ...props.dadosPagForm ,[name]: value}
            props.setDadosPagForm(newFormFields)
        }

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
                            {props.options&& props.options.formaPagamento.map((item) => {
                                return <option value={item}>{item}</option>
                            })}
                      </select>
                  </div>
                  
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroAdultos" className="form-label">Valor {props.devido}</label>
                      <input type="text"  value={formatarNumero(props.valorTotal)} className="form-control form-control-sm disabledTextInput" id="numeroAdultos"/>
                      </fieldset>
                  </div>
                  <div className="col-md-2 mb-3">
                      <label for="valorAdulto" className="form-label">Valor {props.namePago}</label>
                      <input type="number" name="valorPago" value={props.dadosPagForm.valorPago} className="form-control form-control-sm" onChange={handleChange}  id="valorAdulto" required/>
                  </div>
                  
                  <div className="col-md-2 mb-3">
                      <fieldset disabled>
                      <label for="numeroCriancas" className="form-label">Valor Restante</label>
                      <input type="text" name="valorRestante" className="form-control form-control-sm" onChange={handleChange} value={formatarNumero(valorRestante)} id="numeroCriancas"/>
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