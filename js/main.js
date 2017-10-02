
// var container_width = parseFloat(d3.select("#chart").style("width"))
var numberFormat = d3.format(",");
var numberShortFormat = d3.format(".2s");
var percentFormat = d3.format(".1%");

function drawGraph(container_width, category) {
  var isMobile = d3.select("#isMobile").style("display") == "block"
  var isPhone = d3.select("#isPhone").style("display") == "block"
  var is675 = d3.select("#is675").style("display") == "block"
  var dataCategory = document.getElementById('chart').className
  var units = "of students";
  var steps = (dataCategory == 'all') ? ["All young adults", "High school diploma", "Bachelor's degree", "Teaching degree", "Teacher"] : ["Bachelor's degree", "Teaching degree", "Teacher"]
  var numberSteps = (dataCategory == 'all') ? 5 : 3;
  var HEADERS2= ["White", "Black", "Hispanic", "Asian"],
      HEADERS3= ["white", "black", "Hispanic", "Asian"],
      HEADERS1= ["SOURCE", "TARGET"],
      category = "percent",
      xRectHeight = (dataCategory == 'all') ? [65, 65, 65, 65, 25,] : [0, 65, 65, 25, 0,]
      xLabelsRect = (dataCategory == 'all') ? [95, 85, 75, 70, 60,] : [0, 76, 70, 62, 0,],
      xLabelsRectMobile = (dataCategory == 'all') ? [65, 55, 75, 62, 60,] : [0, 76, 62, 62, 0,],
      nodeCategories = (dataCategory == 'all') ? ["", "-HS diploma", "-Bach", "-Teaching degree", "-Teacher"] : ["", "-Bach", "-Teaching degree", "-Teacher"],
      nodeNames = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["", "-Bach", "-Teaching", "-Teacher"],
      numberStats = (dataCategory == 'all') ? [92338890, 19560471, 25434140,10383460] : [92338890, 19560471, 25434140,10383460],
      teacherTextPercent = (dataCategory == 'all') ? ["2.3% of white young adults became teachers after earning teaching degrees. 2.0% became teachers without earning a teaching degree.", "0.7% of black young adults became teachers after earning teaching degrees. 1.1% became teachers without earning a teaching degree.", "0.6% of Hispanic young adults became teachers after earning teaching degrees. 0.9% became teachers without earning a teaching degree.", "0.5% of Asian young adults became teachers after earning teaching degrees. 1.6% became teachers without earning a teaching degree."] : ["5.8% of white college graduates became teachers after earning teaching degrees. 5.1% became teachers without earning a teaching degree.", "3.3% of black college graduates became teachers after earning teaching degrees. 5.3% became teachers without earning a teaching degree.", "4.0% of Hispanic college graduates became teachers after earning teaching degrees. 5.4% became teachers without earning a teaching degree.", "0.8% of Asian college graduates became teachers after earning teaching degrees. 2.5% became teachers without earning a teaching degree."] 
      teacherTextNumber = (dataCategory == 'all') ? ["580k white young adults became teachers after earning teaching degrees. 505k became teachers without earning a teaching degree.", "40k black young adults became teachers after earning teaching degrees. 64k became teachers without earning a teaching degree.", "57k Hispanic young adults became teachers after earning teaching degrees. 78k became teachers without earning a teaching degree.", "15k of Asian young adults became teachers after earning teaching degrees. 47k became teachers without earning a teaching degree."] : ["580k white college graduates became teachers after earning teaching degrees. 505k became teachers without earning a teaching degree.", "40k black college graduates became teachers after earning teaching degrees. 64k became teachers without earning a teaching degree.", "57k Hispanic college graduates became teachers after earning teaching degrees. 78k became teachers without earning a teaching degree.", "15k of Asian college graduates became teachers after earning teaching degrees. 47k became teachers without earning a teaching degree."]
      teacherSubTextPercentBottom = (dataCategory == 'all') ? ["2.3%", "0.7%", "0.6%", "0.5%"] : ["5.8%", "3.3%", "4.0%", "0.8%"], 
      teacherSubTextPercentTop = (dataCategory == 'all') ? ["2.0%", "1.1%", "0.9%", "1.6%"] : ["5.1%", "5.3%", "5.4%", "2.5%"], 
      teacherSubTextNumberBottom = (dataCategory == 'all') ? ["580k", "40k", "57k", "15k"] : ["580k", "40k", "57k", "15k"],
      teacherSubTextNumberTop = (dataCategory == 'all') ? ["505k", "64k", "78k", "47k"] : ["505k", "64k", "78k", "47k"],
      // wrapWidthDescription = (isMobile) ? container_width*.99 : container_width*.65; 
      wrapWidthDescription = (function(){
        if (isPhone) { 
          return container_width*.8
        }
        else if (is675) { 
          return container_width*.98
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return container_width*.65
        }
      })
      (),
      // wrapWidthDescriptionPhone = container_width*.8, 
      wrapWidth = (function(){
        if (isPhone) { 
          return 60
        }
        else if (isMobile) { 
          return 63
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return 90
        }
      })
      (),
      nodeLabels = (dataCategory == 'all') ? ["", "-HS", "-Bach", "-Teaching", "-Teacher"] : ["", "-Bach", "-Teaching", "-Teacher"],
      xLabels = (dataCategory == 'all') ? ["All young adults", "High school diploma", "Bachelor's degree", "Teaching degree", "Teacher"] : ["", "Bachelor's degree", "Teaching degree", "Teacher"],
      xLabelNumber = (dataCategory == 'all') ? 5 : 4,
      teacher = (dataCategory == 'all') ? 4 : 3;
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
  var nodePadding = (function(){
        if (isPhone) {
          return 43
        }
        else if (isMobile) { 
          return 35
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return 25
        }
      })
      ()
  var margin = {top: 30, right: 10, bottom: 70, left: 10},
      width = (function(){
        if (isPhone) {
          return (dataCategory == 'all') ? container_width*1.2 : container_width*1.35
        } else if (isMobile) { 
          return (dataCategory == 'all') ? container_width : container_width*1.21
          // return (dataCategory == 'all') ? container_width - margin.left - margin.right : 900 - margin.left - margin.right
        }else {
          return (dataCategory == 'all') ? container_width*1.02 : container_width*1.23
        }
      })
      ();
  var aspect_width = 35,
      heightPhone = (dataCategory == 'all') ? 55 : 48,
      heightMobile = (dataCategory == 'all') ? 48 : 35,
      heightNormal = (dataCategory == 'all') ? 31 : 25,
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
    // var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
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
    // var category = d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
    if (category == "percent") {
      return percentFormat(d) 
    }else {
      return numberShortFormat(d)
    }
  };
  function wrapText(text, width) { 
    var width = (text.text().search("All young adults") > -1 && isPhone) ? 35 : width;
    text.each(function() {
      //(d3.select(this).node().getBBox().width) 
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em")
      while (word = words.pop()) { 
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          var topTextWidth = tspan.node().getComputedTextLength();
          line = [word];
          tspan = text.append("tspan")
            .attr("y", y)
            .attr("dy", function() { 
              if (lineNumber == 1 && word == 'Diploma') {
                return "1.1em"
              }if (lineNumber == 1 && word == 'adults') {
                return "1.1em"
              }else {
                return ++lineNumber * lineHeight + dy + "em"
              }
            })
            .text(word)
            .attr("x", function() {  
             // var x = (x == null) ? 0 : text.attr("x");
              var x = text.attr("x");

              var bottomTextWidth = (d3.select(this).node().getComputedTextLength())
                // if (isMobile) {
                //   if (word == "Diploma") {
                //     return 0 + parseFloat(x)
                //   }else if (word == "School"){
                //     return 5 + parseFloat(x)
                //   }
                // }
                if (topTextWidth < 40){ 
                  return (-(bottomTextWidth - topTextWidth) / 2) + parseFloat(x)
                }else if (topTextWidth < 80) { 
                  return ((topTextWidth - bottomTextWidth) / 2) + parseFloat(x)
                }else { 
                  return 0 //+ parseFloat(x)
                }
            });
        }
      }
    });
  }
  $("#stats-div").empty()
  var statsSvg = d3.select("#stats-div")
    .append("svg")
    .attr("width", function() { 
      if (isPhone) {
        return container_width*.8
      }else if (is675) { 
        return container_width*.98
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
          return (dataCategory == 'all') ? "translate("+ -width*.19 +"," + margin.top* 1.5+ ")" : "translate(" + -width*.31+ "," + margin.top*1.5+ ")"
        }else if (isMobile) {
          return (dataCategory == 'all') ? "translate("+ -width*.03 +"," + margin.top + ")" : "translate(" + -width*.22+ "," + margin.top + ")"
        }else {
          return (dataCategory == 'all') ? "translate("+ -width*.07 +"," + 20 + ")" : "translate(" + -width*.21+ "," + margin.top + ")"
        }

      })


   // var defs = svg.append("defs");

  // Set the sankey diagram properties
  var size = (isMobile) ? [width, height*.93] : [width, height*.95]
  var sankey = d3.sankey()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .dataCategory(dataCategory)
      .size(size);
   
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
      .attr("transform", function(d, i) { 
        return "translate(" + d.x + "," +  d.y + ")"; 
        
      })
    
  // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .attr("class", "node-rect")

  var labelG = svg.append("g") 
        .attr("class", "g-x-labels")
        .selectAll(".label-g")
        .data(nodeLabels)
        .enter()
        .append("g")
        .attr("class", function(i) {
          return "label-g label" + i
        })      
          //ADD X-AXIS CATEGORY LABELS
  // for (j=0; j<nodeCategories.length; j++){
    labelG
      .attr("transform", function(d, i) { 
        if (container_width < 350){         
          return (dataCategory == 'all') ? "translate(" + (width*.21 + width*.175*i)+ "," + height*.99+ ")": "translate(" + (6+ width*.305*i)+ "," + height+ ")";
        }
        else if (isPhone) {
         return (dataCategory == 'all') ? "translate(" + (width*.21 + width*.18*i)+ "," + height*.99+ ")": "translate(" + (10+ width*.305*i)+ "," + height+ ")";
        }
        else if (isMobile) { 
          return (dataCategory == 'all') ? "translate(" + (width*.17 + width*.17*i)+ "," + height*1.05+ ")" : "translate(" + ( width*.29*i)+ "," + height*1.05+ ")"
          // return (dataCategory == 'all') ? "translate(" + (xLabelTranslate - 10)+ "," + height*.91+ ")": "translate(" + ((xLabelTranslate - 10))+ "," + height+ ")";
        }else {
          return (dataCategory == 'all') ? "translate(" + (width*.16 + width*.175*i)+ "," + height*.98+ ")": "translate(" + (width*.29*i)+ "," + height*.98+ ")";
        }
        //}
      })
    // }

  // add in the title for the nodes
    var xPos = (dataCategory == 'all') ? width*.005 : -120
    var xPosMobile = (dataCategory == 'all') ? width*.025 : -100
    var xPos2 = (dataCategory == 'all') ? width*.033 : -100;
    var xPosMobile2 = (dataCategory == 'all') ? width*.055 : -100;

    //ADD Y-AXIS RACE LABELS
    var startNumber = (dataCategory == 'all') ? 0 : 1;
    var yLabelG = svg.append("g") 
        .attr("class", "g-y-labels")
    for (j=startNumber; j<nodeCategories.length; j++){
      for (i=0; i<HEADERS2.length; i++){
        if (isPhone){ 
          var yPos = (function(){
            if (dataCategory == 'all') { 
              return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top + 10
            }
            else if (dataCategory != 'all') { 
              if (container_width < 350) {
                return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top - 10
              }else {
              return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top + 10
              }
            }
          })
          ();
          yLabelG.append("g") 
            .attr("class", "linkTextPhone linkTextPhone-" + HEADERS2[i] + nodeNames[j])
            .data(graph_percent.filter(function(d) { 
              return (d.target.name) == HEADERS2[i] + nodeCategories[j]
              })
            )
            .append("text")
            .text(HEADERS2[i])
            .attr("class", function(d) {
                return " linkTextPhone-race linkTextPhone-race-" + HEADERS2[i]
            })        
            .attr("x", function() {
              return (dataCategory == 'all') ? width*.2 : width*.32
            })
            .attr("y", function(d) {
              return yPos
            })
            .attr("transform", "translate(0,"+ (-170) +")")
        var textRect = d3.select(".linkTextPhone-race-" + HEADERS2[i]).node().getBoundingClientRect()
        yLabelG.select(".linkTextPhone-" + HEADERS2[i] + nodeNames[j])
            .append("text")
            .text(function(d) { 
              if (d == undefined) {
                return ""
              }
              else if (d.target.name == HEADERS2[i] + "-Teacher") {
                return " " + percentFormat(d.target.value)
              }else { 
                return " " + percentFormat(d.value)
              }
            })   
            .attr("class", function(d) {
                return " linkTextPhone-stats linkTextPhone-stats" + i + j
            })      
            .attr("x", (dataCategory == 'all') ? width*.22 + textRect.width : width*.34 + textRect.width)
            .attr("y", function(d) {
              return yPos
            })
            .attr("transform", "translate(0,"+ (-170) +")")
            // .style("opacity", 0)
          var statsRect = d3.select(".linkTextPhone-stats" + i + j).node().getBoundingClientRect()
          yLabelG.select(".linkTextPhone-" + HEADERS2[i] + nodeNames[j])
            .append("text")
            .text(function(d) { 
              if (d == undefined) {
                return steps[j-startNumber]
              }
              else { 
                return steps[j-startNumber]
                //return " " + percentFormat(d.value)
              }
            })   
            .attr("class", function(d) {
                return " linkTextPhone-stats-category linkTextPhone-stats-category" + i + j
            })      
            .attr("x", (dataCategory == 'all') ? width*.22 + textRect.width + statsRect.width + 10 : width*.34 + + statsRect.width + textRect.width + 10)
            .attr("y", function(d) {
              return yPos
            })
            .attr("transform", "translate(0,"+ (-170) +")")
            // .style("opacity", 0)
          var statsCategory = d3.select(".linkTextPhone-stats-category" + i + j).node().getBBox()
          yLabelG.select(".linkTextPhone-" + HEADERS2[i] + nodeNames[j])
            .append("rect")
            .attr("height", 2.6)
            .attr("width", statsCategory.width)  
            .attr("class", function(d) {
                return " linkTextPhone-stats-category-rect linkTextPhone-stats-category-rect" + i + j
            })      
            .attr("x", (dataCategory == 'all') ? width*.22 + textRect.width + statsRect.width + 10 : width*.34 + + statsRect.width + textRect.width + 10)
            .attr("y", function(d) {
              return yPos + 3
            })
            .attr("transform", "translate(0,"+ (-170) +")")
            // .style("opacity", 0)
        }
      }
    }
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };
    d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    //MOBILE TEXT
    for (i=0; i<HEADERS2.length; i++) {
      if (isPhone){
        var yPos = (function(){
          if (dataCategory == 'all') { 
            return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top- 140
          }
          else if (dataCategory != 'all') { 
            if (container_width < 350) {
              return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top - 163
            }else {
            return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top- 140
            }
          }
        })
        ();
      var textRect = d3.select(".linkTextPhone-race-" + HEADERS2[i]).node().getBoundingClientRect()
      yLabelGDescription = yLabelG
        .append("g")
        .attr("class", "teacherStatsPhoneG teacherStatsPhoneG-" + i)
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", 0)
        .attr("transform", function() { 
            return (dataCategory == 'all') ? "translate("+ width * .2 +","+ (yPos ) +")" : "translate("+ width * .325 +","+ (yPos ) +")"
        })   
      yLabelGDescription
        .append("text")
        .attr("class", function(d) {
            return "teacherStatsPhone-text teacherStatsPhone-text-" + HEADERS2[i] 
        }) 
        .attr("x", 0)
        .attr("y", 0)
        // .call(wrapText, wrapWidthDescriptionPhone)
      yLabelGDescription.append("rect")
        .attr("x",-4)
        .attr("y", -textRect.height)       
        .attr("width", textRect.width * 1.1)
        .attr("height", textRect.height * 1.2)      
        .style("fill","#fff")
        .style("opacity", .34)
        .attr("class", "teacherStatRect-" + i)
      d3.select(".teacherStatRect-" + i).moveToBack()
      }
    }




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
            }else if (container_width < 440){
              return (dataCategory == 'all') ? sankey.nodeWidth() - 12 : -53
            } else if (isMobile) {
              return (dataCategory == 'all') ? sankey.nodeWidth() : -57
            }return (dataCategory == 'all') ? 9 + sankey.nodeWidth() : -75
          }else {
            if (isPhone) {
              return (dataCategory == 'all') ? 75 + sankey.nodeWidth() : sankey.nodeWidth() - 20
            }else if (container_width < 440) {
              return (dataCategory == 'all') ? 3 + sankey.nodeWidth() : -33
            }else if (isMobile) {
              return (dataCategory == 'all') ? 14 + sankey.nodeWidth() : -38
            }return (dataCategory == 'all') ? 27 + sankey.nodeWidth() : -55
          }
        })
        .attr("text-anchor", "start")
        .attr("class", function(d) {
            return "raceLabels raceLabels-" + d.name.split(" ")[0] 
        })

    // var xLabelNotes = d3.select(".label-g.label")
    //   .append("text")
    //   .text("ages 25–34")
    //   .attr("y", 48)
    //   .attr("x", 0)
    //   .attr("class", "x-label-notes")
    labelG
      .append("rect")
      .attr("y",  function(d, i) { 
        return -23
        // return (labelG.select(".label-Bach").node().getBBox().y) -10
      })
      .attr("width", function(d, i) { 
        //return (labelG.select(".label" + nodeNames[i]).node().getBBox().width) + 40
        if (isPhone) {
          if (dataCategory == 'all') {
            if (i  == 0) {
              return 30
            }
            return 45
          }else {
            return 45
          }
        }else if (isMobile){
          return width*.15
        }else {
          return width*.14
        }
        // return (isMobile) ? xLabelsRectMobile[i] : xLabelsRect[i]
      })
      .attr("height", function(d, i){ 
        return (isPhone) ? 2.6 : 55;
      }) 
      .attr("class", function(d, i) {
        return "labelRect labelRect" + nodeLabels[i] 
      })
      .attr("x", function(d, i) { 
        return (isPhone) ? -7 : 5
      })
      .moveToBack()
    labelG
      .append("text")
      .attr("x", 0)
      .text(function(d, i) { 
        return xLabels[i]
      })
      .attr("class", function(d,i){
        return "label label" + nodeLabels[i]
      })
      .attr("dy", function(d, i) {
        if (d == "-Teacher") {
          return .5
        }else {
          return 0
        }
      })
      .call(wrapText, wrapWidth)
    d3.selectAll("text.label")
      .each(function(d, i) {
        d3.select(this)
          .attr("x", function() { 
            var textWidth = d3.select(this).node().getBBox().width
            var rectWidth = d3.select(".labelRect").node().getBBox().width
            if (d == "-Teacher") {
              return (isPhone) ? (rectWidth-textWidth)/2 - 7 : (rectWidth-textWidth)/2 + 2
            } else if (d == "-HS") {
              return (isMobile && !isPhone) ? (rectWidth-textWidth)/2 + 13 : (rectWidth-textWidth)/2 + 2
            }else {
              return (isPhone) ? (rectWidth-textWidth)/2 + 7 : (rectWidth-textWidth)/2 + 4
            }
          })
          .text(function() { 
            return xLabels[i]
          })
          .attr("dy", function() {
            if (d == "-Teacher" && !isPhone) {
              return .5
            }else {
              return 0
            }
          })
          .call(wrapText, wrapWidth)
      })
  
   
   if (isPhone) {
    d3.selectAll(".labelRect")
      .each(function(d, i) { 
        var label = d3.select(".label" + nodeNames[i]).node().getBBox()
        var labelTspan = d3.select(".label" + nodeNames[i]).select("tspan").node().getBBox()
        d3.select(this)
          .attr("y", function() {
            if (dataCategory != 'all') {
              if (i == 0) {
                return label.height/2 + label.y + 2
              }else {
              return label.height + label.y + 2
              }
            }else if (dataCategory == 'all') {
              if (i == 1) {
                return label.height + label.y - 12
              }else {
              return label.height + label.y
              } 
            }
          })
          .attr("x", labelTspan.x)
      })
   }

  //make third line in x-axis labels center-aligned
    if (isPhone && (dataCategory == 'all')){
      d3.select(".label.label").select("tspan:nth-child(3)")
        .attr("x", -6)     
    }
    d3.selectAll("text.label")
      .each(function() {
        d3.select(this)
          .attr("x", function() {
            return 0
          })
      })


    d3.select("text.label.label-HS")
      .attr("y", function() {
        return (isMobile && !isPhone) ? -5 : 0
      })
    if (isMobile  && (dataCategory == 'all')) {
      d3.select("text.label.label-HS").select("tspan:nth-child(3)")
        .attr("dy", "1.1em")
      d3.select("text.label.label-HS").select("tspan:nth-child(3)")
        .attr("x", function() {
          return (isPhone) ? -11 : 17
        })
    }

      // .attr("x", function() {
      //   return (isMobile && !isPhone) ? 10 : ""
      // })
    d3.select(".g-x-labels")
      .attr("transform", function(d, i) { 
          return (isMobile) ? "translate(" + 0 + ","+ (-height*.03) +")" : "translate(" + 0 + ","+ (height*.07) +")";
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
            if ((d.target.name).search("White") == 0) {
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

    // var xLabelsG = svg.append("g")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", 50)
    //     .attr("class", "g-xLabel")


    var mouseoverRect = svg.append("g")
      .append("rect")
      .attr("width", width)
      .attr("height", height + margin.bottom + margin.top)
      .attr("class", "mouseoverRect")
      .style("opacity", "0")
      .on('mousemove', showStats)
      .on('click', showStats)
      .on("mouseout", hideStats);

    //TEACHER STATS
    var teacherSubTextG = svg.append("g")
      .attr("class", "teacherSubTextG")
    for (i=0; i<4; i++){ 
      // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
      var translateYPercent = (dataCategory == 'all') ? 7 :13 //-width * .3 : -width*.26
      var translateYNumber = (dataCategory == 'all') ? -width * .292 : -width*.25
      var translateY = (category == 'percent') ? translateYPercent : translateYNumber
      var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node();
      var teachingNode = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").node();
      var teacherNodeData = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").data()[0];
      var teachingNodeData = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").data()[0]
      var teacherNodeY =  teacherNodeData.y;
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
        .attr("class", "teacherSubG1-" + HEADERS2[i])
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
        .attr("class", "teacherSubText teacherSubTextG1-" + HEADERS2[i] )
      var teacherSubTextG2 = teacherSubTextG.append("g")
        .attr("class", "teacherSubG2-" + HEADERS2[i])
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
        .attr("class", "teacherSubText teacherSubTextG2-" + HEADERS2[i] )
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
        d3.selectAll(".node, .link, .teacherText, .labelRect, .linkText, linkTextPhone, .label, .raceLabels, .teacherSubText")
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
       }else {
        return "White"
       }
      })
     ();



      // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
          // format = (category == "numbers") ? numberFormat : percentFormat;
      d3.selectAll(".linkText, .teacherSubText, .linkTextPhone, .teacherStatsPhoneG")
        .classed("showText", false)
      // d3.selectAll(".linkTextRect")
      //   .classed("setTransparent", false)
      d3.selectAll(".node, .link, .teacherText, .label, .linkText, .linkTextPhone, .labelRect, .raceLabels, .teacherSubText")
        .classed("highlight", false)
      var belowLine = false;
      for (i=0; i<=4; i++){ 
        if(i !== 4){
            var bach = d3.select(".node-" + bachRace + "-Bach").node()
            var hs = d3.select(".node-" + HEADERS2[i] + "-HS").node()
            var teaching = d3.select(".node-" + bachRace + "-Teaching").node()
            var all = d3.select(".node-" + HEADERS2[i] + " rect").node()
            var first = (dataCategory == "all") ? all : bach;

            // var bottom = first.getBoundingClientRect().bottom;
            var bottom = bach.getBoundingClientRect().bottom;

            var bottomButton = (bachRace == "Asian" && event.clientY >  bottom +20)
            // if (bottom - event.clientY > 0 ){
            //   continue;
            // }
            // var top = first.getBoundingClientRect().top;
            var top = bach.getBoundingClientRect().top
            var rectBreaksX = (dataCategory == 'all') ? [all.getBoundingClientRect().right, hs.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right] : [all.getBoundingClientRect().right, all.getBoundingClientRect().right, bach.getBoundingClientRect().right, teaching.getBoundingClientRect().right]
            var line = getLine(bach.getBoundingClientRect().right, bach.getBoundingClientRect().top, teaching.getBoundingClientRect().right, teaching.getBoundingClientRect().top)
            if(line(event.clientX) < event.clientY  && event.clientY <= bottom + nodePadding/2 && event.clientY >= top -nodePadding/2){ 
              belowLine = true;
            }

            var person = (function() {
              if (dataCategory == 'all') {
                return "young adults "
              }else {
                return "college graduates "
                // if (category == 'percent') {
                //   return "college graduates "
                // }else {
                //   return "young adults "
                // }
              }
            })
            ();
            //SHOW ALL STATS BY DEGREE TYPE
            if (event.clientX >= rectBreaksX[3] ||  ( !bottomButton && !belowLine && event.clientX > rectBreaksX[2])){ 
                d3.selectAll(".labelRect-Teacher, .label-Teacher")
                  .classed("highlight", true)
                d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher, .teacherSubTextG1-" + HEADERS2[i] + ",.teacherSubTextG2-" + HEADERS2[i] + ", .linkTextPhone-" + HEADERS2[i] + "-Teacher" + ", .teacherStatsPhoneG-" + [i])
                  .classed("showText", true)
                highlightSelected("-Teacher", "-Bach.no-TD", person + "were teachers.")
                highlightSelected("-Teacher", "-Teaching", person + "were teachers.")
            }else 
            if (event.clientX > rectBreaksX[2] && (belowLine || bottomButton)){ 
                d3.selectAll(".labelRect-Teaching, .label-Teaching")
                  .classed("highlight", true)
                d3.selectAll(".linkText-" + HEADERS2[i] + "-Teacher" + ", .linkTextPhone-" + HEADERS2[i] + "-Teacher")
                  .classed("showText", false)
                d3.select(".linkText-" + HEADERS2[i] + "-Teaching" + ", .linkTextPhone-" + HEADERS2[i] + "-Teaching")
                  .classed("showText", true)
                // d3.selectAll(".linkTextRect-" + HEADERS2[i] + "-Teaching")
                //   .classed("setTransparent", true)
                highlightSelected("-Teaching", "-Bach.TD", person + "held teaching degrees.")
                
            }else if (event.clientX > rectBreaksX[1]){
                d3.selectAll(".labelRect-Bach, .label-Bach")
                  .classed("highlight", true)
                d3.select(".linkText-" + HEADERS2[i] + "-Bach" + ", .linkTextPhone-" + HEADERS2[i] + "-Bach")
                  .classed("showText", true)
                highlightSelected("-Bach", "-HS", "young adults held bachelor's degrees.")

            }else if (event.clientX > rectBreaksX[0]){  
                d3.selectAll(".labelRect-HS, .label-HS")
                  .classed("highlight", true)
                d3.select(".linkText-" + HEADERS2[i] + "-HS" + ", .linkTextPhone-" + HEADERS2[i] + "-HS" )
                  .classed("showText", true)
                 highlightSelected("-HS", "", "young adults held high school diplomas.")

            }else if (event.clientX <= rectBreaksX[0] && event.clientX > all.getBoundingClientRect().left) { 
                d3.select(".labelRect")
                  .classed("highlight", true)
                d3.select(".label")
                  .classed("highlight", true)
                d3.select(".linkText-" + HEADERS2[i]+ ", .linkTextPhone-" + HEADERS2[i])
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
        // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0]
        if (typeof(degree) == "undefined"){ 
          return (category == 'percent') ? "" : "" ;
        }else{ 
          if (dataCategory != 'all') { 
            if (degree.search("bachelor") > 0 && category !='percent') {
              return " " + HEADERS3[i] + " college graduates in 2016."
            }else{
              return (category == 'percent') ? " of " + HEADERS3[i] + " " + degree : " " + HEADERS3[i] + " " + degree;
            }
          }else {
            return (category == 'percent') ? " of " + HEADERS3[i] + " " + degree : " " + HEADERS3[i] + " " + degree;
          }
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
        d3.selectAll(".linkText, linkTextPhone")
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
        d3.selectAll(".teacherSubTextG1-White,.teacherSubTextG2-White")
          .classed("highlight", function() { 
            return (node == "-Teacher") ? true : false
          })
        statText(degree, 0, node)
        teacherText(node, 0)
      }else if (event.clientY < (d3.select(".node-" + HEADERS2[1] + suffix).node().getBoundingClientRect().bottom + nodePadding/2)){
        d3.selectAll(highlightClass(node, link, 1))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[1] + node + ", .raceLabels-" + HEADERS2[1] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-Black,.teacherSubTextG2-Black")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[1] + node).datum().value
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return "In 2015, " + format(text) + description(degree, 1)
          }
        }) 
        statText(degree, 1, node)       
        teacherText(node, 1)
      }else if (event.clientY < (d3.select(".node-" + HEADERS2[2] + suffix).node().getBoundingClientRect().bottom + nodePadding/2)){
        d3.selectAll(highlightClass(node, link, 2))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[2] + node + ", .raceLabels-" + HEADERS2[2] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-Hispanic,.teacherSubTextG2-Hispanic")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[2] + node).datum().value
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return "In 2015, " + format(text) + description(degree, 2)
          }
        })
        statText(degree, 2, node)
        teacherText(node, 2)
      }else{ 
        d3.selectAll(highlightClass(node, link, 3))
          .classed("highlight", true)
        d3.selectAll(".linkText-" + HEADERS2[3] + node + ", .raceLabels-" + HEADERS2[3] + type)
          .classed("highlight", true)
        d3.selectAll(".teacherSubTextG1-Asian,.teacherSubTextG2-Asian")
          .classed("highlight", function() {
            return (node == "-Teacher") ? true : false
          })
        var text  = d3.select(".node-" + HEADERS2[3] + node).datum().value
        // var text = d3.select(linkTextClass(node, 3)).text()
        statsSvg.text(function() { 
          if (text == 1) {
            return ""
          }else {
            return "In 2015, " + format(text) + description(degree, 3)
          }
        })
        statText(degree, 3, node)
        teacherText(node, 3)
      }

      function statText(degree, number, node) { 
        if (isPhone) { 
          var text  = d3.select(".node-" + HEADERS2[number] + node).datum().value
          d3.selectAll(".linkTextPhone")
            .classed("highlight", false)
          d3.selectAll(".teacherStatsPhoneG")
            .classed("showText", false)
          yLabelG.select(".linkTextPhone-" + HEADERS2[number] + node)
            .classed("highlight", true)
          yLabelG.select(".teacherStatsPhone-text-" + HEADERS2[number])
            .text(function() { 
              if (degree == undefined) {
                if ( dataCategory == 'all' && category != 'percent'){
                  return "There were " + format(text) + " adults ages 25–34 in 2015."
                }
              }else if ( dataCategory != 'all' && degree.search("bachelor") > 0) { 
                if (category == 'percent'){
                  return ""
                }else{
                  return "There were " + format(text) + description(degree, number)
                }
              }else if (degree.search("teacher") > 0) {
                var teacherStats = (category == 'percent') ? teacherTextPercent[number] : teacherTextNumber[number]
                return "In 2015, " + format(text) + description(degree, number) + " " + teacherStats
              }else {
              return "In 2015, " + format(text) + description(degree, number)
              }
             // return (category == 'percent') ? teacherTextPercent[0] : teacherTextNumber[0]
            })
            .attr("dy", 0)
            .call(wrapText, width*.7)

          var textRect = d3.select(".teacherStatsPhone-text-" + HEADERS2[number]).node().getBoundingClientRect()
          yLabelG.select(".teacherStatRect-" + number)
            .attr("width", textRect.width*1.1)
            .attr("height", textRect.height*1.2)
          d3.select(".teacherStatsPhoneG-" + number).classed("showText", true)

          
        }else {
          var selectedNode = d3.select(".node-" + HEADERS2[number] + node).datum()
          var text  = d3.select(".node-" + HEADERS2[number] + node).datum().value
          statsSvg.text(function() { 
            if (text == 1) {
              return ""
            }else if ((category != 'percent') && (selectedNode.name == HEADERS2[number])) { 
              return "There were " + format(text) + " adults ages 25–34 in 2015."
            }else if (dataCategory != 'all' && category !='percent' && selectedNode.name == HEADERS2[number] + "-Bach") { 
              return "There were " + format(text) + description(degree, number)
            }else { 
              return "In 2015, " + format(text) + description(degree, number)
            }
          })
        }
      }
    }

    d3.selectAll(".toggle_button")
      .on("click", function(){
          // var category = d3.select(".toggle_button.active").node().id.split("_")[0]
          d3.selectAll(".toggle_button.active").classed("active",false)
          d3.select(this).classed("active",true)
          category = this.id.split("_")[0]
          var linkData = (category == "numbers") ? graph_number : graph_percent;
          update(graph.nodes, linkData);
      })

    
    function update(nodeData, linkData) {
     if (isPhone) {
      d3.selectAll(".teacherStatsPhoneG").classed("showText", false)
     }
      // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
      sankey
        .nodes(nodeData)
        .links(linkData)
        .layout(32);
      yLabelG.selectAll(".linkTextPhone")
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
        .on('end', function(d) {
          //TRANSITION DATA LABELS AND RACE LABELS
          if ((d.name).search("White-Teacher")> -1){
            transitionTeacherText()
          }
          if (isPhone){
            for (j=0; j<nodeCategories.length; j++){
              for (i=0; i<HEADERS2.length; i++){
                var yPos = (function(){
                  if (dataCategory == 'all') { 
                    return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top + 10
                  }
                  else if (dataCategory != 'all') { 
                    if (container_width < 350) {
                      return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top - 10
                    }else {
                    return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top + 10
                    }
                  }
                })
                ();
                yLabelG
                  .data(linkData.filter(function(d) { 
                    return (d.target.name) == HEADERS2[i] + nodeCategories[j]
                  }))
                d3.selectAll(".linkTextPhone-" + HEADERS2[i] + nodeNames[j])
                  .each(function() {
                    d3.select(this).select(".linkTextPhone-stats")
                      .text(function(d) { 
                        if (d.target.name == HEADERS2[i] + "-Teacher") {
                          return " " + linkTextFormat(d.target.value)
                        }else { 
                          return " " + linkTextFormat(d.value)
                        }
                      })   
                      .attr("y", yPos)
                    d3.select(this).select(".linkTextPhone-stats-category-rect")
                      .attr("y", yPos + 3)
                   d3.select(this).select(".linkTextPhone-stats-category")  
                      .attr("y", yPos)
                    yLabelG.select(".linkTextPhone-" + HEADERS2[i] + nodeNames[j]).select(".linkTextPhone-race")
                      .attr("y", yPos)
                  })
              }
            }
            //TRANSITION DESCRIPTION LABELS
            for (i=0; i<HEADERS2.length; i++) {
              var yPos = (function(){
                if (dataCategory == 'all') { 
                  return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top- 140
                }
                else if (dataCategory != 'all') { 
                  if (container_width < 350) {
                    return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top - 163
                  }else {
                  return d3.select(".node-" + HEADERS2[i]).node().getBoundingClientRect().top- 140
                  }
                }
              })
              ();     
              var textRect = d3.select(".linkTextPhone-race-" + HEADERS2[i]).node().getBoundingClientRect()
              d3.selectAll(".teacherStatsPhoneG-" + i) 
                .attr("transform", function() { 
                    return (dataCategory == 'all') ? "translate("+ width * .2 +","+ (yPos ) +")" : "translate("+ width * .325 +","+ (yPos ) +")"
                })  
            }

          }
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
              if ((d.target.name).search("White") == 0) {
                return (category == 'percent') ? d.target.y + (d.target.dy) -4 :  d.target.y + (d.target.dy) -8
              }
              return (category == 'percent') ? d.target.y + (d.target.dy) -4 :  d.target.y + (d.target.dy) -2
            }else {
              return (category == 'percent') ? d.target.y + (d.target.dy/2) + 5 : d.target.y + (d.target.dy/2) + 5
            }
          }
          else{
            if ((d.target.name).search("Teaching") > 0) {
              if ((d.target.name).search("White") == 0) {
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
            // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
            return (category == 'percent') ? teacherTextPercent[i] : teacherTextNumber[i]
          })
          .call(wrapText, wrapWidthDescription)
      }


    };

    function transitionTeacherText() { 
          for (i=0; i<4; i++){ 

      // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
        var teacherNode = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").node();
        var translateXPercent = (dataCategory == 'all') ? -width*.02 : width*.05
        var translateXNumber = (dataCategory == 'all') ? -width*.02 : width*.05
        var translateX = (category == 'percent') ? translateXPercent : translateXNumber;
        var translateYPercent = (dataCategory == 'all') ? 7 :13 //-width * .3 : -width*.26
        var translateYNumber = (dataCategory == 'all') ? 18 : 14
        var translateY = (category == 'percent') ? translateYPercent : translateYNumber
        var teacherNodeX = (dataCategory == 'all') ? (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left)/2 + teachingNode.getBoundingClientRect().right : (teacherNode.getBoundingClientRect().left - teachingNode.getBoundingClientRect().left) + teachingNode.getBoundingClientRect().right
        var teacherNodeData = d3.select(".node-" + HEADERS2[i] + "-Teacher rect").data()[0];
        var teachingNodeData = d3.select(".node-" + HEADERS2[i] + "-Teaching rect").data()[0]
        var teacherNodeY = teacherNodeData.y;
        teacherSubTextG.select(".teacherSubG1-" + HEADERS2[i])
          .attr("transform", function() { 
            if (isPhone) {
              return "translate(" + (teacherNodeX-20) + "," + (teacherNodeY + translateY + 5)+ ")";
            }else { 
               if ((i == 0) && category != 'percent'){
                return "translate(" + (teacherNodeX) + "," + (teacherNodeY + -translateYNumber*1.7) + ")";
              }else {
                return (category == 'percent') ? "translate(" + (teacherNodeX) + "," + (teacherNodeY - translateYPercent) + ")" : "translate(" + (teacherNodeX) + "," + (teacherNodeY - translateYNumber/3) + ")";
              }
            }
          })      


        teacherSubTextG.select(".teacherSubG2-" + HEADERS2[i])
          .attr("transform", function() { 
            if (isPhone) {
              return "translate(" + (teacherNodeX-20) + "," + (teacherNodeY + translateY + 5)+ ")";
            }else { 
              if ((i == 0) && category != 'percent'){
                return "translate(" + (teacherNodeX) + "," + (teacherNodeY + translateYNumber*2.7) + ")";
              }else {return (category == 'percent') ? "translate(" + (teacherNodeX) + "," + (teacherNodeY + translateYPercent + 8) + ")" : "translate(" + (teacherNodeX) + "," + (teacherNodeY + translateYNumber) + ")";
              }
            }
          })

        teacherSubTextG.selectAll("text.teacherSubTextG1-" + HEADERS2[i])
              .text(function() { 
                // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
                return (category == 'percent') ? teacherSubTextPercentTop[i] : teacherSubTextNumberTop[i]
              })

        teacherSubTextG.selectAll("text.teacherSubTextG2-" + HEADERS2[i])
          .text(function() {
            // var category =  d3.selectAll(".toggle_button.active").attr("id").split("_")[0];
            return (category == 'percent') ? teacherSubTextPercentBottom[i] : teacherSubTextNumberBottom[i]
          })
          // .attr("transform", function() {
          //   if (isMobile) {
          //     return "translate(" + (teacherNodeX-20) + "," + (teacherNodeY + translateY + 5)+ ")";
          //   }else { 
          //     return (category == 'percent') ? "translate(" + (teacherNodeX) + "," + (teacherNodeY - translateYPercent) + ")" : "translate(" + (teacherNodeX) + "," + (teacherNodeY - translateYNumber) + ")";
          //   }
          // })
        }
      }
  });
  }

// drawGraph(container_width)

// $(window).on('resize', function () {
//       var container_width = parseFloat(d3.select("#chart").style("width"))
//       var category = 'percent'
//       drawGraph(container_width, category)
// });


 var pymChild = new pym.Child({ renderCallback: drawGraph, polling: 500 });

