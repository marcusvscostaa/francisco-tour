import { useEffect, useState } from "react"
import {getToursCadastroDestino} from "../FranciscoTourService";

export default function TourForm(props){
    const [toursPorDestino, setToursPorDestino] = useState([]);
    const tourData = props.calculoTotal[props.numbTour - 1] || {};    
    const destinoAtual = tourData.destino;

    useEffect(() => {
        if (destinoAtual) {
            const fetchTours = async () => {
                try {
                    const data = await getToursCadastroDestino(destinoAtual);
                    setToursPorDestino(data);
                    
                    if(data.length > 0 && tourData.tour) {
                         updateTour({ target: { value: '' } }); 
                         updateValorAdultos({ target: { value: 0 } });
                         updateValorCriancas({ target: { value: 0 } });
                    }
                    
                } catch (error) {
                    console.error("Erro ao carregar tours por destino:", error);
                    setToursPorDestino([]);
                }
            };
            fetchTours();
        } else {
            setToursPorDestino([]); 
        }
    }, [destinoAtual]);

    const updateNumAdultos = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, numeroAdultos: e.target.value}:tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    const updateValorAdultos = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, valorAdulto: e.target.value}:tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    const updateNumCriancas = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, numeroCriancas: e.target.value}: tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    const updateValorCriancas = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, valorCriancas: e.target.value}: tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    const updateTour = (e) =>{
        const nomeTourSelecionado = e.target.value;
        
        const tourSelecionado = toursPorDestino.find(
            (item) => item.nome_tour === nomeTourSelecionado
        );

        const novoValorAdulto = tourSelecionado ? tourSelecionado.valor_adulto : 0;
        const novoValorCrianca = tourSelecionado ? tourSelecionado.valor_crianca : 0;

        const dados = props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour
                ? {
                    ...tour,
                    tour: nomeTourSelecionado, 
                    valorAdulto: novoValorAdulto, 
                    valorCriancas: novoValorCrianca, 
                }
                : tour
        );
        props.atualizarValor(dadosAtualizados);
    }
    const updateDataTour = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, data: e.target.value } : tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    const updateDestino = (e) =>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, destino: e.target.value } : tour
          );
        props.atualizarValor(dadosAtualizados)
    }
    if (!tourData.id) { 
        return null; 
    }

    return(
        <div className="col-md-12">
        <div className="card mb-4 border-dark">
          <div className="card-header text-lg">
              Tour {props.numbTour}
              {props.numbTour!=="1"?<button type="button" onClick={() => props.removerTour(props.numbTour)} className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>:null}
          </div>
          <div className="card-body">
              <div className="row g-3">
                  <div className="col-md-2 mb-3">
                      <label for="inputDate" className="form-label">Data</label>
                      <input type="date" value={props.calculoTotal[props.numbTour-1].data} className="form-control form-control-sm" onChange={updateDataTour} id="inputDate" required/>
                  </div>
                  <div className="col-md-3 mb-3">
                      <label className="form-label" for="destino">Destino</label>
                      <select  value={destinoAtual} className="form-control form-control-sm" id="detino" onChange={updateDestino} required>
                            <option value="" disabled>Selecione o Destino</option>  
                            {props.options&& props.options.destino.map((item) => {
                                return <option value={item}>{item}</option>
                            })}
                      </select>
                  </div>
                  <div className="col-md-3 mb-3">
                      <label className="form-label" for="tour" >Tour</label>
                      <select value={props.calculoTotal[props.numbTour-1].tour} className="form-control form-control-sm" id="tour" onChange={updateTour} required>
                             {!destinoAtual && <option value="" disabled>Selecione um Tour</option>}
                            {destinoAtual && toursPorDestino.length === 0 && <option disabled>Carregando Tours...</option>}                            
                            {toursPorDestino&& toursPorDestino.map((item) => {
                                return <option value={item.nome_tour}>{item.nome_tour}</option>
                            })}
                      </select>
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="numeroAdultos" className="form-label">Nº Adultos</label>
                        <input value={props.calculoTotal[props.numbTour-1].numeroAdultos === 0?'':props.calculoTotal[props.numbTour-1].numeroAdultos} type="number" className="form-control form-control-sm" id="numeroAdultos" placeholder='0' onChange={updateNumAdultos} required />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="valorAdulto" className="form-label">Valor Adulto</label>
                        <input value={props.calculoTotal[props.numbTour-1].valorAdulto === 0?'':props.calculoTotal[props.numbTour-1].valorAdulto} type="number" className="form-control form-control-sm" id="valorAdulto" placeholder='0' onChange={updateValorAdultos} required />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="numeroCriancas" className="form-label">Nº Crianças</label>
                        <input value={props.calculoTotal[props.numbTour-1].numeroCriancas ===0?'':props.calculoTotal[props.numbTour-1].numeroCriancas} type="number" className="form-control form-control-sm" id="numeroCriancas" placeholder='0' onChange={updateNumCriancas} />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="valorCriancas" className="form-label">Valor Criança</label>
                        <input value={props.calculoTotal[props.numbTour-1].valorCriancas ===0?'':props.calculoTotal[props.numbTour-1].valorCriancas} type="number" className="form-control form-control-sm" id="valorCriancas" placeholder='0' onChange={updateValorCriancas} />
                  </div>
              </div>
          </div>
          </div>
          
      </div>
    )
    
}