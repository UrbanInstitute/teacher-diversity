
  //credits to http://bl.ocks.org/benvandyke/8482820
    var graphWidth = 680;
    var graphHeight = 620;
    var width = 340;
    var height = 600;
    var raceOn = ["white"];
    var raceOff = ["black", "hispanic", "asian", "native_hawaiian", "alaskan_native", "american_indian"]
    
    var margin = {top: 80, bottom: 20, left: 40, right:40};
    
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

      svg.append("text")
        .attr("x", width/2-margin.left)
        .attr("y", 15)
        .text("CITIES")
        .attr("class", "header")
      svg.append("text")
        .attr("x", width + width/2 - margin.right)
        .attr("y", 15)
        .text("STATES")
        .attr("class", "header")
      //CITIES GRAPH

      var cityText = gCity.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3.2+",30)")
        .attr("class", "cityText")

      var lines = gCity.selectAll("line")
        .data(cityData_white);
      var leftCircles = gCity.selectAll("circle")
        .data(cityData_white)
      var rightCircles = gCity.selectAll("circle")
        .data(cityData_white)

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
        .attr("class", function(d) {
          return "city-line city-line-" + d.abbr 
        })
        .on("mouseover", showLineInfo)
      leftCircles.enter()
        .append("circle")
        .attr("cy", function(d) {
          return leftScale(d['city_k12']);
        })
        .attr("cx", margin.left)
        .attr("r", 5)
        .attr("fill", "#fbbe15")
        .attr("class", function(d) {
          return "circle city-circle-left city-circle-left-" + d.abbr 
        })
      rightCircles.enter()
        .append("circle")
        .attr("cy", function(d) {
          return rightScale(d['city_teacher']);
        })
        .attr("cx", width - margin.right)
        .attr("r", 5)
        .attr("fill", "#fbbe15")
        .attr("class", function(d) {
          return "circle city-circle-right city-circle-right-" + d.abbr 
        })
      // //STATE GRAPH

      var stateText = gState.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3+",30)")
        .attr("class", "stateText")

      var lines2 = gState.selectAll("line")
        .data(stateData_white);
      var leftCircles2 = gState.selectAll("circle")
        .data(stateData_white)
      var rightCircles2 = gState.selectAll("circle")
        .data(stateData_white)



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
        .attr("class", function(d) {
          return "state-line state-line-" + d.abbr
        })
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
      leftCircles2.enter()
        .append("circle")
        .attr("cy", function(d) {
          return leftScale(d['state_k12']);
        })
        .attr("cx", margin.left)
        .attr("r", 5)
        .attr("fill", "#1896d2")
        .attr("class", function(d) {
          return "circle state-circle-left state-circle-left-" + d.abbr 
        })
      rightCircles2.enter()
        .append("circle")
        .attr("cy", function(d) {
          return rightScale(d['state_teacher']);
        })
        .attr("cx", width - margin.right)
        .attr("r", 5)
        .attr("fill", "#1896d2")
        .attr("class", function(d) {
          return "circle state-circle-right state-circle-right-" + d.abbr 
        })

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
        d3.selectAll(".stateText, .cityText, .circle")
          .text("")
      }
      function showLineInfo(d) {
        d3.selectAll(".city-line, .state-line, .circle")
          .classed("highlight", false)
        d3.select(".stateText")
          .text(function() {
            return d.state
          })
        d3.select(".cityText")
          .text(function() {
            return (d.city=="") ? "No city data for this state" : d.city
          })
          .classed("no-city", function() {
            return (d.city== "") ? true: false
          })
          if(d3.select(this).attr("class").search("city-line") == 0) {
            d3.select(this)
              .classed("highlight", true)
              .moveToFront()
            d3.selectAll(".state-line-" + d.abbr + ", .city-circle-left-" + d.abbr + ", .city-circle-right-" + d.abbr + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()
          }else {
          d3.selectAll(".state-line-" + d.abbr + ", .city-line-" + d.abbr + ", .city-circle-left-" + d.abbr + ", .city-circle-right-" + d.abbr + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
            .classed("highlight", true)
            .moveToFront()
          }

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
      d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };

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

        gCity.selectAll(".city-circle-left")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("cy", function(d) { 
            return leftScale(d['city_k12']);
          })
        gCity.selectAll(".city-circle-right")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("cy", function(d) { 
            return rightScale(d['city_teacher']);
          })

        gState.selectAll(".state-circle-left")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("cy", function(d) { 
            return leftScale(d['state_k12']);
          })
        gState.selectAll(".state-circle-right")
          .data(dataCity)
          .transition()
          .duration(2000)
          .attr("cy", function(d) { 
            return rightScale(d['state_teacher']);
          })    
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
