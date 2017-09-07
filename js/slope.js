
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
        var all_data = data
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
        .attr("transform","translate(0," + 20 + ")")
        // .on("mouseout", removeLineInfo);

      var gState= svg.append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "state-graph")
        .attr("transform","translate("+width+ "," + 20 + ")")

      //DROPDOWN MENUS
      var selectCity = d3.select("#city-menu").append("select")
        .attr("id", "city-select")
      var optionsCity = selectCity
        .selectAll('option')
        .data(cityData_white).enter()
        .append('option')
        .text(function (d) { return d.city; });
      selectCity
        .append("option")
        .text("CITIES")
        .attr("value","cities")
        .attr("selected", "selected")
        .attr("disabled", "disabled")
        .attr("hidden", "hidden")
        .attr("class", "dropdown-default")
      var selectState = d3.select("#state-menu")
        .append("select")
        .attr("id", "state-select")
      var optionsState = selectState
        .selectAll('option')
        .data(stateData_white).enter()
        .append('option')
        .text(function (d) { return d.state; });
      selectState
        .append("option")
        .text("STATE")
        .attr("value","state")
        .attr("selected", "selected")
        .attr("disabled", "disabled")
        .attr("hidden", "hidden")
        .attr("class", "dropdown-default")


    $("#state-select")
      .selectmenu({
         // open: function( event, ui ) {
         //    // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*6) + "px")
         //    // pymChild.sendHeight();
         //  },
         //  close: function(event, ui){
         //    d3.select("body").style("height", null)
         //    pymChild.sendHeight();
         //  },
         change: function(event, d){
            var name = this.value
            var state = "state"
            highlightLine(name, state)
          }
      })     
      .selectmenu( "menuWidget" )
      .addClass( "ui-menu-icons customicons" );
    $("#city-select")
      .selectmenu({
         // open: function( event, ui ) {
         //    // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*6) + "px")
         //    // pymChild.sendHeight();
         //  },
         //  close: function(event, ui){
         //    d3.select("body").style("height", null)
         //    pymChild.sendHeight();
         //  },
         change: function(event, d){
            var name = this.value
            var city = "city"
            highlightLine(name, city)
          }
      })     
      .selectmenu( "menuWidget" )
      .addClass( "ui-menu-icons customicons" );

      var sort = function() {
        // choose target dropdown
        var citySelect = $("#city-select");
        citySelect.html(citySelect.find('option').sort(function(x, y) {
          // to change to descending order switch "<" for ">"
          return $(x).text() > $(y).text() ? 1 : -1;
        }));
        var stateSelect = $("#state-select");
        stateSelect.html(stateSelect.find('option').sort(function(x, y) {
          // to change to descending order switch "<" for ">"
          return $(x).text() > $(y).text() ? 1 : -1;
        }));
      };
      sort()

      var highlightLine = function(name, geography) {
        d3.selectAll(".stateText, .cityText")
          .text("")
        d3.selectAll(".city-line, .city-circle-left, .city-circle-right, .state-line, .state-circle-left, .state-circle-right ")
          .classed("highlight", function(d) {
            if (geography == "city"){
              return (d.city == name) ? true : false
            }else {
              if (geography == "state"){
                return (d.state == name) ? true : false
              }
            }
          })
          d3.selectAll(".highlight").moveToFront()
          if (d3.selectAll(".city-line.highlight").node() == null) {
            console.log($('#city-select').value)
            $('#city-select').val("cities")
          }

      }


      //CITIES GRAPH

      var cityText = gCity.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3.2+",15)")
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
          return "city-line city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
        })
        .on("mouseover", showLineInfo)
      leftCircles.enter()
        .append("circle")
        .attr("cy", function(d) {
          return leftScale(d['city_k12']);
        })
        .attr("cx", margin.left)
        .attr("r", 5)
        .attr("class", function(d) {
          return "circle city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id
        })
      rightCircles.enter()
        .append("circle")
        .attr("cy", function(d) {
          return rightScale(d['city_teacher']);
        })
        .attr("cx", width - margin.right)
        .attr("r", 5)
        .attr("class", function(d) {
          return "circle city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
        })
      // //STATE GRAPH

      var stateText = gState.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        .attr("transform","translate("+width/3+",15)")
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
        .attr("class", function(d) {
          return "circle state-circle-right state-circle-right-" + d.abbr 
        })

      d3.selectAll(".button_toggle")
        .on("click", function() {
          if (d3.select(this).classed("on")){
            d3.select(this).classed("off", true)
            d3.select(this).classed("on", false)
            updateDataOn("off", this.id, all_data)
          }else {
            d3.select(this).classed("on", true)
            d3.select(this).classed("off", false)
            updateDataOn("on", this.id, all_data)
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
            d3.selectAll(".state-line-" + d.abbr + ", .city-circle-left-" + d.abbr + d.city_id + ", .city-circle-right-" + d.abbr + d.city_id + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()
          }else {
          d3.selectAll(".state-line-" + d.abbr + ", .city-line-" + d.abbr + ", .city-circle-left-" + d.abbr + ", .city-circle-right-" + d.abbr + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
            .classed("highlight", true)
            .moveToFront()
          }

      }

      d3.selection.prototype.moveToFront = function() {  console.log('hi')
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
      };

      function updateDataOn(buttonState, race, all_data){ 
        //if button is turned on, update On and Off array
        if (buttonState == "on") {
          var index = raceOff.indexOf(race);
          if (index > -1) {
            raceOff.splice(index,1)
          }
          raceOn.push(race) 
        }else{  //if button is turned off, update  On and Off array
          var index = raceOn.indexOf(race);
          if (index > -1) {
            raceOn.splice(index,1)
          }
          raceOff.push(race)
        } 
        for (i=0; i<raceOn.length; i++){ // filter data by races that are turned on
          newData = all_data.filter(function(d){ 
            return d[raceOn[i]] == 1;
          })
          all_data = newData
        }  
        updateDataOff(newData)
      }


      function updateDataOff(newData) { //pass filtered data from updateDataOn function and filter by races that are turned off
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

        console.log("raceOff: " + raceOff)
        console.log("raceOn: " + raceOn)
        console.log(dataCity)
        console.log(dataState)
        
        //TRANSITION CITY LINES
        var cityLines = gCity.selectAll(".city-line")
          .data(dataCity)
        var city = "city"
        var line = "line"
        moveLines(cityLines, city, line)
        //TRANSITION STATE LINES  
        var stateLines = gState.selectAll(".state-line")
          .data(dataState)
        var state = "state"
        var line = "line"
        var circle = "circle"
        moveLines(stateLines, state, line)

        //TRANSITION CITY CIRCLES
        var cityCirclesLeft = gCity.selectAll(".city-circle-left")
          .data(dataCity)
        var left = "left"
        moveCircles(cityCirclesLeft, city, circle, left)

        var cityCirclesRight = gCity.selectAll(".city-circle-right")
          .data(dataCity)
        var right = "right"
        moveCircles(cityCirclesRight, city, circle, right)

        var stateCirclesLeft = gState.selectAll(".state-circle-left")
          .data(dataState)
        moveCircles(stateCirclesLeft, state, circle, left)

        var stateCirclesRight = gState.selectAll(".state-circle-right")
          .data(dataState)
         moveCircles(stateCirclesRight, state, circle, right)


        function moveCircles(elements, geography, elementType, elementSide) {
          elements
            .transition()
            .duration(1000)
            .attr("cy", function(d) {
              if (geography == "city"){
                return (elementSide == "left") ? leftScale(d['city_k12']) : rightScale(d['city_teacher']);
              }else {
                return (elementSide == "left") ? leftScale(d['state_k12']) : rightScale(d['state_teacher']);
              }
            })
            .attr("cx", function() {
              return (elementSide == "left") ? margin.left : width - margin.right
            })
            .attr("r", 5)
            .attr("class", function(d) { 
              if (geography == "city") {
                return (elementSide == "left") ? "circle city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
              }else {
                return (elementSide == "left") ? "circle state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
              }
            })
          elements.enter().append(elementType)
            .attr("class", function(d) { 
              if (geography == "city") {
                return (elementSide == "left") ? "circle city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
              }else {
                return (elementSide == "left") ? "circle state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
              }
            })
            .merge(elements)
            .transition()
            .duration(1000)
            .attr("cy", function(d) {
              if (geography == "city"){
                return (elementSide == "left") ? leftScale(d['city_k12']) : rightScale(d['city_teacher']);
              }else {
                return (elementSide == "left") ? leftScale(d['state_k12']) : rightScale(d['state_teacher']);
              }
            })
            .attr("cx", function() {
              return (elementSide == "left") ? margin.left : width - margin.right
            })            
            .attr("r", 5)
          elements
            .exit()
            .transition()
            .style("opacity", 0)
            .remove()
        }
        function moveLines(elements, geography, elementType) {
          elements
            .transition()
            .duration(1000)
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", function(d) {
              return leftScale(d[geography + '_k12']);
            })
            .attr("y2", function(d) {
              return rightScale(d[geography + '_teacher']);
            })
            .attr("class", function(d) {
              if (elements == cityLines) {
                return "city-line city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
              }else{
                if (elements == stateLines) {
                  return "state-line state-line-" + d.abbr
                }
              }
            })
          elements.enter().append(elementType)
            .attr("class", function(d) { 
              if (elements == cityLines) {
                return "city-line city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
              }else {
                if (elements == stateLines) {
                 return "state-line state-line-" + d.abbr
                }
              }
            })
            .merge(elements)
            .transition()
            .duration(1000)
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", function(d) {
              return leftScale(d[geography + '_k12']);
            })
            .attr("y2", function(d) {
              return rightScale(d[geography + '_teacher']);
            })
          elements
            .exit()
            .transition()
            .style("opacity", 0)
            .remove()
        }
      d3.selectAll(".city-line, .state-line")
        .on("mouseover", showLineInfo);


      }


    });
