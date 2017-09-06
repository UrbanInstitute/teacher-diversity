var container_width = parseFloat(d3.select("#chart").style("width"))
var numberFormat = d3.format(",");
var numberShortFormat = d3.format(".2s");
var percentFormat = d3.format(".1%");

function drawGraph(container_width, category) {
  var isMobile = (container_width <= 500) ? true : false;
  var isPhone = (container_width <= 400) ? true : false;
  var dataCategory = document.getElementById('chart').className
  var units = "of students";
  var steps = (dataCategory == 'all') ? ["25-to-34-year-olds", "High School Diploma", "Bachelor's Degree", "Teaching Degree", "Teacher"] : ["Bachelor's Degree", "Teaching Degree", "Teacher"]
  var numberSteps = (dataCategory == 'all') ? 5 : 3;
  var HEADERS2= ["white", "black", "Hispanic", "Asian"],
      HEADERS1= ["SOURCE", "TARGET"],
      xRectHeight = (dataCategory == 'all') ? [65, 65, 65, 65, 25,] : [0, 65, 65, 25, 0,]
      xLabelsRect = (dataCategory == 'all') ? [95, 85, 75, 70, 60,] : [0, 76, 70, 62, 0,],
      xLabelsRectMobile = (dataCategory == 'all') ? [65, 55, 75, 62, 60,] : [0, 76, 62, 62, 0,],
      nodeCategories = (dataCategory == 'all') ? ["", "-HS diploma", "-Bach", "-Teaching degree", "-Teacher"] : ["-Bach", "-Teaching degree", "-Teacher"],
      nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["-Bach", "-Teaching", "-Teacher"],
      numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
      teacherTextPercent = (dataCategory == 'all') ? ["2.3% of white adults receive teaching degrees and become teachers. 2.0% become teachers without earning a teaching degree.", "0.7% of black adults receive teaching degrees and become teachers. 1.1% become teachers without earning a teaching degree.", "0.6% of Hispanic adults receive teaching degrees and become teachers. 0.9% become teachers without earning a teaching degree.", "0.5% of Asian adults receive teaching degrees and become teachers. 1.6% become teachers without earning a teaching degree."] : ["5.8% of white college graduates receive teaching degrees and become teachers. 5.1% become teachers without earning a teaching degree.", "3.3% of black college graduates receive teaching degrees and become teachers. 5.3% become teachers without earning a teaching degree.", "4.0% of Hispanic college graduates receive teaching degrees and become teachers. 5.4% become teachers without earning a teaching degree.", "0.8% of Asian college graduates receive teaching degrees and become teachers. 2.5% become teachers without earning a teaching degree."] 
      teacherTextNumber = (dataCategory == 'all') ? ["580k white adults receive teaching degrees and become teachers. 505k become teachers without earning a teaching degree.", "40k black adults receive teaching degrees and become teachers. 64k become teachers without earning a teaching degree.", "57k Hispanic adults receive teaching degrees and become teachers. 78k become teachers without earning a teaching degree.", "15k of Asian adults receive teaching degrees and become teachers. 47k become teachers without earning a teaching degree."] : ["580k white adults receive teaching degrees and become teachers. 505k become teachers without earning a teaching degree.", "40k black adults receive teaching degrees and become teachers. 64k become teachers without earning a teaching degree.", "57k Hispanic adults receive teaching degrees and become teachers. 78k become teachers without earning a teaching degree.", "15k of Asian adults receive teaching degrees and become teachers. 47k become teachers without earning a teaching degree."]
      teacherSubTextPercentBottom = (dataCategory == 'all') ? ["2.3%", "0.7%", "0.6%", "0.5%"] : ["5.8%", "3.3%", "4.0%", "0.8%"], 
      teacherSubTextPercentTop = (dataCategory == 'all') ? ["2.0%", "1.1%", "0.9%", "1.6%"] : ["5.1%", "5.3%", "5.4%", "2.5%"], 
      teacherSubTextNumberBottom = (dataCategory == 'all') ? ["580k", "40k", "57k", "15k"] : ["580k", "40k", "57k", "15k"],
      teacherSubTextNumberTop = (dataCategory == 'all') ? ["505k", "64k", "78k", "47k"] : ["505k", "64k", "78k", "47k"],
      wrapWidthDescription = (isMobile) ? container_width*.99 : container_width*.65; 
      wrapWidth = (isMobile) ? 60 : 90

      // color = d3.scale.ordinal()
    //   .domain([""])
  // (["#a2d4ec", "#46abdb", "#1696d2", " #12719e"])
  d3.selectAll(".toggle_button").classed("active", false)
  d3.selectAll("#percent_button").classed("active",true)
  var nodeWidth = (function(){
        if (isPhone) {
          return 17
        }
        else if (isMobile) { 
          return 32
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return 45
        }
      })
      ();
  var nodePadding = 45;
  var margin = {top: 30, right: 10, bottom: 30, left: 10},
      width = (function(){
        if (isPhone) {
          return (dataCategory == 'all') ? container_width*1.2 : container_width*1.35
        } else if (isMobile) { 
          return (dataCategory == 'all') ? container_width*1.08 : container_width*1.25
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return (dataCategory == 'all') ? container_width*1.02 : container_width*1.23
        }
      })
      ();
  var aspect_width = 35,
      heightPhone = (dataCategory == 'all') ? 54 : 46,
      heightMobile = (dataCategory == 'all') ? 43 : 35,
      heightNormal = (dataCategory == 'all') ? 32 : 27,
      aspect_height = (function(){
        if (isPhone) {
          return heightPhone
        }
        else if (isMobile) { 
          return heightMobile
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return heightNormal
        }
      })
      ();

      //(container_width < 500) ? heightMobile : heightNormal,
      height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom
  var format = function(d) { 
    var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
    if (category == "percent") {
      if(d==1) {
        return "100%"
      }else{
        return percentFormat(d)
      }
    }else {
      return numberShortFormat(d)
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
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }
  $("#stats-div").empty()
  var statsSvg = d3.select("#stats-div")
    .append("svg")
    .attr("width", function() { 
      if (isMobile) {
        return container_width*.99
      }else {
        return container_width*.65
      }
     // return width/1.9
    })
    .attr("height", function() {
      return (isPhone) ? 0 : height/10})
    .append("text")
    .attr("x", 0)
    .attr("y", height*.035)
    .attr("class", "description")
    .style("opacity", function() {
      return (isPhone) ? 0 : 1;
    })

  // append the svg canvas to the page
  d3.select(".main-svg").remove()
  var svg = d3.select("#chart").append("svg")
      .attr("width", container_width)//width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "main-svg")
      .append("g")
      .attr("transform", function() {
        if (isPhone) {
          return (dataCategory == 'all') ? "translate("+ -width*.19 +"," + margin.top + ")" : "translate(" + -width*.31+ "," + margin.top + ")"
        }else if (isMobile) {
          return (dataCategory == 'all') ? "translate("+ -width*.03 +"," + margin.top + ")" : "translate(" + -width*.19+ "," + margin.top + ")"
        }else {
          return (dataCategory == 'all') ? "translate("+ -width*.07 +"," + margin.top + ")" : "translate(" + -width*.21+ "," + margin.top + ")"
        }

      })


   // var defs = svg.append("defs");

  // Set the sankey diagram properties
  var sankey = d3.sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
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
        return "translate(" + d.x + "," +  d.y + ")"; })

  // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .attr("class", "node-rect")

  // add in the title for the nodes
    var xPos = (dataCategory == 'all') ? width*.005 : -120
    var xPosMobile = (dataCategory == 'all') ? width*.025 : -100
    var xPos2 = (dataCategory == 'all') ? width*.033 : -100;
    var xPosMobile2 = (dataCategory == 'all') ? width*.055 : -100;

    //ADD Y-AXIS RACE LABELS

    //MOBILE
   var yLabelG = svg.append("g") 
        .attr("class", "g-y-labels")
  for (j=0; j<nodeCategories.length; j++){
    for (i=0; i<HEADERS2.length; i++){
    yLabelG.append("g") 
        .attr("class", "y-label")
        .data(graph_percent.filter(function(d) { 
          return (d.target.name) == HEADERS2[i] + nodeCategories[j]
          })
        )
        .append("text")
        .text(function(d) {
          if (d.target.name == HEADERS2[i] + "-Teacher") { console.log(d.source.name)
            return HEADERS2[i] + " " + percentFormat(d.target.value)
          }else { console.log(d.target.name)
            return HEADERS2[i] + " " + percentFormat(d.value)
          }
        })
        .attr("class", function(d) {
            return "linkTextMobile linkTextMobile-" + HEADERS2[i] + nodeCategories[j]
        })        
        .attr("x", 85)
        .attr("y", function(d) {
          var yPos = d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top
          console.log(yPos)
          return yPos
        })
        .attr("transform", "translate(0,"+ (-170) +")")
        // .style("opacity", 0)
    }
  }

    // node.append("text")

    //    .attr("y", function(d) { console.log(d)
    //       return -5; 
    //     })
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "end")
    //     .text(function(d) { 
    //       // var name = d.name.split("-")[0] 
    //       // var type = d.name.split("-")[1]
    //       // var typeName = (dataCategory == 'all') ? "All" : "Bach"
    //       // if  (type == typeName) { 
    //       //   return name
    //       // }else {
    //       //   return ""
    //       // }
    //     })
    //     .style("opacity", function() {
    //       return (isPhone) ? 1 : 0;
    //     })
    //     .filter(function(d) { return d.x < width / 2; })
    //     .attr("x", function(d) {
    //       if ((d.name).search("Hispanic") == 0) {
    //         if (isPhone) {
    //           return (dataCategory == 'all') ? 75 + sankey.nodeWidth() : sankey.nodeWidth() - 20
    //         } return (dataCategory == 'all') ? 15 + sankey.nodeWidth() : -75
    //       }else {
    //         if (isPhone) {
    //           return (dataCategory == 'all') ? 75 + sankey.nodeWidth() : sankey.nodeWidth() - 20
    //         } return (dataCategory == 'all') ? 35 + sankey.nodeWidth() : -55
    //       }
    //     })
    //     .attr("text-anchor", "start")
    //     .attr("class", function(d) {
    //         return "linkTextMobile linkTextMobile-" + d.name.split(" ")[0] 
    //     })
    node.append("text")
        .attr("y", function(d) { 
          return d.dy / 2; 
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
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
        .style("opacity", function() {
          return (isPhone) ? 0 : 1;
        })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", function(d) {
          if ((d.name).search("Hispanic") == 0) {
            if (isPhone) {
              return (dataCategory == 'all') ? 75 + sankey.nodeWidth() : sankey.nodeWidth() - 20
            } return (dataCategory == 'all') ? 15 + sankey.nodeWidth() : -75
          }else {
            if (isPhone) {
              return (dataCategory == 'all') ? 75 + sankey.nodeWidth() : sankey.nodeWidth() - 20
            } return (dataCategory == 'all') ? 35 + sankey.nodeWidth() : -55
          }
        })
        .attr("text-anchor", "start")
        .attr("class", function(d) {
            return "raceLabels raceLabels-" + d.name.split(" ")[0] 
        })
    //ADD X-AXIS CATEGORY LABELS
    var nodeLabels = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["", "-Bach", "-Teaching", "-Teacher"],
        xLabels = (dataCategory == 'all') ? ["25-to- 34-year-olds", "High School Diploma", "Bachelor's Degree", "Teaching Degree", "Teacher"] : ["", "Bachelor's Degree", "Teaching Degree", "Teacher"],
        xLabelNumber = (dataCategory == 'all') ? 5 : 4,
        teacher = (dataCategory == 'all') ? 4 : 3;
    var labelG = svg.append("g") 
      .attr("class", "g-x-labels")
      .selectAll(".label-g")
      .data(nodeLabels)
      .enter()
      .append("g")
      .attr("class", "label-g")
      .attr("transform", function(d, i) {
        xLabelTranslate = (dataCategory == 'all') ? [d3.select(".node-white").node().getBoundingClientRect().left, d3.select(".node-white-HS").node().getBoundingClientRect().left, d3.select(".node-white-Bach").node().getBoundingClientRect().left, d3.select(".node-white-Teaching").node().getBoundingClientRect().left, d3.select(".node-white-Teacher").node().getBoundingClientRect().left]: [0, d3.select(".node-white-Bach").node().getBoundingClientRect().left, d3.select(".node-white-Teaching").node().getBoundingClientRect().left, d3.select(".node-white-Teacher").node().getBoundingClientRect().left, 0]
        if (isPhone) {
          return (dataCategory == 'all') ? "translate(" + ((xLabelTranslate[i]) + (width*.17) - (7*i))+"," + height*1.02+ ")" : "translate(" + ((xLabelTranslate[i]) + (width*.31) - i*10 )+"," + height*1.02+ ")";
        } else if (isMobile) { 
          if (i == teacher) {
            return (dataCategory == 'all') ? "translate(" + ((xLabelTranslate[i]) - (30)) + "," + height*1.02+ ")" :  "translate(" + ((xLabelTranslate[i]) + 75 ) + "," + height*1.02+ ")" ;
          }else { 
            return (dataCategory == 'all') ? "translate(" + ((xLabelTranslate[i]) + 10 - (5*i)) + "," + height*1.02+ ")" : "translate(" + ((xLabelTranslate[i]) + (width*.35) - i*50) + "," + height*1.02+ ")";
          }
        }else {
          return (dataCategory == 'all') ? "translate(" + ((xLabelTranslate[i]) + width*.055)+ "," + height*1.02+ ")": "translate(" + ((xLabelTranslate[i]) + width*.31 - 45*i)+ "," + height*1.02+ ")";
        }
      })
    labelG
      .append("rect")
      .attr("x", -5)
      .attr("y", -18)
      .attr("width", function(d, i) {
        return (isMobile) ? xLabelsRectMobile[i] : xLabelsRect[i]
      })
      .attr("height", function(d, i){
        return (i < 4) ? xRectHeight[i] : 25;
      })
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
      .attr("dy", 0)
      .call(wrapText, wrapWidth)
    d3.select(".g-x-labels")
      .attr("transform", function(d, i) { 
        return "translate(" + 0 + ",0)";
      })


    var linkG = svg.append("g")
      .attr("class", "g-text")
    //ADD HIDDEN TEXT FOR TEACHER LINKS
    for (i=0; i<4; i++){
      var text = d3.select(".node-" + HEADERS2[i] + "-Teacher")
        .append("text")
        .attr('class', function(d) { 
          return 'linkText linkText-' + d.name
        })
        .attr("y", function(d) { 
          if (dataCategory == 'all') {
            if (i == 0) {
              return d.dy - 5
            }else{
              return d.dy - 4
            }
          }else{
            if (dataCategory !== 'all'){
              if (i< 3){ 
                return d.dy - 12
              }else{
                return (d.dy) - 5
              }
            }

          }
        })
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d){         
          return percentFormat(d.value);
        })
        .attr("text-anchor", "start")
      text
        .attr("x", function(d) { 
          var textWidth = this.getBoundingClientRect().width
              return (nodeWidth -textWidth)/2
          })

       
    }

    //ADD HIDDEN TEXT FOR OTHER LINKS
    var linktext = linkG.selectAll(".node")
      .data(graph_percent)
      .enter()
      .append("text")
      .attr('class', function(d) { 
        return 'linkText linkText-' + d.target.name
      })
      // .attr("x", function(d) { 
      //     return d.target.x + 3
      // })
      .attr("y", function(d) {
        if (dataCategory == 'all') {
          if ((d.target.name).search("Teaching") > 0) {
            return d.target.y + (d.target.dy) -4
          }else {
            return d.target.y + (d.target.dy/2) + 5
          }
        }
        else{
          if ((d.target.name).search("Teaching") > 0) {
            if ((d.target.name).search("white") == 0) {
              return d.target.y + (d.target.dy) -10
            }
            else if ((d.target.name).search("Asian") < 0) {
              return d.target.y + (d.target.dy) -8
            }else{
              return d.target.y + (d.target.dy) -4
            }
          }else{
            return d.target.y + (d.target.dy/2) + 5
           }
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
      .attr("x", function(d) { 
        var textWidth = this.getBoundingClientRect().width
            // return (nodeWidth -textWidth)/2
            return d.target.x + ((d.target.x + nodeWidth) - (d.target.x + textWidth))/2
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
      .on('click', showStats)
      .on("mouseout", hideStats);

    //TEACHER STATS
    var teacherSubTextG = svg.append("g")
      .attr("class", "teacherSubTextG")
    for (i=0; i<4; i++){ 
      var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
      var translateYPercent = (dataCategory == 'all') ? 7 :18 //-width * .3 : -width*.26
      var translateYNumber = (dataCategory == 'all') ? -width * .292 : -width*.25
      var translateY = (category == 'percent') ? translateYPercent : translateYNumber
      var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node();
      var teachingNode = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").node();
      var teacherNodeData = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").data()[0];
      var teachingNodeData = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").data()[0]
      var teacherNodeY = teacherNodeData.y;
      var teacherNodeX = (dataCategory == 'all') ? (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left)/2 + teachingNode.getBoundingClientRect().right : (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left) + teachingNode.getBoundingClientRect().right
      var teacherTextSvg = d3.select("#stats-div svg").append("g")
        .attr("transform", function() {
          return "translate(" + 0 + "," + height*.065+ ")";
        })
        .attr("class", "teacherTextG")
      teacherTextSvg
        .append("text")
        .text(function() {
          return (category == 'percent') ? teacherTextPercent[i] : teacherTextNumber[i]
        })
        .attr("dy", 0)
        .attr("class", "teacherText teacherText-" +i )
        .call(wrapText, wrapWidthDescription)
      var teacherSubTextG1 = teacherSubTextG.append("g")
        .attr("class", "teacherSubG1-" + i)
        .attr("transform", function() {
          if (isMobile) {
            return "translate(" + (teacherNodeX-20) + "," + (teacherNodeY + translateY + 5)+ ")";
          }else {
            return "translate(" + (teacherNodeX) + "," + (teacherNodeY - translateYPercent) + ")";
          }
        })
      teacherSubTextG1
        .append("text")
        .text(function() {
          return (category == 'percent') ? teacherSubTextPercentTop[i] : teacherSubTextNumberTop[i]
        })
        .attr("class", "teacherSubText teacherSubTextG1-" +i )
      var teacherSubTextG2 = teacherSubTextG.append("g")
        .attr("class", "teacherSubG2-" + i)
        .attr("transform", function() {
           if (isMobile) {
            return (dataCategory == 'all') ? "translate(" + (teacherNodeX - 20) + "," + (teacherNodeY - translateY)+ ")" : "translate(" + (teacherNodeX - 20) + "," + (teacherNodeY - translateY)+ ")";
          }else {
            return "translate(" + (teacherNodeX) + "," + (teacherNodeY + translateYPercent + 8) + ")" 
          }
         
        })
      teacherSubTextG2
        .append("text")
        .text(function() {
          return (category == 'percent') ? teacherSubTextPercentBottom[i] : teacherSubTextNumberBottom[i]
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
        d3.selectAll(".linkText, .teacherSubText")
          .classed("showText", false)
        // d3.selectAll(".linkTextRect")
        //   .classed("setTransparent", false)
        d3.selectAll(".node, .link, .teacherText, .labelRect, .linkText, .label, .raceLabels, .teacherSubText")
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
     var bachRace = (function() {
      if (d3.select(".link.highlight").node() != undefined) {
      var className = $(".link.highlight").attr("class").split(" ")[1]
        return className.split("-")[1]
      // console.log(race)
       }else {
        return "white"
       }
      })
     ();


      var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
          // format = (category == "numbers") ? numberFormat : percentFormat;
      d3.selectAll(".linkText, .teacherSubText, .linkTextMobile")
        .classed("showText", false)
      // d3.selectAll(".linkTextRect")
      //   .classed("setTransparent", false)
      d3.selectAll(".node, .link, .teacherText, .label, .linkText, .raceLabels, .teacherSubText")
        .classed("highlight", false)
      d3.selectAll(".labelRect")
        .classed("highlight", false)
      var belowLine = false;
      for (i=0; i<=4; i++){ 
        if(i !== 4){
            var bach = d3.select(".node-" + bachRace + "-Bach").node()
            var hs = d3.select(".node-" + HEADERS2[i] + "-HS").node()
            var teaching = d3.select(".node-" + HEADERS2[i] + "-Teaching").node()
            var all = d3.select(".node-" + HEADERS2[i] + " rect").node()
            var first = (dataCategory == "all") ? all : bach;
            // var bottom = first.getBoundingClientRect().bottom;
            var bottom = bach.getBoundingClientRect().bottom;
            // var top = first.getBoundingClientRect().top;
            var top = bach.getBoundingClientRect().top
            var rectBreaksX = (dataCategory == 'all') ? [all.getBoundingClientRect().right, hs.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right] : [all.getBoundingClientRect().right, all.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right]
            var line = getLine(bach.getBoundingClientRect().right, bach.getBoundingClientRect().top, teaching.getBoundingClientRect().right, teaching.getBoundingClientRect().top)
            if(line(event.clientX) < event.clientY  && event.clientY <= bottom + nodePadding/2 && event.clientY >= top -nodePadding/2){ 
              belowLine = true;
            }
            var person = (function() {
              if (dataCategory == 'all') {
                return "adults "
              }else {
                if (category == 'percent') {
                  return "college graduates "
                }else {
                  return "adults "
                }
              }
            })
            ();
            //SHOW ALL STATS BY DEGREE TYPE
            if (event.clientX >= rectBreaksX[3] ||  ( !belowLine && event.clientX > rectBreaksX[2])){ console.log('hi')
                d3.selectAll(".labelRect-Teacher, .label-Teacher")
                  .classed("highlight", true)
                d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher, .teacherSubTextG1-" + i + ",.teacherSubTextG2-" + i + ", .linkTextMobile-" + HEADERS2[i] + "-Teacher")
                  .classed("showText", true)
                highlightSelected("-Teacher", "-Bach.no-TD", person + "become teachers.")
                highlightSelected("-Teacher", "-Teaching", person + "become teachers.")
            }else 
            if (event.clientX > rectBreaksX[2] && belowLine){ console.log('below')
                d3.selectAll(".labelRect-Teaching, .label-Teaching")
                  .classed("highlight", true)
                d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher" + ", .linkTextMobile-" + HEADERS2[i] + "-Teacher")
                  .classed("showText", false)
                d3.select(".linkText-" + HEADERS2[i] + "-Teaching" + ", .linkTextMobile-" + HEADERS2[i] + "-Teaching")
                  .classed("showText", true)
                // d3.selectAll(".linkTextRect-" + HEADERS2[i] + "-Teaching")
                //   .classed("setTransparent", true)
                highlightSelected("-Teaching", "-Bach.TD", person + "earn a teaching degree.")
                
            }else if (event.clientX > rectBreaksX[1]){
                d3.selectAll(".labelRect-Bach, .label-Bach")
                  .classed("highlight", true)
                d3.select(".linkText-" + HEADERS2[i] + "-Bach" + ", .linkTextMobile-" + HEADERS2[i] + "-Bach")
                  .classed("showText", true)
                highlightSelected("-Bach", "-HS", "adults earn a bachelor's degree.")

            }else if (event.clientX > rectBreaksX[0]){  console.log('high school')
                d3.selectAll(".labelRect-HS, .label-HS")
                  .classed("highlight", true)
                d3.select(".linkText-" + HEADERS2[i] + "-HS" + ", .linkTextMobile-" + HEADERS2[i] + "-HS")
                  .classed("showText", true)
                 highlightSelected("-HS", "", "adults earn a high school diploma.")

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
          return (category == 'percent') ? "" : "" ;
        }else{ 
        return (category == 'percent') ? " of " + HEADERS2[i] + " " + degree : " " + HEADERS2[i] + " " + degree;
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
          // category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0],
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
        d3.selectAll(".linkText, linkTextMobile")
          .classed("showText", false)
        d3.selectAll(".teacherSubText")
          .classed("showText", false)
        for(var i = 0; i < 4; i++){
          d3.select(".linkText-" + HEADERS2[i] + "-Teaching")
              .classed("showText", true)
        }
      }
      var suffix = (dataCategory == "bachelor") ? "-Bach" : "";
      var type = (dataCategory == "all" ? "-All" : "-Bach")
      if (event.clientY < (d3.select(".node-" + HEADERS2[0] + suffix).node().getBoundingClientRect().bottom + nodePadding/2) ){
        d3.selectAll(highlightClass(node, link, 0))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[0] + node + ", .raceLabels-" + HEADERS2[0] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-0,.teacherSubTextG2-0")
          .classed("highlight", function() { 
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[0] + node).datum().value
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return format(text) + description(degree, 0)
          }
        })
        teacherText(node, 0)
      }else if (event.clientY < (d3.select(".node-" + HEADERS2[1] + suffix).node().getBoundingClientRect().bottom + nodePadding/2)){
        d3.selectAll(highlightClass(node, link, 1))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[1] + node + ", .raceLabels-" + HEADERS2[1] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-1,.teacherSubTextG2-1")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[1] + node).datum().value
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return format(text) + description(degree, 1)
          }
        })        
        teacherText(node, 1)
      }else if (event.clientY < (d3.select(".node-" + HEADERS2[2] + suffix).node().getBoundingClientRect().bottom + nodePadding/2)){
        d3.selectAll(highlightClass(node, link, 2))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[2] + node + ", .raceLabels-" + HEADERS2[2] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-2,.teacherSubTextG2-2")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[2] + node).datum().value
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return format(text) + description(degree, 2)
          }
        })
        teacherText(node, 2)
      }else{ 
        d3.selectAll(highlightClass(node, link, 3))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[3] + node + ", .raceLabels-" + HEADERS2[3] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-3,.teacherSubTextG2-3")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[3] + node).datum().value
        // var text = d3.select(linkTextClass(node, 3)).text()
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return format(text) + description(degree, 3)
          }
        })
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
      yLabelG.selectAll(".linkTextMobile")
        .classed("showText", false)
      svg.selectAll(".link")
        .data(linkData, function(x) { return x.id })
        .sort(function(a, b) { 
          return b.dy - a.dy;
        })
        .transition()
        .duration(1000)
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy) + "px";
        });

      nodeG.selectAll(".node")
        .data(nodeData, function(d) { return d.name; })
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      svg.selectAll(".node-rect")
        .transition()
        .duration(1000)
        .attr("height", function(d) {
          return d.dy;
        })
        .on('end', function() {
          for (j=0; j<nodeCategories.length; j++){
            for (i=0; i<HEADERS2.length; i++){
              var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
              var linkData = (category == "numbers") ? graph_number : graph_percent;
              yLabelG.select(".linkTextMobile-" + HEADERS2[i] + nodeCategories[j]) 
                .data(linkData.filter(function(d) { 
                  return (d.target.name) == HEADERS2[i] + nodeCategories[j]
                  })
                )
                // // .append("text")
                .text(function(d) {
                  if (d.target.name == HEADERS2[i] + "-Teacher") { console.log(d.target.name)
                    return HEADERS2[i] + " " + format(d.target.value)
                  }else { console.log(d.target.name)
                    return HEADERS2[i] + " " + format(d.value)
                  }
                })
                // .attr("class", function(d) {
                //     return "linkTextMobile linkTextMobile-" + d.target.name
                // })        
                // .attr("x", 85)
                .attr("y", function(d) {
                  var yPos = d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top
                  console.log(yPos);
                  return  yPos
                })
                // .attr("transform", "translate(0,"+ (-170) +")")

                // .style("opacity", 0)
            }
          }  
      // var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node();
      // var teachingNode = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").node();
      // var teacherNodeData = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").data()[0];
      // var teachingNodeData = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").data()[0]
      // var teacherNodeY = teacherNodeData.y;
      // var teacherNodeX = (dataCategory == 'all') ? (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left)/2 + teachingNode.getBoundingClientRect().right : (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left) + teachingNode.getBoundingClientRect().right
      //       var bottom = teacherNode.getBoundingClientRect().bottom;
      //       transitionTeacherText(teacherNodeX, teacherNodeY, bottom)
        })

      node.selectAll(".raceLabels")
        .transition()
        .duration(1000)
        .attr("y", function(d) { return d.dy / 2; })

      linkG.selectAll(".linkText")
        .data(linkData)
        .attr("y", function(d) {
          if (dataCategory == 'all') {
            if ((d.target.name).search("Teaching") > 0) {
              if ((d.target.name).search("white") == 0) {
                return (category == 'percent') ? d.target.y + (d.target.dy) -4 :  d.target.y + (d.target.dy) -8
              }
              return (category == 'percent') ? d.target.y + (d.target.dy) -4 :  d.target.y + (d.target.dy) -2
            }else {
              return (category == 'percent') ? d.target.y + (d.target.dy/2) + 5 : d.target.y + (d.target.dy/2) + 5
            }
          }
          else{
            if ((d.target.name).search("Teaching") > 0) {
              if ((d.target.name).search("white") == 0) {
                return (category == 'percent') ? d.target.y + (d.target.dy) -8 : d.target.y + (d.target.dy) -6 ;
              }
              else if ((d.target.name).search("Asian") < 0) {
                return (category == 'percent') ? d.target.y + (d.target.dy) -8 : d.target.y + (d.target.dy) -3
              }else{
                return d.target.y + (d.target.dy) -4
              }
            }else{
              return d.target.y + (d.target.dy/2) + 5
             }
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
      linkG.selectAll(".linkText")
        .attr("x", function(d) { 
          var textWidth = this.getBoundingClientRect().width
              // return (nodeWidth -textWidth)/2
              return d.target.x + ((d.target.x + nodeWidth) - (d.target.x + textWidth))/2
        }) 


      for (i=0; i<HEADERS2.length; i++){
        d3.select(".node-" + HEADERS2[i] + "-Teacher .linkText")
          .text(function(d){ 
            return linkTextFormat(d.value);
          })
          .attr("x", function(d) { 
            var textWidth = this.getBoundingClientRect().width
              return (nodeWidth -textWidth)/2
          })
        .attr("y", function(d) { 
          if (dataCategory == 'all') {
            if (i == 0) {
              return (category == 'percent') ? d.dy - 5 : d.dy - 12
            }else{
              return d.dy - 4
            }
          }else{
            if (dataCategory !== 'all'){
              if (i == 0) {
                return (category == 'percent') ? d.dy - 11 : d.dy - 10
              }
              else if (i < 3){ 
                 return (category == 'percent') ? d.dy - 11 : d.dy - 5
              }else{
                return (d.dy) - 4
              }
            }

          }
        })
      }
      for (i=0; i<4; i++){
        d3.select(".teacherText-" + i)
          .text(function(d){
            var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
            return (category == 'percent') ? teacherTextPercent[i] : teacherTextNumber[i]
          })
          .call(wrapText, wrapWidthDescription)
      }


    };

    function transitionTeacherText(x, y, bottom) {
      var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
      var translateXPercent = (dataCategory == 'all') ? -width*.02 : width*.05
      var translateXNumber = (dataCategory == 'all') ? -width*.02 : width*.05
      var translateX = (category == 'percent') ? translateXPercent : translateXNumber;
      var translateYPercent = (dataCategory == 'all') ? 12 :20 //-width * .3 : -width*.26
      var translateYNumber = (dataCategory == 'all') ? 13 : 14
      var translateY = (category == 'percent') ? translateYPercent : translateYNumber

      teacherSubTextG.select(".teacherSubG1-" + i)
        .transition()
        .duration(0)
        .attr("transform", function() {
          if (i == 0 ) {
            return "translate(" + (x) + "," + (y - translateY)+ ")";
          }else {
            return "translate(" + (x) + "," + (y - translateY + 7)+ ")";

          }     
        })
      teacherSubTextG.select(".teacherSubG2-" + i)
        .transition()
        .duration(0)
        .attr("transform", function() {
          if (i == 0) { 
            return "translate(" + (x) + "," + (y + translateY + 10) + ")"
          }else {
            return (category == 'percent') ? "translate(" + (x) + "," + (y + translateY)+ ")" : "translate(" + (x) + "," + (y + translateY)+ ")";
          }
        })
      teacherSubTextG.select("text.teacherSubTextG1-" + i)
        .text(function() {
          var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
          return (category == 'percent') ? teacherSubTextPercentTop[i] : teacherSubTextNumberTop[i]
        })
      teacherSubTextG.select("text.teacherSubTextG2-" + i)
        .text(function() {
          var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
          return (category == 'percent') ? teacherSubTextPercentBottom[i] : teacherSubTextNumberBottom[i]
        })  
      }

  });
  }

drawGraph(container_width)

$(window).on('resize', function () {
      var container_width = parseFloat(d3.select("#chart").style("width"))
      var category = 'percent'
      drawGraph(container_width, category)
});


 
