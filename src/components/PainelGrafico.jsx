import { Card } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,Filler );

function formatarNumeroGrafico(number) {
    var n = !isFinite(+number) ? 0 : +number;
        return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2, 
    }).format(n);
}

export default function PainelGrafico(props){

    const data= {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{
          label: props.title1,      
          fill: true,
          lineTension: 0.3,
          backgroundColor: "rgba(65, 201, 97, 0.13)",
          borderColor: "rgb(78, 223, 115)",
          pointRadius: 3,
          pointBackgroundColor: "rgb(21, 224, 99)",
          pointBorderColor: "rgb(78, 223, 93)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgb(0, 150, 75)",
          pointHoverBorderColor: "rgb(0, 138, 35)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: [props.dadoAno.jan, 
                 props.dadoAno.fev, 
                 props.dadoAno.mar, 
                 props.dadoAno.abr, 
                 props.dadoAno.mai, 
                 props.dadoAno.jun, 
                 props.dadoAno.jul, 
                 props.dadoAno.ago, 
                 props.dadoAno.set, 
                 props.dadoAno.out, 
                 props.dadoAno.nov, 
                 props.dadoAno.dez],
        },{
          label: props.title2,      
          fill: true,
          lineTension: 0.3,
          backgroundColor: "rgba(223, 78, 78, 0.05)",
          borderColor: "rgb(223, 78, 78)",
          pointRadius: 3,
          pointBackgroundColor: "rgb(223, 78, 78)",
          pointBorderColor: "rgb(223, 78, 78)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgb(223, 78, 78)",
          pointHoverBorderColor: "rgb(223, 93, 78)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: [-(props.dadoAno.janCld), 
                 -(props.dadoAno.fevCld), 
                 -(props.dadoAno.marCld), 
                 -(props.dadoAno.abrCld), 
                 -(props.dadoAno.maiCld), 
                 -(props.dadoAno.junCld), 
                 -(props.dadoAno.julCld), 
                 -(props.dadoAno.agoCld), 
                 -(props.dadoAno.setCld), 
                 -(props.dadoAno.outCld), 
                 -(props.dadoAno.novCld), 
                 -(props.dadoAno.dezCld)],
        }
    ],
      }

    const options= {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        plugins: {
            tooltip: {
                backgroundColor: "rgb(255,255,255)",
                bodyColor: "#858796",
                titleMarginBottom: 10,
                titleColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                  label: function(context, chart) {
                    let datasetLabel = context.dataset.label || '';
                    let valor = context.parsed.y;
                    if (valor === -0) {
                        valor = 0; // Isso garante que a formatação não use o sinal
                    }
                    return datasetLabel + ': R$ ' + formatarNumeroGrafico(valor);
                  }
                }
              },
            filler: {
                drawTime: 'beforeDatasetsDraw'
              },
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 14,
                        family: 'Nunito'
                    }
                }
            },
        },scales: {
            y: {
              stacked: false,
              ticks: {
                maxTicksLimit: 10,
                padding: 10,
                // Include a dollar sign in the ticks
                callback: function(value, index, values) {
                  return 'R$ ' + formatarNumeroGrafico(value);
                }
            },
              grid: {
                display: true,
                color: "rgb(234, 236, 244)",
                beginAtZero: true
              },border: {
                dash: [2],
            }
            },
            x: {

              grid: {
                display: false,
              }
            }
          },
       
      }
       
    return (
        

        <div class={`col-xl-${props.size} col-lg-7 mb-5`}>
            <Card
              className='border border-secondary'
              title={<>RESERVAS {props.anoSelecionado}</>}
              styles={{
                  header: {
                  backgroundColor: '#F8F9FC'
                  }
              }}
              extra={ <div class="dropdown no-arrow">
                        <a type="button" class="dropdown-toggle btn btn-dark" href="#" role="button" id="dropdownMenuLink"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span>{props.anoSelecionado}</span>
                            <i className="fas fa-calendar-alt fa-fw ml-1 text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Selecionar Ano</div>
                            <a class="dropdown-item" onClick={() =>{props.setAnoSelecionadol(2024); props.setUpdateCount(true)}}>2024</a>
                            <a class="dropdown-item" onClick={() =>{props.setAnoSelecionadol(2025); props.setUpdateCount(true)}}>2025</a>
                            <a class="dropdown-item" onClick={() =>{props.setAnoSelecionadol(2026); props.setUpdateCount(true)}}>2026</a>
                            <a class="dropdown-item" onClick={() =>{props.setAnoSelecionadol(2027); props.setUpdateCount(true)}}>2027</a>
                        </div>
                    </div>}
            >
                <div class="">
                    <div className="chart-area">
                        <Line id="myAreaChart" data={data} options={options} />
                    </div>
                </div>
            </Card>
        </div>
    )
}