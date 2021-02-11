
function init(){
    d3.json("../api_states").then(function(data){

        // Create empty array
        let states =[]

        // Push every state from the data
        data.forEach(function(d){
            states.push(d.properties.NOMBRE_ENTIDAD)
        })
        // Create new set with unique states
        let selection = d3.select("#stateDrop")
        .selectAll("option")
        selection.data(data)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d =>d.properties.ENTIDAD)
        .text(d=>d.properties.NOMBRE_ENTIDAD)
        selection.exit().remove()
        let firstResult = states[0]
        StateChanged(firstResult)
    })
}

function general_info(a){
    let state = document.getElementById("stateDrop").value
    
    d3.json("../api_states").then(function(data){
        
        data.forEach(function(d){
            
            if(d.properties.ENTIDAD === parseInt(state)){
                let pobtot = Intl.NumberFormat().format(d.properties.POBTOT)
                let pobfem = Intl.NumberFormat().format(d.properties.POBFEM)
                let pobmas = Intl.NumberFormat().format(d.properties.POBMAS)
                let vivhab = Intl.NumberFormat().format(d.properties.TVIVPARHAB)
                let ranking = Intl.NumberFormat().format(d.properties.RANKING)

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
        
        let stateimage = d3.select(".state_img")
        stateimage.html(`
        <img src="../static/images/${state}.jpg" id="stateimg" alt="${state}" data-aos="fade-up">`)

    })
    

}

init()

function StateChanged(result){
    general_info(result)
}

