var dataCategory = document.getElementById('chart').className
var units = "of students";
var steps = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["Bachelor's", "Teaching Degree", "Teacher"]
var numberSteps = (dataCategory == 'all') ? 5 : 3
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = (dataCategory == 'all') ? 710 - margin.left - margin.right : 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var numberFormat = d3.format(",");
var numberShortFormat = d3.format(".2s");
var percentFormat = d3.format(".2%");
var FIRSTNODE= ["White-All", "Black-All", "Hispanic-All", "Asian-All"];
var HEADERS2= ["White", "Black", "Hispanic", "Asian"],
    HEADERS1= ["SOURCE", "TARGET"],
    nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["-Bach", "-Teaching", "-Teacher"],
    numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
    rectBreaksX = (dataCategory == 'all') ? [width*.75, width*.6, width*.42, width*.22] :  [width*.53, width*.22, 0, 1000000],
    
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

var linkTextFormat = function(d) { 
  var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
  if (category == "percent") {
    return percentFormat(d) 
  }else {
    return numberShortFormat(d)
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
   // return (dataCategory == 'all') ? width/1.8 : width/2
   return width/1.7
  })
  .attr("height", height/8 + margin.top)
  .append("text")
  .attr("x", width*.05)
  .attr("y", height*.05)
  .attr("class", "description")
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
    .attr("class", "main-svg")
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
  //ADD HIDDEN TEXT FOR TEACHER LINKS
  for (i=0; i<4; i++){
    d3.select(".node-" + HEADERS2[i] + "-Teacher")
      .append("text")
      .attr('class', function(d) { 
        return 'linkText linkText-' + d.name
      })
      .attr("x", function(d) { 
        return 0
    })
    .attr("y", function(d) { return -10 })
    // .attr("dy", function(d) {
    //     return ".45em"
    // })
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d){
      return percentFormat(d.value);
    })
    .attr("text-anchor", "start")
  }
  //ADD HIDDEN TEXT FOR OTHER LINKS
  var linktext = linkG.selectAll(".link")
    .data(graph_percent)
    .enter()
    .append("text")
    .attr('class', function(d) { 
      return 'linkText linkText-' + d.target.name
    })
    .attr("x", function(d) { 
      if (d.value == 1) {
        return d.source.x + (d.target.x - d.source.x) / 1; 
      }else{
      return d.source.x + (d.target.x - d.source.x) / 2; 
      }
    })
    .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y) / 2; })
    .attr("dy", function(d) {
      if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0) {
        return "1.2em"
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
      }else if ((d.target.name).search("Teacher") > 0){
       return ""
      }else{
        return percentFormat(d.value); 
      }
    })
    .attr("text-anchor", "start")

  linktext
    .call(getBB)
  function getBB(selection) {
    selection.each(function(d){
      d.bbox = this.getBBox();
    })
  }

  linkG.selectAll(".link")
    .data(graph_percent)
    .enter()
    .insert("rect",".linkText")
    .attr("width", function(d){
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
    .attr("class", function(d){
      return "linkTextRect linkTextRect-" + d.target.name
    })
    // .style("opacity", function(d){
    //   if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0){
    //     return .77
    //   }else {
    //     return 0
    //   }
    // });


          
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

  function showStats() { 
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0],
        format = (category == "numbers") ? numberFormat : percentFormat;
    d3.selectAll(".linkText")
      .classed("showText", false)
    d3.selectAll(".linkTextRect")
      .classed("setTransparent", false)
    d3.selectAll(".node, .link")
      .classed("highlight", false)
    for (i=0; i<=4; i++){
      if(i !== 4){
          
          //SHOW ALL STATS BY DEGREE TYPE
          if (event.clientX >= rectBreaksX[0] ){
              d3.selectAll(".label")
                .classed("highlight", false)
              d3.select(".label-Teacher")
                .classed("highlight", true)
              d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher")
                .classed("showText", true)
              highlightSelected("-Teacher", "-Bach.no-TD", "became a teacher")
              highlightSelected("-Teacher", "-Teaching", "became a teacher")

            // d3.selectAll(".node-" + HEADERS2[i] + "-Teacher, .link-" + HEADERS2[i]+ "-Bach.no-TD, .link-" + HEADERS2[i] + "-Teaching")
            //   .classed("hover", true)
            // var text = d3.select(".node-" + HEADERS2[i] + "-Teacher").datum().value
            // return format(text)

              // .attr("transform", function(d) {
              //   return "translate(" + width/2 + "," + 50*i+ ")";
              // });
          }else if (event.clientX > rectBreaksX[1]){
              d3.selectAll(".label")
                .classed("highlight", false)
              d3.select(".label-Teaching")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-Teaching")
                .classed("showText", true)
              d3.selectAll(".linkTextRect-" + HEADERS2[i] + "-Teaching")
                .classed("setTransparent", true)
              highlightSelected("-Teaching", "-Bach.TD", "received a Teaching Degree")
              statsSvg.text()
          }else if (event.clientX > rectBreaksX[2]){
              d3.selectAll(".label")
                .classed("highlight", false)
              d3.select(".label-Bach")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-Bach")
                .classed("showText", true)
              highlightSelected("-Bach", "-HS", "received a Bachelor's degree")

          }else if (event.clientX > rectBreaksX[3]){
              d3.selectAll(".label")
                .classed("highlight", false)
              d3.select(".label-HS")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-HS")
                .classed("showText", true)
               highlightSelected("-HS", "", "received a high school degree")

          }else if (event.clientX < rectBreaksX[3]) {
              d3.selectAll(".label")
                .classed("highlight", false)
              d3.select(".label")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i])
                .classed("showText", true)
              highlightSelected("")


              // d3.selectAll(".node-" + HEADERS2[i])
              //   .classed("hover", true)
                // var text = (d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i])  
                //   return text;
          }
        // })
      }
    }
  }

  function highlightSelected(node, link, degree) {
    var highlightClass = function(node, link, i) {
      if (typeof(link) == "undefined"){ 
        return ".node-" + HEADERS2[i] + node
      }else{
        return ".node-" + HEADERS2[i] + node + ", .link-" + HEADERS2[i] + link      }
    }
    var linkTextClass = function(node, i) {
      // if (typeof(link) == "undefined"){ 
      //   return null
      // }else{
        return ".linkText-" + HEADERS2[i] + node     
     // }
    }
    var description = function(degree, i) {
      if (typeof(degree) == "undefined"){
        return ""
      }else{
      return " of " + HEADERS2[i] + " students " + degree
      }
    }

    var chartHeight = $("#chart").height(),
        rectHeight = d3.select(".mouseoverRect").attr("height"),
        heightDiff = chartHeight - rectHeight,
        category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0],
        format = (category == "numbers") ? numberFormat : percentFormat,
        rectBreaksY = (category == 'percent') ? [rectHeight*.33, rectHeight*.55, rectHeight*.78] : [rectHeight*.59, rectHeight*.75, rectHeight*.93];
    if (event.clientY < (heightDiff + rectBreaksY[0])){
      d3.selectAll(highlightClass(node, link, 0))
        .classed("highlight", true)
      var text = (node == "") ? "" : d3.select(linkTextClass(node, 0)).text()
      statsSvg.text(text + description(degree, 0))
    }else if (event.clientY < (heightDiff + rectBreaksY[1])){
      d3.selectAll(highlightClass(node, link, 1))
        .classed("highlight", true)
      var text = (node == "") ? "" : d3.select(linkTextClass(node, 1)).text()
      statsSvg.text(text + description(degree, 1))
    } else if (event.clientY < (heightDiff + rectBreaksY[2])){
      d3.selectAll(highlightClass(node, link, 2))
        .classed("highlight", true)
      var text = (node == "") ? "" : d3.select(linkTextClass(node, 2)).text()
      statsSvg.text(text + description(degree, 2))
    }else{ 
      d3.selectAll(highlightClass(node, link, 3))
        .classed("highlight", true)
      var text = (node == "") ? "" : d3.select(linkTextClass(node, 3)).text()
      statsSvg.text(text + description(degree, 3))
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
    // d3.selectAll(".stats-text")
    //   .each(function(d,i) {
    //     d3.select(this)
    //       .text((d3.selectAll(".toggle_button.active").attr("id")== "percent_button") ? "100%" : numberFormat(numberStats[i]))
    //   })  
    // d3.select(".description")
    // .text(function() {
    //   return (dataCategory == 'all') ? "All Students" : "Bachelor's Degree"
    // })
    sankey
      .nodes(nodeData)
      .links(linkData)
      .layout(32);

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
    linkG.selectAll(".linkText")
      .data(linkData)
      .transition()
      .duration(1300)
       .attr("x", function(d) { 
          if (FIRSTNODE.indexOf(d.source.name) > -1) { console.log(d.source.x + (d.target.x - d.source.x))
            return width*.19
          }else{
          return d.source.x + (d.target.x - d.source.x) / 2; 
          }
        })
      .attr("y", function(d) { return d.source.y + (d.target.y - d.source.y) / 4; })
      .attr("dy", function(d) {
        if ((d.target.name).search("Teacher") > 0 || (d.target.name).search("Teaching") > 0) {
          return "1.2em"
        }else if ((d.target.name).search("Bach") > 0){
         return "3em"
        }else{
         return "2em"
        }
      })
      .text(function(d) { 
        if (d.value == 1) {
          return "100%"
        }else if ((d.target.name).search("Teacher") > 0){
         return ""
        }else{
          return linkTextFormat(d.value); 
        }
      })
    linktext
      .call(getBB)

    linkG.selectAll(".linkTextRect")
      .data(linkData)
      .transition()
      .duration(1300)
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
    for (i=0; i<4; i++){
      d3.select(".node-" + HEADERS2[i] + "-Teacher .linkText")
      //   .attr("x", function(d) { 
      //     return 0
      // })
      // .attr("y", function(d) { return -10 })
      // .attr("dy", function(d) {
      //     return ".45em"
      // })
      .text(function(d){
        return linkTextFormat(d.value);
      })
    }
  };
});
 
