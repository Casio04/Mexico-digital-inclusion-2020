let state = document.getElementById("stateDrop").value
    



let labels = ['Radio', 'Television', 'PC', 'Internet', 'Consola', 'Servicio de Streaming']
let data = [75, 80, 35, 45, 15, 30]

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        fontColor: 'white',
        fontSize: 20,
        datasets: [{
            barPercentage: 0.5,
            barThickness: 50,
            maxBarThickness: 100,
            minBarLength: 20,
            borderWidth: 20,
            label: '% de Inclusion en "Estado"',
            data: data,
            backgroundColor: [
                '#0F5257',
                '#0b3142',
                '#9c92a3',
                '#c6b9cd',
                '#d6d3f0',
                '#f1fec6'
            ],
            borderColor: [
                '#0F5257',
                '#0b3142',
                '#9c92a3',
                '#c6b9cd',
                '#d6d3f0',
                '#f1fec6'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    beginAtZero: true
                }
            }]
        }
    }
});


// var myChart = new Chart(ctx,{
//     type: 'Bar',
//     data: {
//         labels: labels,
//         datasets:{
//             data: data
//         }
//     }
// })