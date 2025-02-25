import { useEffect, useState } from "react"

export default function AgendaReservaChild(props){
    const [tourFilter, setTourFilter] = useState({})
    useEffect(()=>{
        let test = {}
        props.tiposTours.map((item) => {
            setTourFilter((prev)=>({
                ...prev,
                [item.tour]: props.tourPorMes.filter((valor) => valor.tour === item.tour).reduce((sum, dado) => sum + (dado.quantidadeAdultos + dado.quantidadeCriancas),0)
            }))
        })
        console.log(tourFilter)

    },[props.tourPorMes])
    return (
        <div>
        {props.tiposTours.map(tour => {
            if(tourFilter[tour.tour] !== 0){
                return(
                    <div className='border font-weight-light d-flex m-0'>
                        <div className="w-25 border-right m-auto"><p className="m-0">{tourFilter[tour.tour]} </p></div>
                        <div className="w-75 text-left"><p className="m-0 ml-1 ">{tour.tour}</p></div>
                    </div>
                )
            }
        })}
        </div>
    )
}