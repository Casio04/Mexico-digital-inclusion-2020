function init(){
    d3.json("../api_states").then(function(data){
        // data.forEach(function(d){
        //     console.log(d["0"].properties.NOMBRE_ENTIDAD)
        // })
        
        // Create empty array
        let states =[]
        // Push every state from the data
        data.forEach(function(d){
            states.push(d["0"].properties.NOMBRE_ENTIDAD)
        })
        // Create new set with unique states

        let selection = d3.select("#stateDrop")
        .selectAll("option")
        selection.data(states)
        .enter()
        .append("option")
        .merge(selection)
        .attr("value", d=>d)
        .text(d=>d)
        selection.exit().remove()
        let firstResult = states[0]
        StateChanged(firstResult)
    })
}

function general_info(a){
    let state = document.getElementById("stateDrop").value
    d3.json("../api_states").then(function(data){
        
        data.forEach(function(d){
            console.log(d["0"].properties.NOMBRE_ENTIDAD)
            if(d["0"].properties.NOMBRE_ENTIDAD === state){
                let pobtot = Intl.NumberFormat().format(d["0"].properties.POBTOT)
                let pobfem = Intl.NumberFormat().format(d["0"].properties.POBFEM)
                let pobmas = Intl.NumberFormat().format(d["0"].properties.POBMAS)
                let vivhab = Intl.NumberFormat().format(d["0"].properties.TVIVPARHAB)

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

                `)
            }
        })
       
        
        // @TODO 
        // Insert municipios  - Casio
        // Ranking por estado y porcentaje de inclusión - Casio
        // Foramto a página principal y por estado - Casio

        
        
        // let states = []
        // // Push every state from the data
        // data.forEach(function(state){
        //     states.push(state.NOMBRE_ENTIDAD)
        // })
        // // Create new set with unique states
        // let unique_states = [...new Set(states)]

        // let stateNo = unique_states.indexOf(state) + 1
        // let stateimage = d3.select(".state_img")
        // stateimage.html(`
        // <img src="../static/images/${stateNo}.jpg" id="stateimg" alt="${stateNo}">
        // `)

    })
    

}

init()

function StateChanged(result){
    general_info(result)
}


let a = {"0":{"id":"0","type":"Feature","properties":
{"ENTIDAD":1,"INCLUSION_EST":0.9461868792,"NOMBRE_ENTIDAD":"Aguascalientes","PEA":703101,"POBFEM":726401,"POBMAS":692484,"POBTOT":1425603,"RANKING":20.0,"TVIVPARHAB":385119,"VPH_CEL":358691,"VPH_CVJ":70047,"VPH_INTER":235652,"VPH_PC":176868,"VPH_RADIO":310947,"VPH_SPMVPI":98641,"VPH_STVP":173721,"VPH_TELEF":147738,"VPH_TV":369261}}}

console.log(a["0"].properties.NOMBRE_ENTIDAD)