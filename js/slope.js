
  //credits to http://bl.ocks.org/benvandyke/8482820
    var graphWidth = 680;
    var graphHeight = 620;
    var width = 340;
    var height = 600;
    var raceOn = ["white"];
    var raceOff = ["black", "hispanic", "asian", "native_hawaiian", "alaskan_native", "american_indian"]
    
    var margin = {top: 20, bottom: 20, left: 40, right:40};
    
    var leftScale = d3.scaleLinear()
      .domain([0.0, 1])
      .range([height - margin.top, margin.bottom]);
    
    var rightScale = d3.scaleLinear()
      .domain([0.0, 1])
      .range([height - margin.top, margin.bottom]); 
    
    var currencyFormatter = d3.format("0,.0f");
    


    d3.csv('data/slope_data.csv', function(error, data) {
     // data = d;
        var cityData_white= data.filter(function(d) { 
          return d.white == 1 && d.black == 0 && d.hispanic == 0 && d.asian == 0 && d.american_indian == 0 && d.alaskan_native == 0 && d.native_hawaiian == 0 && d.city != "";
        })
        var stateData_white= data.filter(function(d) { 
          return d.white == 1 && d.black == 0 && d.hispanic == 0 && d.asian == 0 && d.american_indian == 0 && d.alaskan_native == 0 && d.native_hawaiian == 0;
        })

    var svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
    var gCity= svg.append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "state-graph")
      .attr("transform","translate(0," + 40 + ")")
      // .on("mouseout", removeLineInfo);

    var gState= svg.append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "state-graph")
      .attr("transform","translate("+width+ "," + 40 + ")")
      // .on("mouseout", removeLineInfo);

    //CITIES GRAPH

      var cityText = gCity.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3+",0)")
        .attr("class", "cityText")

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
        .attr("stroke-width", 1)
        .attr("class", "city-line")
        .on("mouseover", showLineInfo)
      
      gCity
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", margin.left)
        .attr("y1", function(d) {
          return leftScale(0)
        })
        .attr("y2", function(d) {
          return leftScale(1)
        })
        .attr("class", "sideline")
        
      gCity
        .append("line")
        .attr("x1", width-margin.right)
        .attr("x2", width-margin.right)
        .attr("y1", function(d) {
          return leftScale(0)
        })
        .attr("y2", function(d) {
          return leftScale(1)
        })
        .attr("class", "sideline")
      
      // //STATE GRAPH

      var stateText = gState.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3+",0)")
        .attr("class", "stateText")

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
        .attr("stroke-width", 1)
        .attr("class", "state-line")
        .on("mouseover", showLineInfo);
      gState
        .append("line")
        .attr("x1", margin.left)
        .attr("x2", margin.left)
        .attr("y1", function(d) {
          return leftScale(0)
        })
        .attr("y2", function(d) {
          return leftScale(1)
        })
        .attr("class", "sideline")
        
      gState
        .append("line")
        .attr("x1", width-margin.right)
        .attr("x2", width-margin.right)
        .attr("y1", function(d) {
          return leftScale(0)
        })
        .attr("y2", function(d) {
          return leftScale(1)
        })
        .attr("class", "sideline")


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
      function removeLineInfo() {
        d3.selectAll(".stateText, .cityText")
          .text("")
      }
      function showLineInfo(d) {
        d3.selectAll(".city-line, .state-line")
          .classed("highlight", false)
        d3.select(".stateText")
          .text(function() {
            return d.state
          })
        d3.select(".cityText")
          .text(function() {
            return (d.city=="") ? "No city data for this state" : d.city
          })
        d3.select(this)
          .classed("highlight", true)
      }

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

        gCity.selectAll(".city-line")
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
        //CITY LABELS
        var rightLabelsCity = gCity.selectAll(".labels")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("x", width - margin.right + 3)
          .attr("y", function(d) {
            return rightScale(d['city_teacher']) + 4;
          })
          .text(function (d) {
            return d['city'] //+ " " + currencyFormatter(d['2010']);
          });
      
        var leftLabelsCity = gCity.selectAll(".left-labels")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("x", margin.left - 65)
          .attr("y", function(d) {
            return leftScale(d['city_k12']) + 4;
          })
          .text(function (d) {
            return d['city']// + " " + currencyFormatter(d['1980']);
          })
          .style("text-anchor","begin");
        
        gState.selectAll(".state-line")
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
        //STATE LABELS
        var rightLabelsState = gState.selectAll(".labels")
          .data(dataState)
          .transition()
          .duration(2000)
          .attr("x", width - margin.right + 3)
          .attr("y", function(d) {
            return rightScale(d['state_teacher']) + 4;
          })
          .text(function (d) {
            return d['state'] //+ " " + currencyFormatter(d['2010']);
          });
        
        var leftLabelsState = gState.selectAll(".left-labels")
          .data(dataState)
          .transition()
          .duration(2000)
          .attr("x", margin.left - 65)
          .attr("y", function(d) {
            return leftScale(d['state_k12']) + 4;
          })
          .text(function (d) {
            return d['state']// + " " + currencyFormatter(d['1980']);
          })
          .style("text-anchor","begin");

      }


    });
