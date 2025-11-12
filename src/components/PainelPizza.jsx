import { Card } from 'antd';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale} from 'chart.js';
  
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale );

export default function PainelPizza(props){

    const data = {
        labels: ["Confirmado", "Cancelado"],
        datasets: [{
          data: [props.dadoQuantidade.confirmadas, props.dadoQuantidade.canceladas],
          backgroundColor: ['#1cc88a', '#e74a3b'],
          hoverBackgroundColor: ['#48f8b9', '#f2796d'],
          hoverBorderColor: "rgb(234, 236, 244)",
        }],
      }
      const options = {
        maintainAspectRatio: false,
        plugins: {
        tooltip: {
          backgroundColor: "rgb(255,255,255)",
          bodyColor: "#858796",
          borderColor: '#dddfeb',
          titleColor: '#6e707e',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        }},
        cutout: '80%',
      }
    return(
    <div class="col-xl-4 col-lg-5">
        <Card 
            className='border border-secondary'
            title={<>RESERVAS {props.anoSelecionado}</>}
            styles={{
                header: {
                backgroundColor: '#F8F9FC'
                }
            }}
        >

            <div class="">
                <div class="chart-pie pt-4 pb-2">
                    <Doughnut data={data} options={options} id="myPieChart" />
                </div>
                <div class="mt-4 text-center small">
                    <span class="mr-2">
                        <i class="fas fa-circle text-success"></i> {props.dadoQuantidade.confirmadas} Confirmada 
                    </span>
                    <span class="mr-2">
                        <i class="fas fa-circle text-danger"></i> {props.dadoQuantidade.canceladas} Cancelada
                    </span>
                </div>
            </div>
        </Card>
    </div>
    )
}