
import { useEffect, useState, useMemo, useCallback } from 'react'
import AgendaReservaChild from './AgendaReservaChild';
import { getTiposTours, getTourPorMes, getDataDiferentes } from "../FranciscoTourService";



export default function AgendaReserva() {
    const [dateList, setDateList] = useState([])
    const [date, setDate] = useState(new Date());
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth());
    const [tiposTours, setTiposTours] = useState([]);
    const [tourPorMes, setTourPorMes] = useState([]);
    const [dataDiferentes, setDataDiferentes] = useState('');
    const [arrdataDiferentes, setArrDataDiferentes] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);

    const fetchData = useCallback(async () => {
        try {
            const [tiposData, toursData, datasDiferentesData] = await Promise.all([
                getTiposTours(),
                getTourPorMes(month, year),
                getDataDiferentes(month, year)
            ]);
            
            setTiposTours(tiposData.fatal || tiposData.code ? false : tiposData);

            setTourPorMes(toursData);

            setDataDiferentes(datasDiferentesData);
            const arr = datasDiferentesData.map(data => data.data.substr(8, 2)).sort();
            setArrDataDiferentes(arr);

        } catch (error) {
            console.error("Erro ao carregar dados da Agenda:", error);
        }
    }, [month, year]);
    
    const diasDoMes = useMemo(() => {
        let arr = []
        let dayone = new Date(year, month, 1).getDay();
        let lastdate = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < dayone; i++) {
            arr.push('');
        }
        for (let i = 1; i <= lastdate; i++) {
            arr.push(i);
        }
        return arr;
    }, [month, year]);

    useEffect(() => {
        fetchData();
        setDateList(diasDoMes);
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        
    }, [month, year, fetchData, diasDoMes]);

    const months = [
    'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];

    return (
        <>
        {tiposTours&&tourPorMes&&dataDiferentes?
        <div className="card shadow mb-4">
            <div className="card-body">
                <div class="calendar-container">
                    <header class="calendar-header">
                        <p class="calendar-current-date"> {`${months[month]} ${year}`}</p>
                        <div class="calendar-navigation">
                        <input class="form-control" value={year+'-'+(month+1).toString().padStart(2, '0')} type="month" onChange={(e) =>{ setYear(e.target.value.substr(0, 4));
                                                                                                                     setMonth((e.target.value.substr(5,6 )-1));}}/>
                        </div>
                    </header>
                    <div class="calendar-body">
                    {width> 481&&
                        <ul class="calendar-weekdays">
                            <li>Dom</li>
                            <li>Seg</li>
                            <li>Ter</li>
                            <li>Qua</li>
                            <li>Qui</li>
                            <li>Sex</li>
                            <li>Sab</li>
                        </ul>
                    }
                    {width> 481?
                        <ul class="calendar-dates ">                    
                            {dateList.map(date => (<li className={`mb-1 border h-100`}>
                                <div className='bg-dark text-white font-weight-bold'>{date}</div>
                                {dataDiferentes&& dataDiferentes.map(datas => {
                                     if(datas.data.substr(8,2) == date){
                                        return(
                                        <>
                                        <div className='bg-info text-white border font-weight-bold d-flex m-0 '>
                                            <div className="w-25 border-right"><p className="m-0">QTD. </p></div>
                                            <div className="w-75"><p className="m-0 text-center">TOUR</p></div>
                                        </div>                                                                                                                      
                                        <AgendaReservaChild tiposTours={tiposTours} tourPorMes={tourPorMes.filter((item) => item.data.substr(8,2) == date)} date={date} />                                                                                                                                                                                                                             
                                        <div className='bg-info text-white border font-weight-bold d-flex m-0'>
                                            <div className=""><p className="m-0">TOTAL  {tourPorMes&&tourPorMes.filter((item) => item.data.substr(8,2) == date).reduce((sum, item) => sum + (item.quantidadeAdultos + item.quantidadeCriancas),0)}</p></div>
                                        </div> 
                                        </> 
                                        )
                                     }
                                })}                                
                            </li>))}


                        </ul>:<ul>
                       { arrdataDiferentes.map(datas => {
                                return(
                                <li className='mb-1 border h-100'>
                                <div className='bg-dark text-white font-weight-bold'>{datas}</div>
                                <div className='bg-info text-white border font-weight-bold d-flex m-0'>
                                    <div className="w-25 border-right"><p className="m-0">QTD. </p></div>
                                    <div className="w-75"><p className="m-0 text-center">TOUR</p></div>
                                </div>                                                                                                                      
                                <AgendaReservaChild tiposTours={tiposTours} tourPorMes={tourPorMes.filter((item) => item.data.substr(8,2) == datas)} date={datas} />                                                                                                                                                                                                                             
                                <div className='bg-info text-white border font-weight-bold d-flex m-0'>
                                    <div className=""><p className="m-0">TOTAL  {tourPorMes&&tourPorMes.filter((item) => item.data.substr(8,2) == datas).reduce((sum, item) => sum + (item.quantidadeAdultos + item.quantidadeCriancas),0)}</p></div>
                                </div> 
                                </li> 
                                )
                            })}
                        </ul>
                        
                        }
                    </div>
                </div>
            </div>
        </div>:<div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
        }</>
    )
}