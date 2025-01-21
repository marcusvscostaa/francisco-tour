import { useEffect, useState } from "react"

export default function TourForm(props){

    useEffect(()=>{
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, id_reserva: props.idReserva } : tour
          );
        props.atualizarValor(dadosAtualizados)
        console.log(props.calculoTotal)
    },[])

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
        console.log(dados)  
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
        const dados =  props.calculoTotal;
        const dadosAtualizados = dados.map((tour) =>
            tour.id === props.numbTour ? { ...tour, tour: e.target.value } : tour
          );
        props.atualizarValor(dadosAtualizados)
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




    return(
        <div className="col-md-12">
        <div className="card mb-4 border-dark">
          <div className="card-header text-lg">
              Tour {props.numbTour}
              {props.numbTour!="1"?<button type="button" onClick={() => props.removerTour(props.numbTour)} className="close" aria-label="Close">
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
                      <select  value={props.calculoTotal[props.numbTour-1].destino} className="form-control form-control-sm" id="detino" onChange={updateDestino} required>
                          <option value='' disabled selected>Destino...</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                      </select>
                  </div>
                  <div className="col-md-3 mb-3">
                      <label className="form-label" for="tour" >Tour</label>
                      <select value={props.calculoTotal[props.numbTour-1].tour} className="form-control form-control-sm" id="tour" onChange={updateTour} required>
                          <option value='' disabled selected>Tour..</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                      </select>
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="numeroAdultos" className="form-label">Nº Adultos</label>
                        <input value={props.calculoTotal[props.numbTour-1].numeroAdultos} type="number" className="form-control form-control-sm" id="numeroAdultos" placeholder='0' onChange={updateNumAdultos} required />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="valorAdulto" className="form-label">Valor Adulto</label>
                        <input value={props.calculoTotal[props.numbTour-1].valorAdulto} type="number" className="form-control form-control-sm" id="valorAdulto" placeholder='0' onChange={updateValorAdultos} required />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="numeroCriancas" className="form-label">Nº Crianças</label>
                        <input value={props.calculoTotal[props.numbTour-1].numeroCriancas} type="number" className="form-control form-control-sm" id="numeroCriancas" placeholder='0' onChange={updateNumCriancas} />
                  </div>
                  <div className="col-md-2 mb-3">
                        <label for="valorCriancas" className="form-label">Valor Criança</label>
                        <input value={props.calculoTotal[props.numbTour-1].valorCriancas} type="number" className="form-control form-control-sm" id="valorCriancas" placeholder='0' onChange={updateValorCriancas} />
                  </div>
              </div>
          </div>
          </div>
          <p>{props.idReserva}</p>
          <p>{((props.calculoTotal[props.numbTour - 1].numeroAdultos)*(props.calculoTotal[props.numbTour - 1].valorAdulto))
            +((props.calculoTotal[props.numbTour - 1].numeroCriancas)*(props.calculoTotal[props.numbTour - 1].valorCriancas))}</p>
      </div>
    )
}