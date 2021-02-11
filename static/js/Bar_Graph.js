
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: ['Radio', 'Television', 'PC', 'Internet', 'Consola', 'Servicio de Streaming'],
        fontColor: 'white',
        fontSize: 20,
        datasets: [{
            barPercentage: 0.5,
            barThickness: 50,
            maxBarThickness: 100,
            minBarLength: 20,
            borderWidth: 20,
            label: '% de Inclusion en "Estado"',
            data: [75, 80, 35, 45, 15, 30],
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
