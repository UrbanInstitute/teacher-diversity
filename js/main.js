var dataCategory = document.getElementById('chart').className
var units = "of students";
var steps = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["Bachelor's", "Teaching Degree", "Teacher"]
var numberSteps = (dataCategory == 'all') ? 5 : 3
var margin = {top: 30, right: 10, bottom: 30, left: 10},
    width = (dataCategory == 'all') ? 770 - margin.left - margin.right : 900 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;
var numberFormat = d3.format(",");
var numberShortFormat = d3.format(".3s");
var percentFormat = d3.format(".1%");
var HEADERS2= ["White", "Black", "Hispanic", "Asian"],
    HEADERS1= ["SOURCE", "TARGET"],
    xLabelTranslate = (dataCategory == 'all') ? [width/5, width/5, width/5.1, width/5.4, width/5.1]: [0, width/6, width/4.3, width/3.7, width/2] ,
    xLabelsRect = (dataCategory == 'all') ? [85, 85, 75, 112, 60,] : [0, 76, 112, 62, 0,]
    nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["-Bach", "-Teaching", "-Teacher"],
    numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
    teacherTextPercent = (dataCategory == 'all') ? ["This is comprised of 2.0% of students without and 2.5% with teaching degrees.", "This is comprised of 1.1% of students without and 0.7% with teaching degrees.", "This is comprised of 0.9% of students without and 0.6% with teaching degrees.", "This is comprised of 1.5% of students without and 0.5% with teaching degrees."] : ["This is comprised of 5.1% of students without and 6.3% with teaching degrees.", "This is comprised of 5.5% of students without and 3.5% with teaching degrees.", "This is comprised of 6.0% of students without and 4.1% with teaching degrees.", "This is comprised of 2.4% of students without and 0.8% with teaching degrees."] 
    teacherTextNumber = (dataCategory == 'all') ? ["This is comprised of 1,970,062 students without and 2,419,381 with teaching degrees.", "This is comprised of 247,003 students without and 156,966 with teaching degrees.", "This is comprised of 312,676 students without and 214,497 with teaching degrees.", "This is comprised of 168,835 students without and 57,722 with teaching degrees."] : ["This is comprised of 1,970,062 students without and 2,419,381 with teaching degrees.", "This is comprised of 247,003 students without and 156,966 with teaching degrees.", "This is comprised of 312,676 students without and 214,497 with teaching degrees.", "This is comprised of 168,835 students without and 57,722 with teaching degrees.", ] 
    teacherSubTextPercent1 = (dataCategory == 'all') ? ["2.5%", "0.7%", "0.6%", "0.5%"] : ["6.3%", "3.5%", "4.1%", "0.8%"], 
    teacherSubTextPercent2 = (dataCategory == 'all') ? ["2.0%", "1.1%", "0.9%", "1.5%"] : ["5.1%", "5.5%", "6.0%", "2.4%"], 
    teacherSubTextNumber1 = (dataCategory == 'all') ? ["2.42M", "157k", "215k", "57.7k"] : ["2.42M", "157k", "215k", "57.7k", ],
    teacherSubTextNumber2 = (dataCategory == 'all') ? ["1.97M", "247k", "313k", "169k"] : ["1.97M", "247k", "312k", "169k", ] 
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
        return "translate(" + -width*.1+ "," + margin.top/2 + ")"
      }else {
        return "translate(" + -width*.24+ "," + margin.top/2 + ")"

      }
    })


 // var defs = svg.append("defs");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(45)
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
      .attr("class", "node-rect")
      // .append("title")
      // .text(function(d) { 
      // return d.name + "\n" + format(d.value); })
      // .attr("class", "node-text");

// add in the title for the nodes
  var xPos = (dataCategory == 'all') ? 25 : -120;
  var xPos2 = (dataCategory == 'all') ? 40 : -100;

  //ADD Y-AXIS RACE LABELS
  node.append("text")
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", function(d) { 
        if (d.name == "Hispanic-All" || d.name == "Hispanic-Bach") {
          return "translate(" + (xPos) +",0)"
        }else{
        return "translate(" + (xPos2) +",0)"
        }
      })
      .text(function(d) { 
        var name = d.name.split("-")[0] 
        var type = d.name.split("-")[1]
        var typeName = (dataCategory == 'all') ? "All" : "Bach"
        if  (type == typeName) { 
          return name
        }else {
          return ""
        }
      })
      .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start")
      .attr("class", function(d) {
          return "raceLabels raceLabels-" + d.name.split(" ")[0] 
      })
  //ADD X-AXIS CATEGORY LABELS
  var nodeLabels = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["", "-Bach", "-Teaching", "-Teacher"],
      xLabels = (dataCategory == 'all') ? ["All Students", "High School", "Bachelor's", "Teaching Degree", "Teacher"] : ["", "Bachelor's", "Teaching Degree", "Teacher"],
      xLabelNumber = (dataCategory == 'all') ? 5 : 4;
  var labelG = svg.append("g") 
    .attr("class", "g-x-labels")
    .selectAll(".label-g")
    .data(nodeLabels)
    .enter()
    .append("g")
    .attr("class", "label-g")
    .attr("transform", function(d, i) {
      return "translate(" + (120 + (xLabelTranslate[i])*i)+ "," + height*1.07+ ")";
    })
  labelG
    .append("rect")
    .attr("x", -5)
    .attr("y", -18)
    .attr("width", function(d, i) {
      return xLabelsRect[i]
    })
    .attr("height", 25)
    // .attr("transform", function(d, i) {
    //   return "translate(" + (120 + (xLabelTranslate[i])*i)+ "," + height+ ")";
    // })
    .attr("class", function(d, i) {
      return "labelRect labelRect" + nodeLabels[i] 
    })
  labelG
    .append("text")
    .text(function(d, i) {
      return xLabels[i]
    })
    .attr("class", function(d,i){
      return "label label" + nodeLabels[i]
    })



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
        return d.target.x + 3
    })
    .attr("y", function(d) {
      return d.target.y + (d.target.dy/2) + 5
    //  return (dataCategory == "all") ? d.source.y + (d.source.dy/1.9) : d.source.y + (d.source.dy/1.8)
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


  // linkG.selectAll(".link")
  //   .data(graph_percent)
  //   .enter()
  //   .insert("rect",".linkText")
  //   .attr("width", function(d){
  //     return d.bbox.width
  //   })
  //   .attr("height", function(d){
  //     return d.bbox.height
  //   })
  //   .attr('x', function(d) { 
  //     return d.bbox.x
  //   })
  //   .attr('y', function(d) {
  //     return d.bbox.y
  //   })
  //   .style("fill", "#fff")
  //   .attr("class", function(d){
  //     return "linkTextRect linkTextRect-" + d.target.name
  //   })
   
          
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
    .on("mouseout", hideStats);

  //TEACHER STATS
  var teacherSubTextG = svg.append("g")
    .attr("class", "teacherSubTextG")
  for (i=0; i<4; i++){
    var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node()
    console.log(teacherNode.getBoundingClientRect().top)
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
    var teacherSubTextG1 = teacherSubTextG.append("g")
      .attr("class", "teacherSubG1-" + i)
      .attr("transform", function() {console.log()
        return "translate(" + teacherNode.getBoundingClientRect().left + "," + (teacherNode.getBoundingClientRect().top - 180)+ ")";
      })
    teacherSubTextG1
      .append("text")
      .text(function() {
        var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        return (category == 'percent') ? teacherSubTextPercent1[i] : teacherSubTextNumber1[i]
      })
      .attr("class", "teacherSubText teacherSubTextG1-" +i )
    var teacherSubTextG2 = teacherSubTextG.append("g")
      .attr("class", "teacherSubG2-" + i)
      .attr("transform", function() {console.log()
        return "translate(" + (teacherNode.getBoundingClientRect().left + 40) + "," + (teacherNode.getBoundingClientRect().top - 180)+ ")";
      })
    teacherSubTextG2
      .append("text")
      .text(function() {
        var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        return (category == 'percent') ? teacherSubTextPercent2[i] : teacherSubTextNumber2[i]
      })
      .attr("class", "teacherSubText teacherSubTextG2-" +i )
  }

  function hideStats() {
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
      // d3.selectAll(".linkTextRect")
      //   .classed("setTransparent", false)
      d3.selectAll(".node, .link, .teacherText, .labelRect, .linkText, .label, .raceLabels")
        .classed("highlight", false)
  }

  function getLine(x1, y1, x2, y2){
    var m = (y2-y1)/(x2-x1)
    var b = y2 - m*x2
    var line = function(x){
      return m*x + b;
    }
    return line;
  }

  function showStats() { 
    var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
        // format = (category == "numbers") ? numberFormat : percentFormat;
    d3.selectAll(".linkText")
      .classed("showText", false)
    // d3.selectAll(".linkTextRect")
    //   .classed("setTransparent", false)
    d3.selectAll(".node, .link, .teacherText, .label, .linkText, .raceLabels")
      .classed("highlight", false)
    d3.selectAll(".labelRect")
      .classed("highlight", false)
    var belowLine = false;
    for (i=0; i<=4; i++){
      if(i !== 4){
          var bach = d3.select(".node-" + HEADERS2[i] + "-Bach").node()
          var hs = d3.select(".node-" + HEADERS2[i] + "-HS").node()
          var teaching = d3.select(".node-" + HEADERS2[i] + "-Teaching").node()
          var all = d3.select(".node-" + HEADERS2[i] + " rect").node()
          var first = (dataCategory == "all") ? all : bach;
          var bottom = first.getBoundingClientRect().bottom;
          var top = first.getBoundingClientRect().top;
          var rectBreaksX = (dataCategory == 'all') ? [all.getBoundingClientRect().right, hs.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right] : [all.getBoundingClientRect().right, all.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right]
          var line = getLine(bach.getBoundingClientRect().right, bach.getBoundingClientRect().top, teaching.getBoundingClientRect().right, teaching.getBoundingClientRect().top)
          if(line(event.clientX) < event.clientY  && event.clientY <= bottom + 5 && event.clientY >= top -5){   
            belowLine = true;
          }
          //SHOW ALL STATS BY DEGREE TYPE
          if (event.clientX >= rectBreaksX[3] || ( !belowLine && event.clientX > rectBreaksX[2])){ 
              d3.selectAll(".labelRect-Teacher, .label-Teacher")
                .classed("highlight", true)
              d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher")
                .classed("showText", true)
              highlightSelected("-Teacher", "-Bach.no-TD", "became a teacher.")
              highlightSelected("-Teacher", "-Teaching", "became a teacher.")
          }else 
          if (event.clientX > rectBreaksX[2] && belowLine){
              d3.selectAll(".labelRect-Teaching, .label-Teaching")
                .classed("highlight", true)
              d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher")
                .classed("showText", false)
              d3.select(".linkText-" + HEADERS2[i] + "-Teaching")
                .classed("showText", true)
              // d3.selectAll(".linkTextRect-" + HEADERS2[i] + "-Teaching")
              //   .classed("setTransparent", true)
              highlightSelected("-Teaching", "-Bach.TD", "received a teaching degree.")
              
          }else if (event.clientX > rectBreaksX[1]){
              d3.selectAll(".labelRect-Bach, .label-Bach")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-Bach")
                .classed("showText", true)
              highlightSelected("-Bach", "-HS", "received a bachelor's degree.")

          }else if (event.clientX > rectBreaksX[0]){ 
              d3.selectAll(".labelRect-HS, .label-HS")
                .classed("highlight", true)
              d3.select(".linkText-" + HEADERS2[i] + "-HS")
                .classed("showText", true)
               highlightSelected("-HS", "", "received a high school degree.")

          }else if (event.clientX <= rectBreaksX[0] && event.clientX > all.getBoundingClientRect().left) {
              d3.select(".labelRect")
                .classed("highlight", true)
              d3.select(".label")
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
      return (category == 'percent') ? " of " + HEADERS2[i] + " students " + degree : " " + HEADERS2[i] + " students " + degree;
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

    if(node == "-Teaching"){
      d3.selectAll(".labelRect-Teacher")
        .classed("highlight", false)
      d3.selectAll(".label-Teacher")
        .classed("highlight", false)
      d3.selectAll(".node")
        .classed("highlight", false)
      d3.selectAll(".link")
        .classed("highlight", false)
    }
    var suffix = (dataCategory == "bachelor") ? "-Bach" : "";
    var type = (dataCategory == "all" ? "-All" : "-Bach")
    if (event.clientY < (d3.select(".node-" + HEADERS2[0] + suffix).node().getBoundingClientRect().bottom + 5) ){
      d3.selectAll(highlightClass(node, link, 0))
        .classed("highlight", true)
      d3.selectAll(".linkText-" + HEADERS2[0] + node + ", .raceLabels-" + HEADERS2[0] + type)
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[0] + node).datum().value
      statsSvg.text(format(text) + description(degree, 0))
      teacherText(node, 0)
    }else if (event.clientY < (d3.select(".node-" + HEADERS2[1] + suffix).node().getBoundingClientRect().bottom + 5)){
      d3.selectAll(highlightClass(node, link, 1))
        .classed("highlight", true)
      d3.selectAll(".linkText-" + HEADERS2[1] + node + ", .raceLabels-" + HEADERS2[1] + type)
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[1] + node).datum().value
      statsSvg.text(format(text) + description(degree, 1))
      teacherText(node, 1)
    }else if (event.clientY < (d3.select(".node-" + HEADERS2[2] + suffix).node().getBoundingClientRect().bottom + 5)){
      d3.selectAll(highlightClass(node, link, 2))
        .classed("highlight", true)
      d3.selectAll(".linkText-" + HEADERS2[2] + node + ", .raceLabels-" + HEADERS2[2] + type)
        .classed("highlight", true)
      var text  = d3.select(".node-" + HEADERS2[2] + node).datum().value
      statsSvg.text(format(text) + description(degree, 2))
      teacherText(node, 2)
    }else{ 
      d3.selectAll(highlightClass(node, link, 3))
        .classed("highlight", true)
      d3.selectAll(".linkText-" + HEADERS2[3] + node + ", .raceLabels-" + HEADERS2[3] + type)
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

    nodeG.selectAll(".node")
      .data(nodeData, function(d) { return d.name; })
      .transition()
      .duration(1300)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    svg.selectAll(".node-rect")
      .transition()
      .duration(1300)
      .attr("height", function(d) {
        return d.dy;
      })
      .on('end', function() {
        for (i=0; i<4; i++){
          var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node()
          var x = teacherNode.getBoundingClientRect().left;
          var y = teacherNode.getBoundingClientRect().top
          transitionTeacherText(x,y)
        }
      })

    node.selectAll(".raceLabels")
      .transition()
      .duration(1300)
      .attr("y", function(d) { return d.dy / 2; })

    linkG.selectAll(".linkText")
      .data(linkData)
      .attr("x", function(d) { 
          return d.target.x + 3;
      })
      .attr("y", function(d) {
        return d.target.y + (d.target.dy/2) + 5
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

  function transitionTeacherText(x, y) {
    teacherSubTextG.select(".teacherSubG1-" + i)
      .attr("transform", function() {
        return "translate(" + x + "," + (y - 180)+ ")";
      })
    teacherSubTextG.select(".teacherSubG2-" + i)
      .attr("transform", function() {console.log("x: " + x + " y: " + y)
        return "translate(" + (x + 40) + "," + (y - 180)+ ")";
      })
    teacherSubTextG.select("text.teacherSubTextG1-" + i)
      .text(function() {
        var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        console.log((category == 'percent') ? teacherSubTextPercent1[i] : teacherSubTextNumber1[i])
        return (category == 'percent') ? teacherSubTextPercent1[i] : teacherSubTextNumber1[i]
      })
    teacherSubTextG.select("text.teacherSubTextG2-" + i)
      .text(function() {
        var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        return (category == 'percent') ? teacherSubTextPercent2[i] : teacherSubTextNumber2[i]
      })  
    }
  function getBB(selection) { 
    selection.each(function(d){
      d.bbox = this.getBBox();
    })
  }
});
 
