
  //credits to http://bl.ocks.org/benvandyke/8482820
    var graphWidth = 680;
    var graphHeight = 700;
    var width = 340;
    var height = 600;
    var raceOn = ["white"];
    var raceOff = ["black", "hispanic", "asian", "native_hawaiian", "alaskan_native", "american_indian"]
    
    var margin = {top: 20, bottom: 20, left: 100, right:100};
    
    var leftScale = d3.scaleLinear()
      .domain([0.0, 1])
      .range([height - margin.top, margin.bottom]);
    
    var rightScale = d3.scaleLinear()
      .domain([0.0, 1])
      .range([height - margin.top, margin.bottom]); 
    
    var currencyFormatter = d3.format("0,.0f");
    

    var svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
    var gCity= svg.append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "state-graph")
      .attr("transform","translate(0," + 100 + ")")
    var gState= svg.append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "state-graph")
      .attr("transform","translate("+width+ "," + 100 + ")")

    d3.csv('data/slope_data.csv', function(error, data) {
     // data = d;
        var cityData_white= data.filter(function(d) { 
          return d.white == 1 && d.black == 0 && d.hispanic == 0 && d.asian == 0 && d.american_indian == 0 && d.alaskan_native == 0 && d.native_hawaiian == 0 && d.city != "";
        })
        var stateData_white= data.filter(function(d) { 
          return d.white == 1 && d.black == 0 && d.hispanic == 0 && d.asian == 0 && d.american_indian == 0 && d.alaskan_native == 0 && d.native_hawaiian == 0;
        })
    
    //CITIES GRAPH
      var lines = gCity.selectAll("line")
        .data(cityData_white);
        
      lines.enter()
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", function(d) {
          return leftScale(d['city_k12']);
        })
        .attr("y2", function(d) {
          return rightScale(d['city_teacher']);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      var rightLabels = gCity.selectAll(".labels")
        .data(cityData_white);
        
      rightLabels.enter()
        .append("text")
        .attr("class","labels")
        .attr("x", width - margin.right + 3)
        .attr("y", function(d) {
          return rightScale(d['city_teacher']) + 4;
        })
        .text(function (d) {
          return d['city'] //+ " " + currencyFormatter(d['2010']);
        });
      
      var leftLabels = gCity.selectAll(".left-labels")
        .data(cityData_white);
        
      leftLabels.enter()
        .append("text")
        .attr("class","left-labels")
        .attr("x", margin.left - 65)
        .attr("y", function(d) {
          return leftScale(d['city_k12']) + 4;
        })
        .text(function (d) {
          return d['city']// + " " + currencyFormatter(d['1980']);
        })
        .style("text-anchor","begin");
      
      // //STATE GRAPH
      
      var lines2 = gState.selectAll("line")
        .data(stateData_white);
        
      lines2.enter()
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", function(d) {
          return leftScale(d['state_k12']);
        })
        .attr("y2", function(d) {
          return rightScale(d['state_teacher']);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      var rightLabels2 = gState.selectAll(".labels")
        .data(stateData_white);
        
      rightLabels2.enter()
        .append("text")
        .attr("class","labels")
        .attr("x", width - margin.right + 3)
        .attr("y", function(d) {
          return rightScale(d['state_teacher']) + 4;
        })
        .text(function (d) {
          return d['state'] //+ " " + currencyFormatter(d['2010']);
        });
      
      var leftLabels2 = gState.selectAll(".left-labels")
        .data(stateData_white);
        
      leftLabels2.enter()
        .append("text")
        .attr("class","left-labels")
        .attr("x", margin.left - 65)
        .attr("y", function(d) {
          return leftScale(d['state_k12']) + 4;
        })
        .text(function (d) {
          return d['state']// + " " + currencyFormatter(d['1980']);
        })
        .style("text-anchor","begin");

      svg.append("text")
        .attr("x", graphWidth / 2)
        .attr("y", 20)
        .attr("class", "chart-title")
        .text("Share of Students vs. Teachers by Race");

      d3.selectAll(".button_toggle")
        .on("click", function() {
          if (d3.select(this).classed("on")){
            d3.select(this).classed("off", true)
            d3.select(this).classed("on", false)
            updateDataOn("off", this.id)
          }else {
            d3.select(this).classed("on", true)
            d3.select(this).classed("off", false)
            updateDataOn("on", this.id)
          }
        })

      function updateDataOn(buttonState, race){
        if (buttonState == "on") {
          var index = raceOff.indexOf(race);
          if (index > -1) {
            raceOff.splice(index,1)
          }
          raceOn.push(race)
          newData = data.filter(function(d,i){ 
            return d[race] == 1;
          });  
        }else{
          var index = raceOn.indexOf(race);
          if (index > -1) {
            raceOn.splice(index,1)
          }
          raceOff.push(race)
          newData = data.filter(function(d,i){ 
            return d[race] == 0;
          }); 
        }
        updateDataOff(newData)
      }

      function updateDataOff(newData) {
        for (i=0; i<raceOff.length; i++){   
          newDataFiltered = newData.filter(function(d){
            return d[raceOff[i]] == 0
          })
          newData = newDataFiltered;
        }
          var dataCity = newDataFiltered.filter(function(d) {
            return d.city != ""
          })
          var dataState = newDataFiltered
          updateLines(dataCity, dataState)
      }

      function updateLines(dataCity, dataState) {
        console.log(dataCity)
        console.log(dataState)
        console.log("raceOff: " + raceOff)
        console.log("raceOn: " + raceOn)
        gCity.selectAll("line")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
          .attr("y1", function(d) {
            return leftScale(d['city_k12']);
          })
          .attr("y2", function(d) {
            return rightScale(d['city_teacher']);
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1);
        gState.selectAll("line")
          .data(dataState)
          .transition()
          .duration(2000)
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
          .attr("y1", function(d) {
            return leftScale(d['state_k12']);
          })
          .attr("y2", function(d) {
            return rightScale(d['state_teacher']);
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1);
      }


    });
