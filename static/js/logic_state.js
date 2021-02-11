// ----------------------------------------------------------------------------------------------------------------------------------
// Map layer
// Here we declare the map variable in the center of Mexico to show the whole country
let mymap = L.map('mapid').setView([22.849294981948546, -102.68634458318647], 5)

// We add the basic tileLayer from mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

// ----------------------------------------------------------------------------------------------------------------------------------

// Initialize function
function init(){
    // Reading data from API
    d3.json("../api_states").then(function(data){

        // Create empty array
        let states =[]

        // Push every state from the data
        data.forEach(function(d){
            states.push(d.properties.NOMBRE_ENTIDAD)
        })
        // Insert states into dropdown
        let selection = d3.select("#stateDrop")
        .selectAll("option")
        selection.data(data)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d =>d.properties.ENTIDAD)
        .text(d=>d.properties.NOMBRE_ENTIDAD)
        selection.exit().remove()
        // Getting the first state in the arrawy and calling the function to update by default this value on the first loaf
        let firstResult = states[0]
        stateChanged(firstResult)
    })
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Function used to display general information and state image
function general_info(a){
    // Getting the number of entity selected
    let state = document.getElementById("stateDrop").value
    // Reading data from API
    d3.json("../api_states").then(function(data){
        // Iterating through each document to filter the information matching the state selected
        data.forEach(function(d){
            if(d.properties.ENTIDAD === parseInt(state)){
                let pobtot = Intl.NumberFormat().format(d.properties.POBTOT)
                let pobfem = Intl.NumberFormat().format(d.properties.POBFEM)
                let pobmas = Intl.NumberFormat().format(d.properties.POBMAS)
                let vivhab = Intl.NumberFormat().format(d.properties.TVIVPARHAB)
                let ranking = Intl.NumberFormat().format(d.properties.RANKING)
                
                // Inserting HTML code with d3 to fill the table
                let selection = d3.select("tbody")
                selection.html(`
                <tr>
                <td>Total population</td>
                <td>${pobtot}</td>
                </tr>
                <tr>
                <td>Women's population</td>
                <td>${pobfem}</td>
                </tr>
                <tr>
                <td>Men's population</td>
                <td>${pobmas}</td>
                </tr>
                <tr>
                <td>Inhabited dwellings</td>
                <td>${vivhab}</td>
                </tr>
                <tr>
                <td>National Ranking</td>
                <td>${ranking}</td>
                </tr>
                `)
            }
        })
        
        // loading image to the already declared class in the html 
        let stateimage = d3.select(".state_img")
        stateimage.html(`
        <img src="../static/images/${state}.jpg" id="stateimg" alt="${state}" data-aos="fade-up">`)

    })
    

}

// -----------------------------------------------Leaflet parameters-----------------------------------------------------------------------------------

// Functions and parameters for the Leaflet visualization
// Regex function to give format to the numbers displayed
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

// Adding a cutsom information control to the upper right corner
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


// Adding the legend control to show the meaning of each color
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

// ---------------------------------------------Boxplot-------------------------------------------------------------------------------------

// Assigning colors
let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];

let data1 = [];

// Creating layout options
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

//  Create the Traces
var xData = ['Television', 'Radio',
        'Fixed<br>Telphony', 'Mobile<br>Telephony',
        'Pay<br>Television', 'Video Games<br>Console',
        'Internet', 'Streaming<br>Services', 'Computer'];

// ---------------------------------------------Leaflet function-------------------------------------------------------------------------------------
// Main function to read the data and call all the above functions for dynamic update
function map_init(){
    // If a layer is already added and the user picks another state, the past layer will be gone and the map will be centered again
    try{
        mymap.removeLayer(geojson)
        mymap.setView([22.849294981948546, -102.68634458318647], 5)
    }
    catch{}

    // Getting the state value and reading the data
    let state = document.getElementById("stateDrop").value
    
    d3.json("../api_municipios").then(function(data){
        // Filtering the data by the state selected 
        var states = data.filter(d=>d.properties.ENTIDAD === parseInt(state))  
        
        var box_states = data.filter(d=>d.properties.ENTIDAD === parseInt(state))  
        // Modifying the variable for the boxplot visualization
        var yData = [
            box_states.map(val => val.properties.VPH_TV/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_RADIO/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_TELEF/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_CEL/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_STVP/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_CVJ/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_INTER/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_SPMVPI/val.properties.TVIVPARHAB*100),
            box_states.map(val => val.properties.VPH_PC/val.properties.TVIVPARHAB*100),
        ];
        // Getting the type of polygon from the selected data
        let type = states[0].geometry.type
        
        // Obtaining the first pair of coordinates from the selected state so we can position our map there.
        // Depending on the type of polygon, the retrieve is made differently
       if(type === "Polygon"){
        var coords = data.filter(d=>d.properties.ENTIDAD === parseInt(state))[0].geometry.coordinates[0][0]
       }else{
        // Type: Multipolygon
        var coords = data.filter(d=>d.properties.ENTIDAD === parseInt(state))[0].geometry.coordinates[0][0][0]
       }
       
        // Update the center of the map with more zoom
       mymap.setView(coords.reverse() ,6, animate = true)  
        
    //    Adding style to the choroplet layer
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.INCLUSION_MUN),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8
            };
        }
    
        // Adding behaviour to the map by calling the previously defined functinos
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }     
        
        // Adding the geojson layer with the choroplet options
        geojson = L.geoJson(states, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mymap);
    
        info.addTo(mymap);
        legend.addTo(mymap);
        
        //   Plotting boxplot
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

        console.log("ok")
    })
}

// Initializing webpage
init()


// Function that calls the other functions every time a state is selected
function stateChanged(result){
    general_info(result)
    map_init()
}

