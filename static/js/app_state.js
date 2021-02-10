    
    
       let municipio = document.getElementById("selDataset").value

   
   d3.json("/api_municipios").then(function(data){

        // Create empty array
        let municipios =[]
        // Push every state from the data
        data.forEach(function(d){
            municipios.push(d.properties.NOMBRE_MUNICIPIO)
        })
        // Create new set with unique states

        let selection = d3.select("#selDataset")
        .selectAll("option")
        selection.data(data)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d =>d.properties.MUNICIPIO)
        .text(d=>d.properties.NOMBRE_MUNICIPIO)
        selection.exit().remove()
        let firstResult = municipios[0]
        StateChanged(firstResult)
    })

function general_info(a){
    let municipio = document.getElementById("selDataset").value
    console.log(municipio)
    d3.json("/api_municipios").then(function(data){
        
        data.forEach(function(d){
            console.log(d.properties.MUNICIPIO)
            if(d.properties.MUNICIPIO=== parseInt(municipio)){
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



