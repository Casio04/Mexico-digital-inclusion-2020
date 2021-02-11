// BOX PLOT MUNICIPIOS ASOCIADA A statal.html

d3.json("../api_municipios").then((data) => {
    //  Create the Traces
      
      let state = document.getElementById("stateDrop").value
      let dat = data;
  
      let states = dat.filter(d=>d.properties.ENTIDAD === parseInt(state))
   
       let firstResult = states[0]
            StateChanged(firstResult)
  
  var xData = ['Television', 'Radio',
        'Fixed<br>Telphony', 'Mobile<br>Telephony',
        'Pay<br>Television', 'Video Games<br>Console',
        'Internet', 'Streaming<br>Services', 'Computer'];
  
  var yData = [
          states.map(val => val.properties.VPH_TV/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_RADIO/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_TELEF/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_CEL/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_STVP/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_CVJ/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_INTER/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_SPMVPI/val.properties.TVIVPARHAB*100),
          states.map(val => val.properties.VPH_PC/val.properties.TVIVPARHAB*100),
      ];
  
  let colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];
  
  let data1 = [];
  
  for ( let i = 0; i < xData.length; i ++ ) {
      let result = {
          type: 'box',
          y: yData[i],
          name: xData[i],
          jitter: 0.5,
          whiskerwidth: 0.2,
          fillcolor: 'colors',
          marker: {
              size: 6
          },
          line: {
              width: 3
          }
      };
      data1.push(result);
  };
  
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
          t: 100
      },
      paper_bgcolor: 'rgb(243, 243, 243)',
      plot_bgcolor: 'rgb(243, 243, 243)',
      showlegend: false
  };
  
  Plotly.newPlot('plot', data1, layout);
  
  });
  