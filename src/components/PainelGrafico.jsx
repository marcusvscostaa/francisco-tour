import React from "react";
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

export default function PainelGrafico(props){
    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          s = '',
          toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
          };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
          s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
      }
      

    const data= {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{
          label: "Vendas Confirmadas",      
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
          label: "Vendas Canceladas",      
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
                    return datasetLabel + ': R$' + number_format(context.parsed.y);
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
                  return 'R$ ' + number_format(value);
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
        

        <div class="col-xl-8 col-lg-7">
            <div class="card shadow mb-4">
                <div
                    class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">RESERVAS {props.anoSelecionado}</h6>
                    <div class="dropdown no-arrow">
                        <a type="button" class="dropdown-toggle btn btn-primary" href="#" role="button" id="dropdownMenuLink"
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
                    </div>
                </div>
                <div class="card-body">
                    <div className="chart-area">
                        <Line id="myAreaChart" data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    )
}