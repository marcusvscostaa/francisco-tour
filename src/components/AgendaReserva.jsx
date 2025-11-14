
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Card, Modal, Table } from 'antd';
import AgendaReservaChild from './AgendaReservaChild';
import { getTiposTours, getTourPorMes, getDataDiferentes, getReservasPorTourEData } from "../FranciscoTourService";



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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalReservas, setModalReservas] = useState([]);
    const [modalTourNome, setModalTourNome] = useState('');
    const [modalDataTour, setModalDataTour] = useState('');

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

    const handleTourClick = useCallback(async (tourName, day) => {
        setModalTourNome(tourName);
        
        const dayPadded = String(day).padStart(2, '0');
        const monthPadded = String(month + 1).padStart(2, '0');
        const formattedDate = `${year}-${monthPadded}-${dayPadded}`;
        
        setModalDataTour(`${dayPadded}/${monthPadded}/${year}`);
        
        setModalReservas([]);
        setIsModalVisible(true);
        
        try {
            const reservas = await getReservasPorTourEData(formattedDate, tourName);
             if (Array.isArray(reservas)) {
                    const processedReservas = reservas.map(r => {
                        const partesDoNome = r.nomeCliente ? r.nomeCliente.trim().split(/\s+/) : [];
                        const nomeExibido = partesDoNome.length > 1 
                            ? `${partesDoNome[0]} ${partesDoNome[partesDoNome.length - 1]}`
                            : r.nomeCliente;
                        return { ...r, nomeExibido };
                    });
                    console.log(processedReservas)
                    setModalReservas(processedReservas);
                } else { setModalReservas([]); }

            } catch (error) {
            console.error("Erro ao buscar detalhes da reserva:", error);
            setModalReservas([]); 
        }
    }, [month, year]); 
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setModalReservas([]);
        setModalTourNome('');
    };

    const modalColumns = [
        { title: 'ID Reserva', dataIndex: 'idReserva', key: 'idReserva' }, 
        { title: 'Cliente', dataIndex: 'nomeExibido', key: 'nomeCliente' },
        { title: 'Qtd. Adultos', dataIndex: 'quantidadeAdultos', key: 'adultos', align: 'right' },
        { title: 'Qtd. Crianças', dataIndex: 'quantidadeCriancas', key: 'criancas', align: 'right' },
        { title: 'Hotel', dataIndex: 'hotel', key: 'hotel' },
        { title: 'Idioma', dataIndex: 'idioma', key: 'idioma' },
    ];

    return (
        <>
        {tiposTours&&tourPorMes&&dataDiferentes?
        <Card 
            className="card mb-4 border border-secondary"
            title={`${months[month]} ${year}`}
            styles={{
                header: {
                backgroundColor: '#F8F9FC'
                }
            }}
            extra={ <input className='form-control' value={year+'-'+(month+1).toString().padStart(2, '0')} type="month" onChange={(e) =>{ setYear(e.target.value.substr(0, 4));
                                                                                                                     setMonth((e.target.value.substr(5,6 )-1));}}/>}       
        >
            <div className="">
                <div class="calendar-container">
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
                                        <AgendaReservaChild tiposTours={tiposTours} onTourClick={handleTourClick} date={date} tourPorMes={tourPorMes.filter((item) => item.data.substr(8,2) == date)}  />                                                                                                                                                                                                                             
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
                                <AgendaReservaChild tiposTours={tiposTours} onTourClick={handleTourClick} tourPorMes={tourPorMes.filter((item) => item.data.substr(8,2) == datas)} date={datas} />                                                                                                                                                                                                                             
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
        </Card>:<div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
        }
        <Modal
            title={<div className='d-flex'><p className='my-auto'>{`${modalTourNome}`}</p><h5 className='my-auto'><span className='my-auto ml-3 badge badge-primary'>{`${modalDataTour}`}</span></h5></div>}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={800} 
        >
            <div className='table-responsive'>
            <Table 
                className='table'    
                bordered={true}
                dataSource={modalReservas}
                columns={modalColumns}
                rowKey="idReserva" 
                pagination={{ pageSize: 8 }}
                loading={isModalVisible && modalReservas.length === 0} 
                size="small"
                scroll={{ 
                        x: 751 
                    }}
            />
            </div>
        </Modal>
        
        </>
    )
}