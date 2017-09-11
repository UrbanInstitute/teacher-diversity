
//credits to http://bl.ocks.org/benvandyke/8482820
var formatPercent = d3.format(".1%");
var graphWidth = 690;
var graphHeight = 620;
var width = 340;
var height = 600;
var raceOn = ["white"];
var raceOff = ["black", "hispanic", "asian", "native_hawaiian", "alaskan_native", "american_indian"]

var margin = {top: 80, bottom: 20, left: 43, right:43};

var leftScale = d3.scaleLinear()
  .domain([0.0, 1])
  .range([height - margin.top, margin.bottom]);

var rightScale = d3.scaleLinear()
  .domain([0.0, 1])
  .range([height - margin.top, margin.bottom]); 

var currencyFormatter = d3.format("0,.0f");
    
function drawGraphic(){

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
        .attr("class", "city-graph")
        .attr("transform","translate(0," + 20 + ")")
      gCity.append("text")
        .text("Students")
        .attr("x", function(d) {
          var textWidth = this.getBoundingClientRect().width
          return margin.left - textWidth/3
        })
        .attr("y", height*.92)
        .attr("class", "sideline-label-text")
      gCity.append("text")
        .text("Teachers")
        .attr("x", function(d) {
          return width - margin.right*1.9
        })
        .attr("y", height*.92)
        .attr("class", "sideline-label-text")
      var gState= svg.append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "state-graph")
        .attr("transform","translate("+width+ "," + 20 + ")")
      gState.append("text")
        .text("Students")
        .attr("x", function(d) {
          var textWidth = this.getBoundingClientRect().width
          return margin.left - textWidth/3
        })        
        .attr("y", height*.92)
        .attr("class", "sideline-label-text")
      gState.append("text")
        .text("Teachers")
        .attr("x", function(d) {
          return width - margin.right*1.9
        })        
        .attr("y", height*.92)
        .attr("class", "sideline-label-text")
      //DROPDOWN MENUS
      var selectCity = d3.select("#city-menu")
        .append("select")
        .attr("id", "city-select")
      var optionsCity = selectCity
        .selectAll('option')
        .data(cityData_white)
      var selectState = d3.select("#state-menu")
        .append("select")
        .attr("id", "state-select")
      var optionsState = selectState
        .selectAll('option')
        .data(stateData_white)

      optionsCity.enter()
        .append('option')
        .text(function (d) { return d.city; })
        .attr('value', function(d){ 
          return d.city
        })
        .merge(optionsCity)
      optionsCity.exit().remove()
      selectCity
        .append("option")
        .text("CITIES")
        .attr("value","CITIES")
        .attr("selected", "selected")
        .attr("disabled", "disabled")
        .attr("hidden", "hidden")
        .attr("class", "dropdown-default")
      optionsState.enter()
        .append('option')
        .text(function (d) { return d.state; })
        .attr('value', function(d){
          return d.state
        })
        .merge(optionsState)
      optionsState.exit().remove()
      selectState
        .append("option")
        .text("STATES")
        .attr("value","STATES")
        .attr("selected", "selected")
        .attr("disabled", "disabled")
        .attr("hidden", "hidden")
        .attr("class", "dropdown-default")
      
      var exist = {};
      $('#state-select > option').each(function() {
          if (exist[$(this).val()])
              $(this).remove();
          else
              exist[$(this).val()] = true;
      });

      function modifyDropdownOptions(optionsCity, optionsState, cityDropdown, stateDropdown){ 

        optionsCity.enter()
          .append('option')
          .text(function (d) { return d.city; })
          .attr('value', function(d){ 
            return d.city
          })
          .merge(optionsCity)
        optionsCity.exit().remove()
        optionsState.enter()
          .append('option')
          .text(function (d) { return d.state; })
          .attr('value', function(d){
            return d.state
          })
          .merge(optionsState)
        optionsState.exit().remove()
        
        var exist = {};
        $('#state-select > option').each(function() {
            if (exist[$(this).val()])
                $(this).remove();
            else
                exist[$(this).val()] = true;
        });
        $("#city-select").selectmenu("refresh")
        $("#state-select").selectmenu("refresh")
        sort()

        d3.select(".cityText").text(cityDropdown)
        d3.select(".stateText").text(stateDropdown)
        $('#city-select-button > .ui-selectmenu-text').text("CITIES")
        $('#state-select-button > .ui-selectmenu-text').text("STATES")
        // $('select[id^="city-select"] option:selected').attr("selected",null);       
        // $('select[id^="city-select"] option[value=cityDropdown]').attr("selected","selected");
        // $('select[id^="state-select"] option:selected').attr("selected",null);       
        // $('select[id^="state-select"] option[value=stateDropdown]').attr("selected","selected");
      }
      

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
           open: function( event, ui ) {       
  //console.log($("#city-menu option:selected").val())
              d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*2) + "px")
              // d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open:first-child").style("height",  "300px")
              console.log(d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*2)
              pymChild.sendHeight();
            },
            close: function(event, ui){
              d3.select("body").style("height", null)
              pymChild.sendHeight();
            },
           change: function(event, d){ 
              var name = this.value
              highlightLine(name, "city")
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
        if (name != undefined) {
          removeLineInfo()
          d3.selectAll(".stateText, .cityText")
            .classed("no-city", false)
          d3.selectAll(".city-line, .city-circle-left, .city-circle-right, .state-line, .state-circle-left, .state-circle-right ")
            .classed("selected", function(d) {
              if (geography == "city"){
                return (d.city == name) ? true : false
              }else {
                if (geography == "state"){
                  return (d.state == name) ? true : false
                }
              }
            })
            .moveToFront()
        }
        d3.selectAll(".selected").moveToFront()
        if (d3.selectAll(".city-line.selected").node() == null) {
          var data =d3.select(".state-line.selected").datum()
          showLineInfo(data, "dropdown")
        }else {
          if (d3.selectAll(".city-line.selected").size() > 0) { 
              // var city = d3.select(".city-line.selected").datum().city 
              // var state = d3.select(".state-line.selected").datum().state
              changeDropdown()
              var data =d3.select(".city-line.selected").datum()
              showLineInfo(data, "dropdown")
          }      
        }
      }
      var changeDropdown = function() { 
        $('#city-select-button > .ui-selectmenu-text').text("CITIES")
        // $('select[id^="city-select"] option:selected').attr("selected",null);       
        // $('select[id^="city-select"] option[value=city]').attr("selected","selected");
        $('#state-select-button > .ui-selectmenu-text').text("STATES")
        // $('select[id^="state-select"] option:selected').attr("selected",null);       
        // $('select[id^="state-select"] option[value=state]').attr("selected","selected");
        // var dropdownItem = $(".ui-menu-item-wrapper")
        // d3.selectAll(".ui-menu-item-wrapper")
        //   .classed("ui-state-active", false)
        // d3.selectAll(".ui-menu-item")
        //   .each(function(d) { console.log(d)
        //     d3.select(this)
        //     .classed("ui-state-active", function() { 
        //       return (dropdownItem.text() == city) ? true : false
        //     })
        //   })


      // $("#city-menu option:selected").val(city)
      }

      //CITIES GRAPH

      var cityText = gCity.append("g")
        .attr("width", width)
        .attr("height", 100)
        .append("text")
        // .attr("transform","translate("+width/3.2+",15)")
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
      gCity.append("text")
        .attr("class", "sideline-label")
        .attr("x", margin.left/1.1)
        .attr("y", leftScale(0) + 14)
        .text("0%")
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
      gCity.append("text")
        .attr("class", "sideline-label")
        .attr("x", margin.left/1.4)
        .attr("y", leftScale(1) - 3)
        .text("100%")
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
        .on("mouseout", removeLineInfo)
        .on('click', function(d) {
          showLineInfo(d, "click")
        })
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
        // .attr("transform","translate("+width/3+",15)")
        .attr("class", "stateText")

      var lines2 = gState.selectAll("line")
        .data(stateData_white);
      var leftCircles2 = gState.selectAll("circle")
        .data(stateData_white)
      var rightCircles2 = gState.selectAll("circle")
        .data(stateData_white)

      gState.append("text")
        .attr("class", "sideline-label")
        .attr("x", margin.left/1.4)
        .attr("y", leftScale(1) - 3)
        .text("100%")

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
        .on("mouseover", showLineInfo)
        .on("mouseout", removeLineInfo)
        .on('click', function(d) { 
          showLineInfo(d, "click")
        })

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
      gState.append("text")
        .attr("class", "sideline-label")
        .attr("x", margin.left/1.1)
        .attr("y", leftScale(0) + 14)
        .text("0%")
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
        d3.selectAll(".data-label.highlight")
          .remove()
        d3.select(".cityText")
          .classed("no-city", false)
        if (d3.selectAll(".state-line.selected").size() > 0){
          highlightLine()
          // var state =d3.select(".state-line.selected").datum().state
          // var city =d3.select(".state-line.selected").datum().city
          // console.log(city)
          // d3.select(".stateText")
          //   .text(state)
          // d3.select(".cityText")
          //   .text(city)   
          // d3.selectAll(".state-line.selected, .city-line.selected")
          //   .moveToFront()
          // d3.selectAll(".circle.selected")
          //   .moveToFront()
        }else {
          d3.selectAll(".stateText, .cityText, .circle")
            .text("")
        }
        d3.selectAll(".city-line, .state-line, .circle")
          .classed("highlight", false)

      }
      function showLineInfo(d, origin) { 
        // $('#city-select-button > .ui-selectmenu-text').text("CITIES")
        // $('#state-select-button > .ui-selectmenu-text').text("STATES")
        d3.selectAll(".city-line, .state-line, .circle, .data-label")
          .classed("highlight", false)
        if (origin == "click") { console.log(d)
          d3.selectAll(".data-label.selected")
            .remove() 
          d3.selectAll(".data-label")
            .classed("selected", true)
          //IF LINE IS ALREADY SELECTED AND IS CLICKED ON AGAIN
          if (d3.select(".state-line-" + d.abbr).attr("class").search("selected") > 0){ 
            d3.selectAll(".city-line.selected, .state-line.selected, .circle.selected")
              .classed("selected", false)
          }else { 
              d3.selectAll(".city-line.selected, .state-line.selected, .circle.selected")
                .classed("selected", false)
            if (d3.selectAll(".data-label.selected").size() > 4) {
              d3.selectAll(".city-line-" + d.abbr + ",.state-line-" + d.abbr)
                .classed("selected", true)
                .moveToFront()
              d3.selectAll(".city-circle-left-" + d.abbr + ", .city-circle-right-" + d.abbr + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
                .classed("selected", true)
                .moveToFront()  
            }else {
              d3.selectAll(".city-line-" + d.abbr + d.city_id + ",.state-line-" + d.abbr)
                .classed("selected", true)
                .moveToFront()
              d3.selectAll(".city-circle-left-" + d.abbr + d.city_id + ", .city-circle-right-" + d.abbr + d.city_id + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
                .classed("selected", true)
                .moveToFront()  
            }
          }      
        }else if (origin == "dropdown"){
          d3.select(".stateText")
            .text(function() { 
                return d.state
            })
            .attr("transform", function(d){
              var textWidth = (this.getBoundingClientRect().width)
              var graphWidth = d3.select("g.state-graph").attr("width") - margin.left - margin.right
              return "translate("+(margin.left + (graphWidth - textWidth)/2.2) +",15)"
            })
          d3.select(".cityText")
            .text(function() { 
              if (d3.selectAll(".city-line.selected").size() > 1) { 
                return "multiple cities"
              }else{ 
                return (d.city=="") ? "No city data for this state" : d.city
              }
            })
            .classed("no-city", function() {
              return (d.city== "") ? true: false
            })
            .attr("transform", function(d){
              var textWidth = (this.getBoundingClientRect().width)
              var graphWidth = d3.select("g.city-graph").attr("width") - margin.left - margin.right
              return "translate("+(margin.left + (graphWidth - textWidth)/2.2) +",15)"
            })
        }else { //IF HOVERING OVER CITY
          if(d3.select(this).attr("class").search("city-line") == 0) {
            d3.select(this)
              .classed("highlight", true)
              .moveToFront()
            d3.selectAll(".state-line-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()
            d3.selectAll(".city-circle-left-" + d.abbr + d.city_id + ", .city-circle-right-" + d.abbr + d.city_id + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()

            gCity
              .append("text")
              .text(function() {
                return formatPercent(d.city_k12)
              })
              .attr("y", function(){ 
                return d3.select(".city-circle-left-" + d.abbr + d.city_id ).attr("cy")
              })
              .attr("x", 1)
              .attr("class", function() {
                return "data-label highlight data-label-city-left-" + d.abbr 
              })
            gCity
              .append("text")
              .text(function() {
                return formatPercent(d.city_teacher)
              })
              .attr("y", function(){ 
                return d3.select(".city-circle-right-" + d.abbr + d.city_id ).attr("cy")
              })
              .attr("x", width - margin.right + 8)
              .attr("class", function() {
                return "data-label highlight data-label-city-right-" + d.abbr 
              })            
            gState
              .append("text")
              .text(function() {
                return formatPercent(d.state_k12)
              })
              .attr("y", function(){ 
                return d3.select(".state-circle-left-" + d.abbr ).attr("cy")
              })
              .attr("x", 1)
              .attr("class", function() {
                return "data-label highlight data-label-state-left-" + d.abbr 
              })
            gState
              .append("text")
              .text(function() {
                return formatPercent(d.state_teacher)
              })
              .attr("y", function(){ 
                return d3.select(".state-circle-right-" + d.abbr ).attr("cy")
              })
              .attr("x", width - margin.right + 8)
              .attr("class", function() {
                return "data-label highlight data-label-state-right-" + d.abbr 
              })
          }else { //IF HOVERING OVER STATE 
            console.log('hi')
            d3.selectAll(".state-line-" + d.abbr + ", .city-line-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()
            d3.selectAll(".city-circle-left-" + d.abbr + ", .city-circle-right-" + d.abbr + ", .state-circle-left-" + d.abbr + ", .state-circle-right-" + d.abbr)
              .classed("highlight", true)
              .moveToFront()
            //IF MULTIPLE CITIES
            if (d3.selectAll(".city-line.highlight").size() > 1) {
              d3.selectAll(".city-line.highlight").each(function(d) { console.log(d)
                gCity
                  .append("text")
                  .text(function() {
                    return formatPercent(d.city_k12)
                  })
                  .attr("y", function(){   
                    var circleY = d3.select(".city-circle-left-" + d.abbr + d.city_id ).attr("cy")
                    console.log(d3.select(this).attr("class"))
                    return (d3.select(".city-circle-left-" + d.abbr).size() == 0) ? 0 : circleY
                  })
                  .attr("x", 1)
                  .attr("class", function() {
                    return "data-label highlight data-label-city-left-" + d.abbr 
                  })                
              gCity
                  .append("text")
                  .text(function() {
                    return formatPercent(d.city_teacher)
                  })
                  .attr("y", function(){ 
                    var circleY = d3.select(".city-circle-right-" + d.abbr + d.city_id ).attr("cy")
                    console.log(d3.select(this).attr("class"))
                    return (d3.select(".city-circle-right-" + d.abbr).size() == 0) ? 0 : circleY
                  })
                  .attr("x", width - margin.right + 8)
                  .attr("class", function(d) {
                    return "data-label highlight data-label-city-right-" + d.abbr
                  })   
              })
            }else {
              gCity
                .append("text")
                .text(function() {
                  return (d3.select(".city-circle-left-" + d.abbr).size() == 0) ? "" : formatPercent(d.city_k12)
                })
                .attr("y", function(){ 
                  return (d3.select(".city-circle-left-" + d.abbr).size() == 0) ? 0 : d3.select(".city-circle-left-" + d.abbr ).attr("cy")
                })
                .attr("x", 1)
                .attr("class", function() {
                  return "data-label highlight data-label-city-left-" + d.abbr 
                })   
              gCity
                .append("text")
                .text(function() {
                  return (d3.select(".city-circle-left-" + d.abbr).size() == 0) ? "" : formatPercent(d.city_teacher)
                })
                .attr("y", function(){ 
                  return (d3.select(".city-circle-right-" + d.abbr).size() == 0) ? 0 : d3.select(".city-circle-right-" + d.abbr ).attr("cy")
                })
                .attr("x", width - margin.right + 8)
                .attr("class", function() {
                  return "data-label highlight data-label-city-right-" + d.abbr 
                })   
              gState
                .append("text")
                .text(function() {
                  return formatPercent(d.state_k12)
                })
                .attr("y", function(){ 
                  return d3.select(".state-circle-left-" + d.abbr ).attr("cy")
                })
                .attr("x", 1)
                .attr("class", function() {
                  return "data-label highlight data-label-state-left-" + d.abbr 
                })   
              gState
                .append("text")
                .text(function() {
                  return formatPercent(d.state_teacher)
                })
                .attr("y", function(){ 
                  return d3.select(".state-circle-right-" + d.abbr ).attr("cy")
                })
                .attr("x", width - margin.right + 8)
                .attr("class", function() {
                  return "data-label highlight data-label-state-right-" + d.abbr 
                })               }
          }
          d3.select(".stateText")
            .text(function() { 
                return d.state
            })
            .attr("transform", function(d){
              var textWidth = (this.getBoundingClientRect().width)
              var graphWidth = d3.select("g.state-graph").attr("width") - margin.left - margin.right
              return "translate("+(margin.left + (graphWidth - textWidth)/2.2) +",15)"
            })

          d3.select(".cityText")
            .text(function() { 
              if (d3.selectAll(".city-line.highlight").size() > 1) { 
                return "multiple cities"
              }else{ 
                return (d.city=="") ? "No city data for this state" : d.city
              }
            })
            .attr("transform", function(d){
              var textWidth = (this.getBoundingClientRect().width)
              var graphWidth = d3.select("g.city-graph").attr("width") - margin.left - margin.right
              return "translate("+(margin.left + (graphWidth - textWidth)/2.2) +",15)"
            })
            .classed("no-city", function() {
              return (d.city== "") ? true: false
            })
        }
      }

      d3.selection.prototype.moveToFront = function() {  
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
        if (raceOn.length > 0){
          for (i=0; i<raceOn.length; i++){ // filter data by races that are turned on
            newData = all_data.filter(function(d){ 
              return d[raceOn[i]] == 1;
            })
            all_data = newData
          }  
          updateDataOff(newData)
        }else { console.log('remove')
          updateDataOff(all_data)
        }
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
        console.log(dataState)
        var selectedCityLine = (d3.select(".city-line.selected").size() > 0) ? d3.select(".city-line.selected").datum() : ""
        var selectedStateLine = (d3.select(".city-line.selected").size() > 0) ? d3.select(".state-line.selected").datum() : ""
        var optionsCity = d3.select("#city-select")
          .selectAll('option:not(.dropdown-default)')
          .data(dataCity, function(d) { 
            return d.city
          })
        var optionsState = d3.select("#state-select")
          .selectAll('option:not(.dropdown-default)')
          .data(dataState, function(d) {
            return d.state
          })

        var city = "CITIES"
        var state = "STATES"
        var cityLines = gCity.selectAll(".city-line")
          .data(dataCity)
        var stateLines = gState.selectAll(".state-line")
          .data(dataState)
        // changeDropdown(city, state)

          var city = "city"
          var line = "line"
        //TRANSITION CITY LINES
          moveLines(cityLines, city, line, selectedCityLine.city, selectedCityLine)
        //TRANSITION STATE LINES  
          var state = "state"
          var line = "line"
          var circle = "circle"
          moveLines(stateLines, state, line, selectedStateLine.state, selectedStateLine)

          //TRANSITION CITY CIRCLES
          var cityCirclesLeft = gCity.selectAll(".city-circle-left")
            .data(dataCity)
          var left = "left"
          moveCircles(cityCirclesLeft, city, circle, left, selectedCityLine)
          console.log(dataCity)
          var cityCirclesRight = gCity.selectAll(".city-circle-right")
            .data(dataCity)
          var right = "right"
          moveCircles(cityCirclesRight, city, circle, right, selectedCityLine)

          var stateCirclesLeft = gState.selectAll(".state-circle-left")
            .data(dataState)
          moveCircles(stateCirclesLeft, state, circle, left, selectedStateLine)

          var stateCirclesRight = gState.selectAll(".state-circle-right")
            .data(dataState)
           moveCircles(stateCirclesRight, state, circle, right, selectedStateLine)
          modifyDropdownOptions(optionsCity, optionsState, selectedCityLine.city, selectedStateLine.state)
      

        function moveCircles(elements, geography, elementType, elementSide, selectedCircle) {
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
                if (d.city == selectedCircle.city){
                  return (elementSide == "left") ? "circle selected city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle selected city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
                }else {
                  return (elementSide == "left") ? "circle city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
                }
              }else {
                if (d.state == selectedCircle.state) {
                  return (elementSide == "left") ? "circle selected state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle selected state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
                }else {
                  return (elementSide == "left") ? "circle state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
                }
              }
            })
          elements.enter().append(elementType)
            .attr("class", function(d) { 
              if (geography == "city") {
                if (d.city == selectedCircle.city){
                  return (elementSide == "left") ? "circle selected city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle selected city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
                }else {
                  return (elementSide == "left") ? "circle city-circle-left city-circle-left-" + d.abbr + " city-circle-left-" + d.abbr + d.city_id : "circle city-circle-right city-circle-right-" + d.abbr + " city-circle-right-" + d.abbr + d.city_id
                }
              }else {
                if (d.state == selectedCircle.state) {
                  return (elementSide == "left") ? "circle selected state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle selected state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
                }else {
                  return (elementSide == "left") ? "circle state-circle-left state-circle-left-" + d.abbr + " state-circle-left-" + d.abbr + d.city_id : "circle state-circle-right state-circle-right-" + d.abbr + " state-circle-right-" + d.abbr + d.city_id
                }
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
            .on('end', function(){ console.log(d3.selectAll(".data-label").size())
              if (d3.selectAll(".data-label").size() > 0 && d3.select(".state-line.selected").size() > 0) { 
              var selectedData = d3.select(".state-line.selected").datum()
                moveLabels(gCity, selectedData, city, left)
                moveLabels(gCity, selectedData, city, right)
                moveLabels(gState, selectedData, state, left)
                moveLabels(gState, selectedData, state, right)
              }
            })
          elements
            .exit()
            .transition()
            .style("opacity", 0)
            .remove()
            console.log(elements)


        }
        function moveLabels(element, d, geography, side) { console.log(element.select(".data-label.selected" + ".data-label-" + geography + "-" + side).size())
          element.select(".data-label.selected" + ".data-label-" + geography + "-" + side + "-" + d.abbr)
            .attr("y", function(){ 
              return d3.select("." + geography + "-circle-" + side + "-" + d.abbr ).attr("cy")
            })
        }
        function moveLines(elements, geography, elementType, selectedDropdown, selectedLine) {
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
                if (d.city == selectedLine.city){
                  return "city-line selected city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
                }else {
                  return "city-line city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
                }
              }else{
                if (elements == stateLines) {
                  if (d.state == selectedLine.state) {
                    return "state-line selected state-line-" + d.abbr
                  }else {
                    return "state-line state-line-" + d.abbr
                  }
                }
              }
            })
          elements.enter().append(elementType)
            .attr("class", function(d) {
              if (elements == cityLines) {
                if (d.city == selectedLine.city){
                  return "city-line selected city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
                }else {
                  return "city-line city-line-" + d.abbr + " city-line-" + d.abbr + d.city_id
                }
              }else{
                if (elements == stateLines) {
                  if (d.state == selectedLine.state) {
                    return "state-line selected state-line-" + d.abbr
                  }else {
                    return "state-line state-line-" + d.abbr
                  }
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
            .on('end', function() {
              d3.selectAll(".city-line.selected, .state-line.selected")
                .moveToFront()
              d3.selectAll(".circle.selected")
                .moveToFront()
            })
          elements
            .exit()
            .transition()
            .style("opacity", 0)
            .remove()
            .on('end', removeLineInfo)
        }
      d3.selectAll(".city-line, .state-line")
        .on("mouseover", showLineInfo)
        .on("mouseout", removeLineInfo)
        .on('click', function(d) { 
          showLineInfo(d, "click")
        })


    }


    });
}
var pymChild = new pym.Child({ renderCallback: drawGraphic, polling: 500 });

