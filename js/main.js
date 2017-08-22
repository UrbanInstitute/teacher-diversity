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
    rectBreaks = (dataCategory == 'all') ? [width*.75, width*.6, width*.42, width*.22] :  [width*.53, width*.22, 0, 1000000]
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


// var descriptionSvg = d3.select("#source-div")
//   .append("svg")
//   .attr("width", function() {
//     return (dataCategory == 'all') ? width/3 : width/3.2
//   })
//   .attr("height", height/12 + margin.top)
//   .append("text")
//   .attr("class", "description")
//   .attr("x", function() {
//     // if (container_width < 400) {
//     //     return (.02*width);
//     //  }
//         return (.01*width);
//   })
//   .attr("y", function(){
//     if (dataCategory == 'all') {
//       return width*.07
//     }else{
//       return .063*width;
//       }          
//   })
  // .text(function() { 
  //   if (dataCategory == 'all'){ 
  //     return 'All Students'
  //   }else {
  //     return 'Bachelor\'s Degree'
  //   }
  // })

var statsSvg = d3.select("#stats-div")
  .append("svg")
  .attr("width", function() { 
    return (dataCategory == 'all') ? width/1.8 : width/2
  })
  .attr("height", height/8 + margin.top)
// for (i=0; i<=4; i++){
//   if(i !== 4){
//     statsSvg.append("text")
//       .attr("class", "stats-header")
//       .attr("x", function() {
//         // if (container_width < 400) {
//         //     return (.25*width)*i;
//         //  }
//         if (dataCategory == 'all') {
//           return (.15*width)*i
//         }else{
//           return (.12*width)*i;
//           }
//       })
//       .attr("y", 20)
//       .text(function(){ 
//           return (HEADERS2[i])
//       })

//     statsSvg.append("text")
//       .attr("class", function() {
//         return "stats-text " + "text" + i})
//       .attr("x", function() {
//         // if (container_width < 400) {
//         //     return (.25*width)*i;
//         //  }
//         if (dataCategory == 'all') {
//           return (.15*width)*i
//         }else{
//           return (.12*width)*i;
//           }      
//       })
//       .attr("y", function() {
//         // if (container_width < 400){
//         //   return height*.08
//         // } 
//         if (dataCategory == 'all') {
//           return width*.07
//         }else{
//           return .063*width;
//           }        
//         })
//      // .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
//   }
// }

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

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .append("title")
      .text(function(d) { 
      return d.name + "\n" + format(d.value); })
      .attr("class", "node-text");

// add in the title for the nodes
  var xPos = (dataCategory == 'all') ? -width/6 : width/6.3;
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform","translate(" + (xPos) +",0)")
      .text(function(d) { 
        var name = d.name.split(" ")[0] 
        if (name == "White" || name == "Black" || name == "Hispanic" || name == "Asian") {
          return name
        }else {
          return ""
        }
      })
      .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start")


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
    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
    .sort(function(a, b) {return b.dy - a.dy; })

  link.append("title")
    .text(function(d) {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value); })
    .attr("class", "link-text");

  var linkG = svg.append("g")
    .attr("class", "g-text")
  var linktext = linkG.selectAll(".link")
    .data(graph_percent)
    .enter()
    .append("text").attr('class','linkText')
    //.attr("x", 25)
    //.attr("y", function(d) { console.log(d); return d.dy / 2; })
    .attr("x", function(d) { 
      if (d.value == 1) {
        return d.source.x + (d.target.x - d.source.x) / 1; 
      }else{
      return d.source.x + (d.target.x - d.source.x) / 2; 
      }
    })
    .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y) / 4; })
    .attr("dy", function(d) {
      if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0) {
        return ".45em"
      }else if ((d.target.name).search("Bach") > 0){
       return "3em"
      }else{
       return "4.3em"
      }
    })
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) { 
      if (d.value == 1) {
        return "100%"
      }else {
        return percentFormat(d.value); 
      }
    })
    .attr("text-anchor", "start")
    .style('fill','#094c6a')
  linktext
    .call(getBB)
  function getBB(selection) {
    selection.each(function(d){
      d.bbox = this.getBBox();
      console.log(d.bbox)
    })
  }

  linkG.selectAll(".link")
    .data(graph_percent)
    .enter()
    .insert("rect",".linkText")
    .attr("width", function(d){
      console.log(d.bbox); 
      return d.bbox.width
    })
    .attr("height", function(d){
      return d.bbox.height
    })
    .attr('x', function(d) { 
      return d.bbox.x
    })
    .attr('y', function(d) {
      return d.bbox.y
    })
    .style("fill", "#fff")
    .style("opacity", function(d){
      if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0){
        return .77
      }else {
        return 0
      }
    });

    // linktext.insert("rect", "text")
    //   .attr("width", function(d){return d.bbox.width})
    //   .attr("height", function(d){return d.bbox.height})
    //   .style("fill", "yellow");
      // .data(graph_percent)
      // .enter()
      // .append("rect").attr('class','linkTextRect')
      // //.attr("x", 25)
      // //.attr("y", function(d) { console.log(d); return d.dy / 2; })
      // .attr("x", function(d) { 
      //   if (d.value == 1) {
      //     return d.source.x + (d.target.x - d.source.x) / 1; 
      //   }else{
      //   return d.source.x + (d.target.x - d.source.x) / 2; 
      //   }
      // })
      // .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y) / 4; })
      // .attr("width", "20px")
      // .attr("height", "20px")
      // .attr("dy", function(d) { console.log(d)
      //   if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0) {
      //     return ".45em"
      //   }else if ((d.target.name).search("Bach") > 0){
      //    return "3em"
      //   }else{
      //    return "4.3em"
      //   }
      // })
      // .style('fill','#fff')

          
  var xLabels = svg.append("g")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 50)
      .attr("class", "g-xLabel")

  // for (i=0; i<=numberSteps; i++){
  //   if(i !== numberSteps){
  //     xLabels.append("text")
  //       .attr("class", function(){
  //         return "x-label label" + nodeNames[i]
  //       })
  //       .attr("x", function() { 
  //         return (numberSteps > 3) ? (width/5 + (width/5.4)*i) : (width/3.5 + (width/3.1)*i)
  //       })
  //       .attr("y", height)
  //       .text(steps[i])
  //   }
  // }

  var mouseoverRect = svg.append("g")
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "mouseoverRect")
  .style("opacity", "0")
  .on('mousemove', showStats)
  .on("mouseout", function() {
    var Bach = (dataCategory == 'all') ? "" : "-Bach"
    d3.selectAll(".node, .link")
      .classed("hover", false)
    d3.selectAll(".stats-text")
      .each(function(d,i) {
        d3.select(this)
    //       .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
          .text("")
    //     d3.selectAll(".node-" + HEADERS2[i] + Bach)
    //       .classed("hover", true)
      })
    // d3.select(".description")
    // .text("")
      // .text(function() {
      //   return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
      // })
  });

  function showStats(d) { 
    d3.select(".label-Bach")
      .classed("highlight", true)
    // d3.select(".description")
    //   .text(function() {
    //     if (event.clientX >= rectBreaks[0] ) {
    //       return "Teacher"
    //     }else if (event.clientX > rectBreaks[1] ) {
    //       return "Teaching Degree"
    //     }else if (event.clientX > rectBreaks[2] ) {
    //       return "Bachelor's Degree"
    //     }else if (event.clientX > rectBreaks[3] ) {
    //       return "High School"
    //     }else {
    //       return "All students"
    //     }
    //   })
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
    var format = (category == "numbers") ? numberFormat : percentFormat;
    d3.selectAll(".node, .link")
      .classed("hover", false)
    for (i=0; i<=4; i++){
      if(i !== 4){
        // d3.select(".text" + i)
        //   .text(function() {
          if (event.clientX >= rectBreaks[0] ){
            // d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i]+ "-Bach.no-TD, .link-" + HEADERS2[i] + "-Teaching")
            //   .classed("hover", true)
            // var text = d3.select(".node-" + HEADERS2[i] + "-Teacher").datum().value
            // return format(text)

              // .attr("transform", function(d) {
              //   return "translate(" + width/2 + "," + 50*i+ ")";
              // });
          }else if (event.clientX > rectBreaks[1]){
            // d3.selectAll(".node-" + HEADERS2[i] + "-Teaching, .link-" + HEADERS2[i] + "-Bach.TD")
            //   .classed("hover", true)
            // var text = d3.select(".node-" + HEADERS2[i] + "-Teaching").datum().targetLinks[0].value
            //   return format(text)

              // .attr("transform", function(d) {
              //   return "translate(" + width/2 + "," + 50*i+ ")";
              // });
          }else if (event.clientX > rectBreaks[2]){
              // d3.selectAll(".node-" + HEADERS2[i] + "-Bach, .link-" + HEADERS2[i] + "-HS")
              //   .classed("hover", true)
              // var text = d3.select(".node-" + HEADERS2[i] + "-Bach").datum().targetLinks[0].value
              // return format(text)

          }else if (event.clientX > rectBreaks[3]){
              // d3.selectAll(".node-" + HEADERS2[i] + "-HS, .link-" + HEADERS2[i])
              //   .classed("hover", true)
              // var text = d3.select(".node-" + HEADERS2[i] + "-HS").datum().targetLinks[0].value
              // return format(text)  

          }else if (event.clientX < rectBreaks[3]) {
              // d3.selectAll(".node-" + HEADERS2[i])
              //   .classed("hover", true)
                // var text = (d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i])  
                //   return text;
          }
        // })
      }
    }
  }

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

  
  function update(nodeData, linkData) {
    d3.selectAll(".stats-text")
      .each(function(d,i) {
        d3.select(this)
          .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
      })  
    // d3.select(".description")
    // .text(function() {
    //   return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
    // })
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
 
