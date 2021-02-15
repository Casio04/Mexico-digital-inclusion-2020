// ---------------------------------------------------Leaflet-----------------------------------------------------------------------
// Create map variable with zoom 5 and center in Zacatecas to show all the country
let mymap = L.map('map').setView([22.76843, -102.58141], 5);

// Create layer for basic map with gray coloring
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
// Defining function for updating state color depending on the inclusion data
function getColor(d) {
    return d > 0.7  ? '#581845' :
           d > 0.6  ? '#FF0000' :
           d > 0.50   ? '#F45A31' :
           d > 0.40   ? '#F18C03' :
           d > 0.30   ? '#ffa64d' :
                      '#F3CA6E';
}

// Function to define what happens when a mouse is hovered over the state
function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#FFFFFF',
        dashArray: '',
        fillOpacity: .7
    });

    info.update(layer.feature.properties)

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Function to zoom the state when hovered
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

// Function to reset view on mouseout
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update()
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>State information</h4>' +  (props ?
        '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Total population: ' + formatNumber(props.POBTOT) + 
        '<br />National ranking: ' + props.RANKING +
        '<br />Inclusion percentage: ' + parseFloat(props.INCLUSION_EST * 100).toFixed(0)+'%'
        : 'Hover over a state');
};


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.30, 0.40, 0.50, 0.60, 0.70],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    div.innerHTML += '<b>% of inclusion </b><hr>'

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+ 0.01) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// ---------------------------------------------Boxplot----------------------------------------------------------------------------
//  Create the Traces

let xData = ['Television', 'Radio',
'Fixed<br>Telphony', 'Mobile<br>Telephony',
'Pay<br>Television', 'Video Games<br>Console',
'Internet', 'Streaming<br>Services', 'Computer'];

let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];
  
let data1 = [];

// Boxplot layout options
layout = {
    yaxis: {
        autorange: true,
        showgrid: true,
        zeroline: true,
        dtick: 5,
        gridcolor: 'rgb(255, 255, 255)',
        gridwidth: 1,
        boxpoints: "all",
        zerolinecolor: 'rgb(255, 255, 255)',
        zerolinewidth: 2
    },
    margin: {
        l: 40,
        r: 30,
        b: 80,
        t: 20
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false
};



// Read json data and apply all the functions above to style and give some extra data on the map 
d3.json("../api_states").then(function(data){
    let states = data
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.INCLUSION_EST),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.8
        };
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    // method that we will use to update the control based on feature properties passed
   
    
    geojson = L.geoJson(states, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mymap);

    info.addTo(mymap);
    legend.addTo(mymap);
    // L.geoJSON(states, {style: style}).addTo(mymap);  
})

// Municipalities 
d3.json("../api_municipios_no_coords").then((data) => {
    
  console.log(data)
    var yData = [
      data.map(val => val.properties.VPH_TV/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_RADIO/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_TELEF/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_CEL/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_STVP/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_CVJ/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_INTER/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_SPMVPI/val.properties.TVIVPARHAB*100),
      data.map(val => val.properties.VPH_PC/val.properties.TVIVPARHAB*100),
        ];
    
    
    
    for ( let i = 0; i < xData.length; i ++ ) {
        let result = {
            type: 'box',
            y: yData[i],
            name: xData[i],
            jitter: 0.5,
            whiskerwidth: 0.2,
            fillcolor: colors,
            marker: {
                size: 6
            },
            line: {
                width: 3
            }
        };
        data1.push(result);
    };
    
   
    
    Plotly.newPlot('plot', data1, layout);
    
    });
    
