
import { useEffect, useState} from 'react'
import AgendaReservaChild from './AgendaReservaChild';


export default function AgendaReserva() {
    const [dateList, setDateList] = useState([])
    const [date, setDate] = useState(new Date());
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth());
    const [tiposTours, setTiposTours] = useState([]);
    const [tourPorMes, setTourPorMes] = useState([]);
    const [dataDiferentes, setDataDiferentes] = useState('');
    useEffect(() => {
        let arr = []
        let dayone = new Date(year, month, 1).getDay();
        let lastdate = new Date(year, month + 1, 0).getDate();
        let dayend = new Date(year, month, lastdate).getDay();
        let monthlastdate = new Date(year, month, 0).getDate();
        let lit = "";

        fetch(`${process.env.REACT_APP_BASE_URL}/tiposTours`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        })
            .then((response) => response.json())
            .then((data) => {
                setTiposTours(data);
            })
            .catch((error) => console.log(error));
        fetch(`${process.env.REACT_APP_BASE_URL}/tourPorMes/${(month + 1)}/${year}`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        })
            .then((response) => response.json())
            .then((data) => {
                setTourPorMes(data);
            })
        fetch(`${process.env.REACT_APP_BASE_URL}/dataDiferentes/${(month + 1)}/${year}`, {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        })
            .then((response) => response.json())
            .then((data) => {
                setDataDiferentes(data);
            })
            .catch((error) => console.log(error));

    
        for (let i = dayone; i > 0; i--) {
                arr.push('')
        }
    
        for (let i = 1; i <= lastdate; i++) {
            arr.push(i)
    
            let isToday = i === date.getDate()
                && month === new Date().getMonth()
                && year === new Date().getFullYear()
                ? "active"
                : "";
            lit += `<li class="${isToday}">${i}</li>`;
        }
    
        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive">${i - dayend + 1}</li>`
            arr.push('')
        }
    
        setDateList(()=> arr)
        setTimeout(()=> {
            

        },2000)



    }, [month, year])


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
                        <ul class="calendar-weekdays">
                            <li>Dom</li>
                            <li>Seg</li>
                            <li>Ter</li>
                            <li>Qua</li>
                            <li>Qui</li>
                            <li>Sex</li>
                            <li>Sab</li>
                        </ul>
                        <ul class="calendar-dates">
                            {dateList.map(date => (<li className='mb-1 border h-100'>
                                <div className='bg-dark text-white font-weight-bold'>{date}</div>

                                {dataDiferentes&& dataDiferentes.map(datas => {
                                     if(datas.data.substr(8,2) == date){
                                        return(
                                        <>
                                        <div className='bg-info text-white border font-weight-bold d-flex m-0'>
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
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}