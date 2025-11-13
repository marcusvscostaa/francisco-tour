import { useMemo } from "react"

export default function AgendaReservaChild(props){
    const tourFilter = useMemo(() => {
            let filterResult = {};
            
            const toursAgrupados = props.tourPorMes.reduce((acc, dado) => {
                const quantidade = dado.quantidadeAdultos + dado.quantidadeCriancas;
                acc[dado.tour] = (acc[dado.tour] || 0) + quantidade;
                return acc;
            }, {});
            
            props.tiposTours.forEach((item) => {
                filterResult[item.tour] = toursAgrupados[item.tour] || 0;
            });

            return filterResult;
            
        }, [props.tourPorMes, props.tiposTours]);
    return (
        <div>
        {props.tiposTours.map(tour => {
            const quantidade = tourFilter[tour.tour] || 0;
            console.log(tour.tour, tourFilter[tour.tour])
            if(quantidade > 0){
                
                return(
                    <div className='border font-weight-light d-flex m-0 ' >
                        <div className="w-25 border-right m-auto"><p className="m-0">{tourFilter[tour.tour]} </p></div>
                        <div className="w-75 text-left">
                            <a title="ver reservas" onClick={() => props.onTourClick(tour.tour, props.date)}>
                                <p className="m-0 ml-1 ">{tour.tour}</p>
                            </a>
                        </div>
                    </div>
                )
            }
        })}
        </div>
    )
}