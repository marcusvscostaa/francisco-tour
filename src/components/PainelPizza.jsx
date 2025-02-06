import React from "react";
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
        <div class="card shadow mb-4">
            <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">Reservas {props.anoSelecionado}</h6>
                <div class="dropdown no-arrow">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                        aria-labelledby="dropdownMenuLink">
                        <div class="dropdown-header">Dropdown Header:</div>
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="chart-pie pt-4 pb-2">
                    <Doughnut data={data} options={options} id="myPieChart" />
                </div>
                <div class="mt-4 text-center small">
                    <span class="mr-2">
                        <i class="fas fa-circle text-success"></i> Confirmada
                    </span>
                    <span class="mr-2">
                        <i class="fas fa-circle text-danger"></i> Cancelada
                    </span>
                </div>
            </div>
        </div>
    </div>
    )
}