let mymap = L.map('map').setView([22.958053112290905, -101.97311862309687], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1Ijoicm9kZ3Vhcm5lcm9zIiwiYSI6ImNrazdrcDJkaTAyZjQybm5zdmlyNWl3bDAifQ.VUdkQ9iFNmXi7MHIoxqYeA"
}).addTo(mymap);

d3.json("../source/19mu.geojson").then(data =>{
    console.log(data)
    L.geoJSON(data, {
        color: "gray",
        fillColor: "lightblue",
        weight: 0.5
    }).addTo(mymap)
})


function init(){
    d3.csv("../data/Censo.csv").then(function(data){
        // Create empty array
        let states = []
        // Push every state from the data
        data.forEach(function(state){
            states.push(state.NOM_ENT)
        })
        // Create new set with unique states
        let unique_states = [...new Set(states)]

        let selection = d3.select("#stateDrop")
        .selectAll("option")
        selection.data(unique_states)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d=>d)
        .text(d=>d)
        selection.exit().remove()
        let firstResult = unique_states[0]
        StateChanged(firstResult)
    })
}


// Read CSV
function U_States(){
    d3.csv("../data/Censo.csv").then(function(data){
        // Create empty array
        let states = []
        // Push every state from the data
        data.forEach(function(state){
            states.push(state.NOM_ENT)
        })
        // Create new set with unique states
        let unique_states = [...new Set(states)]
        return unique_states
    })
}

function general_info(){
    let state = document.getElementById("stateDrop").value
    d3.csv("../data/Censo.csv").then(function(data){
        let filtered_data = data.filter(d => d.NOM_ENT == state)
        let pobtot = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBTOT))
        let pobfem = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBFEM))
        let pobmas = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBMAS))
        let vivhab = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.TVIVPARHAB))
        let totmun = d3.max(filtered_data, d=> d.MUN)
        // @TODO 
        // Insert municipios and total de viviendas

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
        <td>Municipalities total</td>
        <td>${totmun}</td>
        </tr>
        `)
        
    })

    
}

init()

function StateChanged(state){
    general_info()
}

