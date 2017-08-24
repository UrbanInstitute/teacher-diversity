var dataCategory = document.getElementById('chart').className
var units = "of students";
var steps = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["Bachelor's", "Teaching Degree", "Teacher"]
var numberSteps = (dataCategory == 'all') ? 5 : 3
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = (dataCategory == 'all') ? 770 - margin.left - margin.right : 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var numberFormat = d3.format(",");
var numberShortFormat = d3.format(".3s");
var percentFormat = d3.format(".2%");
var FIRSTNODE= (dataCategory == 'all') ? ["White-All", "Black-All", "Hispanic-All", "Asian-All"] : ["White diploma", "Black diploma", "Hispanic diploma", "Asian diploma"];
var HEADERS2= ["White", "Black", "Hispanic", "Asian"],
    HEADERS1= ["SOURCE", "TARGET"],
    nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["-Bach", "-Teaching", "-Teacher"],
    numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
    rectBreaksX = (dataCategory == 'all') ? [width*.75, width*.6, width*.42, width*.22] :  [width*.53, width*.22, 0, 1000000],
    teacherTextPercent = (dataCategory == 'all') ? ["This is comprised of 2.01% of students without and 2.47% with teaching degrees.", "This is comprised of 1.11% of students without and 0.71% with teaching degrees.", "This is comprised of 0.90% of students without and 0.61% with teaching degrees.", "This is comprised of 1.54% of students without and 0.53% with teaching degrees."] : ["This is comprised of 5.1% of students without and 6.26% with teaching degrees.", "This is comprised of 5.47% of students without and 3.48% with teaching degrees.", "This is comprised of 5.96% of students without and 4.09% with teaching degrees.", "This is comprised of 2.42% of students without and 0.83% with teaching degrees."] 
    teacherTextNumber = (dataCategory == 'all') ? ["This is comprised of 1,970,062 students without and 2,419,381 with teaching degrees.", "This is comprised of 247,003 students without and 156,966 with teaching degrees.", "This is comprised of 312,676 students without and 214,497 with teaching degrees.", "This is comprised of 168,835 students without and 57,722 with teaching degrees."] : ["This is comprised of 1,970,062 students without and 2,419,381 with teaching degrees.", "This is comprised of 247,003 students without and 156,966 with teaching degrees.", "This is comprised of 312,676 students without and 214,497 with teaching degrees.", "This is comprised of 168,835 students without and 57,722 with teaching degrees.", ] 
    // color = d3.scale.ordinal()
    //   .domain([""])
  // (["#a2d4ec", "#46abdb", "#1696d2", " #12719e"])
     color = d3.scale.category20();

var format = function(d) { 
  var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
  if (category == "percent") {
    if(d==1) {
      return "100%"
    }else{
      return percentFormat(d)
    }
  }else {
    return numberFormat(d)
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
function wrapText(text, width) { 
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

var statsSvg = d3.select("#stats-div")
  .append("svg")
  .attr("width", function() { 
   return (dataCategory == 'all') ? width/1.635 : width/2
   // return width/1.9
  })
  .attr("height", height/10)
  .append("text")
  .attr("x", 0)
  .attr("y", height*.05)
  .attr("class", "description")


// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "main-svg")
    .append("g")
    .attr("transform", function() {
      if (dataCategory == 'all') {
        return "translate(" + -width*.1+ "," + margin.top + ")"
      }else {
        return "translate(" + -width*.24+ "," + margin.top + ")"

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

  // link.append("title")
  //   .text(function(d) {
  //     return d.source.name + " → " + d.target.name + "\n" + format(d.value); })
  //   .attr("class", "link-text");



// add in the nodes
  var nodeG = svg.append("g")
    .attr("class", "g-node")
  var node = nodeG.selectAll(".node")
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
      // .append("title")
      // .text(function(d) { 
      // return d.name + "\n" + format(d.value); })
      // .attr("class", "node-text");

// add in the title for the nodes
  var xPos = (dataCategory == 'all') ? -width/8.5 : width/4.55;
  var xPos2 = (dataCategory == 'all') ? -width/7.2 : width/5.1;
  //ADD Y-AXIS RACE LABELS
  node.append("text")
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", function(d) {
        if (d.name == "Hispanic" || d.name == "Hispanic diploma") {
          return "translate(" + (xPos2) +",0)"
        }else{
        return "translate(" + (xPos) +",0)"
        }
      })
      .text(function(d) { 
        var name = d.name.split(" ")[0] 
        if  (HEADERS2.indexOf(name) > -1) {
          return name
        }else {
          return ""
        }
      })
      .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start")
      .attr("class", "raceLabels")
  //ADD X-AXIS CATEGORY LABELS
  var nodeLabels = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["", "-Bach", "-Teaching", "-Teacher"],
      xLabels = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["", "Bachelor's", "Teaching Degree", "Teacher"],
      xLabelNumber = (dataCategory == 'all') ? 5 : 4;
  for (i=0; i<xLabelNumber; i++){ 
    d3.select(".node-Asian" + nodeLabels[i])
      .append("text")
      .attr('class', function(d) { 
        return 'label label' + nodeLabels[i]
      })
      .attr("x", function(d) {
        if (nodeLabels[i] == "-Teaching"){
          return -width*.04
        }else{
          return -width * .015
        }
      })
      .attr("y", function(d) { return d.dy + 30 })
      // .attr("dy", function(d) {
      //     return ".45em"
      // })
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(){
        return xLabels[i]
      })
      .attr("text-anchor", "start")
      .call(getBB)
    d3.select(".node-Asian" + nodeLabels[i])
      .insert("rect",".label" + nodeLabels[i])
      .attr("width", function(d){
      return d.bbox.width + 10
      })
      .attr('x', function(d) { 
        return d.bbox.x - 5
      })
      .attr('y', function(d) {
        return d.bbox.y
      })
      .style("fill", "#fbbe15")
      .attr("class", function(d){
        return "labelRect labelRect" + nodeLabels[i] 
      })
  }
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
  var linktext = linkG.selectAll(".node")
    .data(graph_percent)
    .enter()
    .append("text")
    .attr('class', function(d) { 
      return 'linkText linkText-' + d.target.name
    })
    .attr("x", function(d) { 
      if (FIRSTNODE.indexOf(d.source.name) > -1){
        return d.target.x
      }else{
        return (dataCategory == "all") ? d.target.x - width*.1 :  d.target.x - width*.16
      }
    })
    .attr("y", function(d) {
      return (dataCategory == "all") ? d.source.y + (d.source.dy/1.9) : d.source.y + (d.source.dy/1.8)
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
   
          
  var xLabels = svg.append("g")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 50)
      .attr("class", "g-xLabel")


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
            .text("")
        })
      statsSvg
        .text("")
      d3.selectAll(".linkText")
        .classed("showText", false)
      d3.selectAll(".linkTextRect")
        .classed("setTransparent", false)
      d3.selectAll(".node, .link, .teacherText, .labelRect")
        .classed("highlight", false)
  });

    for (i=0; i<4; i++){
      var teacherTextSvg = d3.select("#stats-div svg").append("g")
        .attr("transform", function() {
          return "translate(" + 0 + "," + height*.085+ ")";
        })
        .attr("class", "teacherTextG")
      teacherTextSvg
        .append("text")
        .text(function() {
          var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
          return (category == 'percent') ? teacherTextPercent[i] : teacherTextNumber[i]
        })
        .attr("class", "teacherText teacherText-" +i )
    }


  function showStats() { 
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
        // format = (category == "numbers") ? numberFormat : percentFormat;
    d3.selectAll(".linkText")
      .classed("showText", false)
    d3.selectAll(".linkTextRect")
      .classed("setTransparent", false)
    d3.selectAll(".node, .link, .teacherText, .label")
      .classed("highlight", false)
    d3.selectAll(".labelRect")
      .classed("highlight", false)
    for (i=0; i<=4; i++){
      if(i !== 4){
          
          //SHOW ALL STATS BY DEGREE TYPE
          if (event.clientX >= rectBreaksX[0] ){
              d3.selectAll(".labelRect-Teacher")
                .classed("highlight", true)
              d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher")
                .classed("showText", true)
              highlightSelected("-Teacher", "-Bach.no-TD", "became a teacher.")
              highlightSelected("-Teacher", "-Teaching", "became a teacher.")
          }else if (event.clientX > rectBreaksX[1]){
              d3.select(".labelRect-Teaching")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-Teaching")
                .classed("showText", true)
              d3.selectAll(".linkTextRect-" + HEADERS2[i] + "-Teaching")
                .classed("setTransparent", true)
              highlightSelected("-Teaching", "-Bach.TD", "received a teaching degree.")
              
          }else if (event.clientX > rectBreaksX[2]){
              d3.select(".labelRect-Bach")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-Bach")
                .classed("showText", true)
              highlightSelected("-Bach", "-HS", "received a bachelor's degree.")

          }else if (event.clientX > rectBreaksX[3]){
              d3.select(".labelRect-HS")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-HS")
                .classed("showText", true)
               highlightSelected("-HS", "", "received a high school degree.")

          }else if (event.clientX < rectBreaksX[3]) {
              d3.select(".labelRect")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i])
                .classed("showText", true)
              highlightSelected("")
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
      var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
      if (typeof(degree) == "undefined"){
        return (category == 'percent') ? " of " + HEADERS2[i] + " students." : " " + HEADERS2[i] + " students.";
      }else{
      return " of " + HEADERS2[i] + " students " + degree
      }
    }
    var teacherText = function(node, i) {
      if (node == "-Teacher") {
        d3.select(".teacherText-" + i)
          .classed("highlight", true)
      }
    }
    var chartHeight = $("#chart").height(),
        rectHeight = d3.select(".mouseoverRect").attr("height"),
        heightDiff = chartHeight - rectHeight,
        category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0],
        // format = (category == "numbers") ? numberFormat : percentFormat,
        rectBreaksYAll = (category == 'percent') ? [rectHeight*.33, rectHeight*.55, rectHeight*.78] : [rectHeight*.59, rectHeight*.75, rectHeight*.93],
        rectBreaksYBach = (category == 'percent') ? [rectHeight*.33, rectHeight*.55, rectHeight*.78] : [rectHeight*.68, rectHeight*.78, rectHeight*.88],
        rectBreaksY = (dataCategory == 'all') ? rectBreaksYAll : rectBreaksYBach;

    if (event.clientY < (heightDiff + rectBreaksY[0])){
      d3.selectAll(highlightClass(node, link, 0))
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[0] + node).datum().value
      statsSvg.text(format(text) + description(degree, 0))
      teacherText(node, 0)
    }else if (event.clientY < (heightDiff + rectBreaksY[1])){
      d3.selectAll(highlightClass(node, link, 1))
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[1] + node).datum().value
      statsSvg.text(format(text) + description(degree, 1))
      teacherText(node, 1)
    }else if (event.clientY < (heightDiff + rectBreaksY[2])){
      d3.selectAll(highlightClass(node, link, 2))
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[2] + node).datum().value
      statsSvg.text(format(text) + description(degree, 2))
      teacherText(node, 2)
    }else{ 
      d3.selectAll(highlightClass(node, link, 3))
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[3] + node).datum().value
      // var text = d3.select(linkTextClass(node, 3)).text()
      statsSvg.text(format(text) + description(degree, 3))
      teacherText(node, 3)
    }
  }

  d3.selectAll(".toggle_button")
    .on("click", function(){
        var category = d3.select(".toggle_button.active").node().id.split("_")[0]
        d3.selectAll(".toggle_button.active").classed("active",false)
        d3.select(this).classed("active",true)
        var category = this.id.split("_")[0]
        var linkData = (category == "numbers") ? graph_number : graph_percent;
        update(graph.nodes, linkData);
    })

  
  function update(nodeData, linkData) {
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
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

    nodeG.selectAll("*:not(.label")
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
    node.selectAll(".raceLabels")
      .transition()
      .duration(1300)
      .attr("y", function(d) { return d.dy / 2; })
    for (i=0; i<xLabelNumber; i++){ 
      d3.select(".label" + nodeLabels[i])
        .attr("y", function(d) { return d.dy + 30 })
        // .attr("dy", function(d) {
        //     return ".45em"
        // })
        .call(getBB)
      d3.select("rect.labelRect" + nodeLabels[i])
        .attr("width", function(d){
        return d.bbox.width + 8
        })
        .attr('x', function(d) { 
          return d.bbox.x - 4
        })
        .attr('y', function(d) {
          return d.bbox.y
        })
    }

    linkG.selectAll(".linkText")
      .data(linkData)
      .attr("x", function(d) { 
        if (FIRSTNODE.indexOf(d.source.name) > -1){
          return d.target.x
        }else{
          return (dataCategory == "all") ? d.target.x - width*.1 :  d.target.x - width*.16
        }
      })
      .attr("y", function(d) {
        return (dataCategory == "all") ? d.source.y + (d.source.dy/1.9) : d.source.y + (d.source.dy/1.8)
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
     .call(getBB)


    linkG.selectAll(".linkTextRect")
      .data(linkData)
      .transition()
      .duration(1300)
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
    for (i=0; i<4; i++){
      d3.select(".node-" + HEADERS2[i] + "-Teacher .linkText")
        .text(function(d){
          return linkTextFormat(d.value);
        })
    }
    for (i=0; i<4; i++){
      d3.select(".teacherText-" + i)
        .text(function(d){
        var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        return (category == 'percent') ? teacherTextPercent[i] : teacherTextNumber[i]
      })
    }


  };
  function getBB(selection) { 
    selection.each(function(d){
      d.bbox = this.getBBox();
    })
  }
});
 
