
// Create map variable with zoom 5 and center in Zacatecas to show all the country
let mymap = L.map('mapid').setView([22.76843, -102.58141], 5);

// Create layer for basic map with gray coloring
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

// });


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
// Defining function for updating state color depending on the inclusion data
function getColor(d) {
    return d > 0.7      ? '#581845' :
           d > 0.6      ? '#FF0000' :
           d > 0.50     ? '#F45A31' :
           d > 0.40     ? '#F18C03' :
           d > 0.30     ? '#ffa64d' :
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
    this._div.innerHTML = '<h4>Municipality information</h4>' +  (props ?
        '<b>' + props.NOMBRE_ENTIDAD + '</b><br />Municipality: ' + props.NOMBRE_MUNICIPIO + '</b><br />Total population: ' + formatNumber(props.POBTOT) + 
        '<br />National ranking: ' + props.RANKING +
        '<br />Inclusion percentage: ' + parseFloat(props.INCLUSION_MUN * 100).toFixed(0)+'%'
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


// Read json data and apply all the functions above to style and give some extra data on the map 
d3.json("/api_municipios").then(function(data){

    let states = data
    
    console.log(data)
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.INCLUSION_MUN),
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




