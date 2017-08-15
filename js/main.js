var dataCategory = document.getElementById('chart').className
var units = "of students";
var steps = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["Bachelor's", "Teaching Degree", "Teacher"]
var numberSteps = (dataCategory == 'all') ? 5 : 3
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = (dataCategory == 'all') ? 710 - margin.left - margin.right : 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var numberFormat = d3.format(",");
var percentFormat = d3.format(".2%");
var HEADERS2= ["White", "Black", "Hispanic", "Asian"],
    HEADERS1= ["SOURCE", "TARGET"],
    nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["-Bach", "-Teaching", "-Teacher"],
    numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
    // color = d3.scale.ordinal()
    //   .domain([""])
  // (["#a2d4ec", "#46abdb", "#1696d2", " #12719e"])
     color = d3.scale.category20();

var format = function(d) { 
  var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
  if (category == "percent") {
    return percentFormat(d) + " of students"
  }else {
    return numberFormat(d) + " students"
  }
};

var headerFormat = function(d) { 
  var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
  if (category == "percent") {
    return percentFormat(d) 
  }else {
    return numberFormat(d)
  }
};
  // format = function(d) { return formatNumber(d) },


var descriptionSvg = d3.select("#source-div")
  .append("svg")
  .attr("width", function() {
    return (dataCategory == 'all') ? width/3 : width/3.2
  })
  .attr("height", height/12 + margin.top)
  .append("text")
  .attr("class", "description")
  .attr("x", function() {
    // if (container_width < 400) {
    //     return (.02*width);
    //  }
        return (.01*width);
  })
  .attr("y", function(){
    if (dataCategory == 'all') {
      return width*.07
    }else{
      return .063*width;
      }          
  })
  .text(function() { 
    if (dataCategory == 'all'){ 
      return 'All Students'
    }else {
      return 'Bachelor\'s Degree'
    }
  })

var statsSvg = d3.select("#stats-div")
  .append("svg")
  .attr("width", function() { 
    return (dataCategory == 'all') ? width/1.8 : width/2
  })
  .attr("height", height/8 + margin.top)
for (i=0; i<=4; i++){
  if(i !== 4){
    statsSvg.append("text")
      .attr("class", "stats-header")
      .attr("x", function() {
        // if (container_width < 400) {
        //     return (.25*width)*i;
        //  }
        if (dataCategory == 'all') {
          return (.15*width)*i
        }else{
          return (.12*width)*i;
          }
      })
      .attr("y", 20)
      .text(function(){ 
          return (HEADERS2[i])
      })
      // .attr("transform", function(d) { 
      //    // if (container_width < 400) {
      //    //  return "translate("+ width*.055 +", 0)"
      //    // }
      //     return "translate("+ width*.045 +", 0)"; 
      // })
    statsSvg.append("text")
      .attr("class", function() {
        return "stats-text " + "text" + i})
      .attr("x", function() {
        // if (container_width < 400) {
        //     return (.25*width)*i;
        //  }
        if (dataCategory == 'all') {
          return (.15*width)*i
        }else{
          return (.12*width)*i;
          }      
      })
      .attr("y", function() {
        // if (container_width < 400){
        //   return height*.08
        // } 
        if (dataCategory == 'all') {
          return width*.07
        }else{
          return .063*width;
          }        
        })
      .attr("transform", function(d) { 
        // if (container_width < 400) {
        //   return "translate("+width*.06+",0)";
        // }
        //  return "translate("+ 0 +", 0)"; 
      })
      .text("100%")
  }
}

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", function() {
      if (dataCategory == 'all') {
        return "translate(" + -50+ "," + margin.top + ")"
      }else {
        return "translate(" + -155+ "," + margin.top + ")"

      }
    })


 // var defs = svg.append("defs");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(10)
    .dataCategory(dataCategory)
    .size([width, height*.95]);
 
var path = sankey.link();
 
// load the data
d3.json("data/" + dataCategory + "-data.json", function(error, graph) {
    var nodeMap = {};
    graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });

    var graph_percent = graph.links.map(function(x) {
      x.id = x.source + " -> " + x.target;
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        id: x.id,
        value: x.value,
        position: x.position
      };
    });

    var graph_number = graph.links.map(function(x) {
      x.id = x.source + " -> " + x.target;
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        id: x.id,
        value: x.value2,
        position: x.position

      };
    });


  sankey
      .nodes(graph.nodes)
      .links(graph_percent)
      .layout(32);

//gradient help from: https://codepen.io/bencarmichael/pen/pJKgyr
// define utility functions
  // function getGradID(d) {
  //   return "linkGrad-" + d.source.name + "-" + d.target.name;
  // }

  // function nodeColor(d) {
  //   return d.color = color(d.name.replace(/ .*/, ""));
  // }

  // create gradients for the links

  // var grads = defs.selectAll("linearGradient")
  //   .data(graph_percent, getGradID);
  // grads.enter().append("linearGradient")
  //   .attr("id", getGradID)
  //   .attr("gradientUnits", "userSpaceOnUse");

  // function positionGrads() {
  //   grads.attr("x1", function(d) {
  //       return d.source.x;
  //     })
  //     .attr("y1", function(d) {
  //       return d.source.y;
  //     })
  //     .attr("x2", function(d) {
  //       return d.target.x;
  //     })
  //     .attr("y2", function(d) {
  //       return d.target.y;
  //     });
  // }
  // positionGrads();

  // grads.html("") //erase any existing <stop> elements on update
  // .append("stop")
  // .attr("offset", "0%")
  // .attr("stop-color", function(d) {
  //   return nodeColor((+d.source.x <= +d.target.x) ?
  //     d.source : d.target);
  // });

  // grads.append("stop")
  //   .attr("offset", "100%")
  //   .attr("stop-color", function(d) {
  //     return nodeColor((+d.source.x > +d.target.x) ?
  //       d.source : d.target)
  //   });
// add in the links
  var link = svg.append("g").selectAll(".link")
    .data(graph_percent, function(d) {return d.id})
    .enter().append("path")
    .attr("class", function(d) {
      if ((d.id).search("Teaching") > 0 && (d.id).search("Bach") > 0) {
        return "link" + " link-" + d.source.name + " TD"
      }else if ((d.id).search("Teacher") > 0 && (d.id).search("Bach") > 0) {
        return "link" + " link-" + d.source.name + " no-TD"
      }else{
      return "link" + " link-" + d.source.name;
      }
    })      
    .attr("d", path)
    // .style("stroke", function(d) {
    //   return "url(#" + getGradID(d) + ")";
    // })
    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
    .sort(function(a, b) {return b.dy - a.dy; })
    .on("mouseover", showStats)
    .on("mouseout", function() {
      d3.selectAll(".stats-text")
        .each(function(d,i) {
          d3.select(this)
            .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
        })
      d3.select(".description")
        .text(function() {
          return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
        })
      d3.selectAll(".node, .link")
        .classed("hover", false)
    });
  link.append("title")
    .text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value); })
    .attr("class", "link-text");

// add in the nodes
  var node = svg.append("g").selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", function(d) { 
      return "node " + "node-" + d.name; 
    })    
    // .style("fill", function(d) {
    //   return d.color = color(d.name.replace(/ .*/, ""));
    // })  
    .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; })
    // .call(d3.behavior.drag()
    // .origin(function(d) { return d; })
    // .on("dragstart", function() { 
    // this.parentNode.appendChild(this); })
    // .on("drag", dragmove))
    .on("mouseover", showStats)
    .on("mouseout", function(d) { 
      d3.selectAll(".stats-text")
        .each(function(d,i) {
          d3.select(this)
            .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
        })      
      d3.select(".description")
        .text(function() {
          return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
        })
      d3.selectAll(".node, .link")
        .classed("hover", false)
    });

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      // .style("fill", function(d) { 
      // return d.color = color(d.name.replace(/ .*/, "")); })
      // .style("stroke", function(d) { 
      // return d3.rgb(d.color).darker(2); })
      .append("title")
      .text(function(d) { 
      return d.name + "\n" + format(d.value); })
      .attr("class", "node-text");

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform","translate(" + (-width/6) +",0)")
      .text(function(d) { 
        if (d.name == "White" || d.name == "Black" || d.name == "Hispanic" || d.name == "Asian"){
          return d.name
        }else {
          return ""
        }
      })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  var xLabels = svg.append("g")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 50)
      .attr("class", "g-xLabel")

  for (i=0; i<=numberSteps; i++){
    if(i !== numberSteps){
      xLabels.append("text")
        .attr("class", "x-label")
        .attr("x", function() { 
          return (numberSteps > 3) ? (width/5 + (width/5.4)*i) : (width/3.5 + (width/3.1)*i)
        })
        .attr("y", height)
        .text(steps[i])
    }
  }

  var mouseoverRect = svg.append("g")
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "mouseoverRect")
  .style("opacity", "0")
  .on('mousemove', showStats2)
  .on("mouseout", function() {
    d3.selectAll(".stats-text")
      .each(function(d,i) {
        d3.select(this)
          .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
      })
    d3.select(".description")
      .text(function() {
        return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
      })
    d3.selectAll(".node, .link")
      .classed("hover", false)
  });

  function showStats2(d) {
    d3.select(".description")
      .text(function() {
        if (event.clientX >= 550 ) {
          return "Teacher"
        }else if (event.clientX > 420 ) {
          return "Teaching Degree"
        }else if (event.clientX > 290 ) {
          return "Bachelor's Degree"
        }else if (event.clientX > 150 ) {
          return "High School"
        }else {
          return "All students"
        }
      })
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
    var format = (category == "numbers") ? numberFormat : percentFormat;
    d3.selectAll(".node, .link")
      .classed("hover", false)
    for (i=0; i<=4; i++){
      if(i !== 4){
        d3.select(".text" + i)
          .text(function() {
          if (event.clientX >= 550 ){
            d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i] + "-Bach.no-TD, .link-" + HEADERS2[i] + "-Teaching")
              .classed("hover", true)
            var text = d3.select(".node-" + HEADERS2[i] + "-Teacher").datum().value
            return format(text)
          }else if (event.clientX > 420){
            d3.selectAll(".node-" + HEADERS2[i] + "-Teaching, .link-" + HEADERS2[i] + "-Bach.TD")
              .classed("hover", true)
            var text = d3.select(".node-" + HEADERS2[i] + "-Teaching").datum().targetLinks[0].value
              return format(text)
            // var text = d3.select(".node-" + HEADERS2[i] + "-Teaching").datum().targetLinks[0].value
            // return format(text)
          }else if (event.clientX > 290){
              d3.selectAll(".node-" + HEADERS2[i] + "-Bach, .link-" + HEADERS2[i] + "-HS")
                .classed("hover", true)
              var text = d3.select(".node-" + HEADERS2[i] + "-Bach").datum().targetLinks[0].value
              return format(text)
          }else if (event.clientX > 150){
              d3.selectAll(".node-" + HEADERS2[i] + "-HS, .link-" + HEADERS2[i])
                .classed("hover", true)
              var text = d3.select(".node-" + HEADERS2[i] + "-HS").datum().targetLinks[0].value
              return format(text)          
          }else if (event.clientX < 150) {
              d3.selectAll(".node-" + HEADERS2[i])
                .classed("hover", true)
                return "100%"        
              }
        })
      }
    }
  }

  function showStats(d) {
    d3.select(".description")
      .text(function() {
        var description = (typeof d.id != 'undefined') ? d.target.name : d.name
        if (description.search("Bach") > 0) {
          return "Bachelor's Degree"
        }else if (description.search("HS") > 0) {
          return "High School Degree"
        }else if (description.search("Teaching") > 0) {
          return "Teaching Degree"
        }else if (description.search("Teacher") > 0) {
          return "Teacher"
        }else {
          return "All Students"
        }
      })
    for (i=0; i<=4; i++){
      if(i !== 4){
        d3.select(".text" + i)
          .text(function() {
            var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
            var format = (category == "numbers") ? numberFormat : percentFormat;
            var description = (typeof d.id != 'undefined') ? d.target.name : d.name
            if (description.search("Bach") > 0) {
              d3.selectAll(".node-" + HEADERS2[i] + "-Bach, .link-" + HEADERS2[i] + "-HS")
                .classed("hover", true)
              var text = d3.select(".node-" + HEADERS2[i] + "-Bach").datum().targetLinks[0].value
              return format(text)
            }else if (description.search("HS") > 0){
              d3.selectAll(".node-" + HEADERS2[i] + "-HS, .link-" + HEADERS2[i])
                .classed("hover", true)
              var text = d3.select(".node-" + HEADERS2[i] + "-HS").datum().targetLinks[0].value
              return format(text)
            }else if (description.search("Teaching") > 0){
              d3.selectAll(".node-" + HEADERS2[i] + "-Teaching, .link-" + HEADERS2[i] + "-Bach.TD")
                .classed("hover", true)
              var text = d3.select(".node-" + HEADERS2[i] + "-Teaching").datum().targetLinks[0].value
              return format(text)
            }else if (description.search("Teacher") > 0){
              //IF HOVERING OVER TEACHING DEGREE --> TEACHER LINK
              if (typeof d.id != 'undefined' && d.source.name.search("Teaching") > 0) {
                d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i] + "-Teaching")
                  .classed("hover", true)
                var text = d3.select(".link-" + HEADERS2[i] + "-Teaching").datum().value
                return format(text)
              }//IF HOVERING OVER BACHELOR --> TEACHER LINK
              else if (typeof d.id != 'undefined' && d.source.name.search("Bach") > 0){
                d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i] + "-Bach.no-TD")
                  .classed("hover", true)
                var text = d3.select(".link-" + HEADERS2[i] + "-Bach.no-TD").datum().value
                return format(text)
              }else{
                d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i] + "-Bach.no-TD, .link-" + HEADERS2[i] + "-Teaching")
                  .classed("hover", true)
                var text = d3.select(".node-" + HEADERS2[i] + "-Teacher").datum().value
                return format(text)
              }
            }else {
              var text = d3.select(".node-" + HEADERS2[i]).datum().targetLinks[0].value
              d3.selectAll(".node-" + HEADERS2[i])
                .classed("hover", true)
              return format(text)
            }
          })
        }
      }
  }
// the function for moving the nodes
  // function dragmove(d) {
  //   d3.select(this).attr("transform", 
  //       "translate(" + (
  //            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
  //         ) + "," + (
  //                  d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
  //           ) + ")");
  //   sankey.relayout();
  //   link.attr("d", path);
  // }
  d3.selectAll(".toggle_button")
    .on("click", function(){
        // category = d3.select(".toggle_button.active").node().id.split("_")[0]
        // var end = this.id.split("_")[0]
        d3.selectAll(".toggle_button.active").classed("active",false)
        d3.select(this).classed("active",true)
        var category = this.id.split("_")[0]
        var linkData = (category == "numbers") ? graph_number : graph_percent;
        update(graph.nodes, linkData);
    })

  // d3.selectAll(".node")
  //   .each(function(d){
  //     var node = d3.select(this).attr("class").split(" ")[1]
  //         nodeRace = node.split("-")[1],
  //         nodeCategory = node.split("-")[2],
  //         category = (nodeCategory != undefined) ? "-" + nodeCategory : "",
  //         nodeClass = nodeRace + category,
  //         index = nodeNames.indexOf(category),
  //         previousIndex = (nodeNames[index-1] != undefined ? nodeNames[index-1] : ""),
  //         bachelorClass = nodeRace + "-Bach",
  //         previousNodeClass = nodeRace + previousIndex,
  //         previousNodeData = d3.select(".node-" + previousNodeClass).datum().value,
  //         bachelorNodeData = d3.select(".node-" + bachelorClass).datum().value,
  //         nodeData = (d3.select(".node-" + nodeClass).datum().value),
  //         nodeValue = nodeData/previousNodeData
  //         teacherNodeValue = nodeData/bachelorNodeData
  //         value = (d3.select(this).attr("class").search("Teacher") > 0) ? teacherNodeValue : nodeValue;
  //     d3.select(this)
  //       .style("fill", function(d) {
  //         if (value <= .25){
  //           return "#cfe8f3"
  //         }else if (value <= .5){
  //           return "#73bfe2"
  //         }else if (value <= .75){
  //           return "#1696d2"
  //         }else {
  //           return "#0a4c6a"
  //         }
  //       })    
  //     })

  
  function update(nodeData, linkData) {
    d3.selectAll(".stats-text")
      .each(function(d,i) {
        d3.select(this)
          .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
      })  
    d3.select(".description")
    .text(function() {
      return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
    })
    sankey
      .nodes(nodeData)
      .links(linkData)
      .layout(32);

    // sankey.relayout();
    // fontScale.domain(d3.extent(nodeData, function(d) { return d.value }));
    svg.selectAll(".link")
      .data(linkData, function(x) { return x.id })
      .sort(function(a, b) { 
        return b.dy - a.dy;
      })
      .transition()
      .duration(1300)
      .attr("d", path)
      .style("stroke-width", function(d) {
        return Math.max(1, d.dy) + "px";
      });

    svg.selectAll(".node")
      .data(nodeData, function(d) { return d.name; })
      .transition()
      .duration(1300)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    svg.selectAll(".node rect")
      .transition()
      .duration(1300)
      .attr("height", function(d) {
        return d.dy;
      });
    node.selectAll(".node-text")
      .text(function(d) { 
        return d.name + "\n" + format(d.value); })
    link.selectAll(".link-text")
      .data(linkData, function(x) { return x.id})
      .text(function(d) { 
        return d.source.name + " → " + d.target.name + "\n" + format(d.value); 
      })
  };
});
 
