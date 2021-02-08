function init(){
    d3.json("../api_states").then(function(data){
        // Create empty array
        console.log(data)
        // let states = []
        // // Push every state from the data
        // data.forEach(function(state){
        //     states.push(state.NOMBRE_ENTIDAD)
        // })
        // // Create new set with unique states
        // let unique_states = [...new Set(states)]

        // let selection = d3.select("#stateDrop")
        // .selectAll("option")
        // selection.data(unique_states)
        // .enter()
        // .append("option")
        // .merge(selection)
        // .attr("value", d=>d)
        // .text(d=>d)
        // selection.exit().remove()
        // let firstResult = unique_states[0]
        // StateChanged(firstResult)
    })
}


// Read CSV
function U_States(){
    d3.csv("../data/Censo.csv").then(function(data){
        // Create empty array
        let states = []
        // Push every state from the data
        data.forEach(function(state){
            states.push(state.NOMBRE_ENTIDAD)
        })
        // Create new set with unique states
        let unique_states = [...new Set(states)]
        return unique_states
    })
}

function general_info(){
    let state = document.getElementById("stateDrop").value
    d3.csv("../data/Censo.csv").then(function(data){
        
        let filtered_data = data.filter(d => d.NOMBRE_ENTIDAD == state)
        let pobtot = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBTOT))
        let pobfem = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBFEM))
        let pobmas = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.POBMAS))
        let vivhab = Intl.NumberFormat().format(d3.sum(filtered_data, d=> d.TVIVPARHAB))
        let totmun = d3.max(filtered_data, d=> d.MUNICIPIO)
        
        // @TODO 
        // Insert municipios  - Casio
        // Ranking por estado y porcentaje de inclusión - Casio
        // Foramto a página principal y por estado - Casio

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
        
        let states = []
        // Push every state from the data
        data.forEach(function(state){
            states.push(state.NOMBRE_ENTIDAD)
        })
        // Create new set with unique states
        let unique_states = [...new Set(states)]

        let stateNo = unique_states.indexOf(state) + 1
        let stateimage = d3.select(".state_img")
        stateimage.html(`
        <img src="../static/images/${stateNo}.jpg" id="stateimg" alt="${stateNo}">
        `)

    })
    

}

init()

function StateChanged(state){
    general_info()
}
