function Chartcreation(){
  
        var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

        var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    return chartGroup;
  }

function Scalecreation(jData,axisName)
{
        var currentLinearScale = d3.scaleLinear()
        .domain([d3.min(jData, d => d[axisName]*0.9),d3.max(jData, d => d[axisName]*1.6)])
        .range([0, width])
        ;

    return currentLinearScale;
};
function Axiscreation(chartGroup,xLinearScale,yLinearScale){
    // create axes
    if (xLinearScale)
    {
        var xAxis = d3.axisBottom(xLinearScale);
        chartGroup.append("g")
        .transition()
        .duration(1000)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
        
        return xAxis;
    }
    if(yLinearScale)
    {
        var yAxis = d3.axisLeft(yLinearScale).ticks(6);;

        chartGroup.append("g")
        .transition()
        .duration(1000)
        .call(yAxis);
        
        return yAxis;
    }

}

function updateChartCircles(chartGroup,jData,currentX,currentY,xLinearScale,yLinearScale){

    var circlesGroup = chartGroup.selectAll("circle")
    .data(jData)
    
    .enter()
    .append("circle")
    //.transition()
    //.duration(1000)
    .attr("cx", d => xLinearScale(d[currentX]))
    .attr("cy", d => yLinearScale(d[currentY]))
    .attr("r", "10")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black")
    .attr("opacity", ".9");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, +60])
    .html(function(d) {
    return (`<strong>X: ${d[currentX]}<br><strong>Y: ${d[currentY]}`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d) {
      // Show the tooltip
      //console.log("mo")
      toolTip.show(d, this);
      
      // Highlight the state circle's border
      d3.select(this)
      .transition()
      .duration(50)
      .style("stroke", "#2ECCFA")
      .attr("r", 30)
      .style("fill","pink");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      //console.log("mf")
      toolTip.hide(d);
      // Remove highlight
      d3.select(this)
      .transition()
      .duration(500)
      .style("stroke", "#000")
      .attr("r", 10)
      .style("fill","gold");
    });
  
    return circlesGroup
}
  function updateText(chartGroup,jData,currentX,currentY,currentText,xLinearScale,yLinearScale){
    var TextGroup = chartGroup.selectAll()
    .data(jData)
    .enter()
    .append("text")
    .text(d => (d[currentText]))
    .attr("x", d => xLinearScale(d[currentX]))
    .attr("y", d => yLinearScale(d[currentY]))
    .style("font-size", "11px")
    .style("text-anchor", "middle")
    .style('fill', 'black')
    .attr("opacity", ".5")
    ;
  
    return TextGroup;
}
function LabelsGroupcreation(chartGroup){
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    return labelsGroup;
}
function setLabel(labelsGroup,CurrentKey,axis,i,ActiveKey){
    var CurrentKeyValue, degrees,x,y;
                    Object.entries(labelspair).forEach(([key,value])=>{
                      if (CurrentKey ==key)
                      {
                        CurrentKeyValue =value;
                      }
                    })
    if (axis=="X"){
      degrees = 0;
      x=0
      y=(i+1)*20
    }
    else{
      degrees=-90;
      x=(margin.left) * 2.5
      
      y=0 - (height - i*20);
    }
    var currentLabel = labelsGroup.append("text")
    .attr("transform", "rotate("+degrees+")")
    .attr("x", x)
    .attr("y", y)
    .attr("value", CurrentKey) // value to grab for event listener.
    .text(CurrentKeyValue);
    
    
          if (ActiveKey==CurrentKey){
              console.log("a="+ActiveKey);
                currentLabel.classed("active", true);
                currentLabel.classed("inactive", false);
          }
          else if (ActiveKey == null)
          {
              if (i==0)
                {
                  currentLabel.classed("active", true);
                  currentLabel.classed("inactive", false);
                }
              if (i==3)
                {
                  currentLabel.classed("active", true);
                  currentLabel.classed("inactive", false);
                }
            }
          else
            {
              currentLabel.classed("active", false);
              currentLabel.classed("inactive", true);
            }

  }
  
function populateLabels(labelsGroup,currentX,currentY){
    var i=0;
    Object.keys(Xlabelspair).forEach((key)=>{
      setLabel(labelsGroup,key,"X",i,currentX)
      i++
  
     });
  
  Object.keys(Ylabelspair).forEach((key)=>{
    setLabel(labelsGroup,key,"Y",i,currentY)
    i--
  });
  }

    function findObject(clickedvalue){
    var i=0;
    Object.keys(labelspair).forEach((key)=>{
      if(key==clickedvalue){
        Object.entries(iPair).forEach(([key,value])=>{
            if (key == i){
              axisI=value;
            }
        })
      }
      i++;
    })
    var j=0
    Object.keys(labelspair).forEach((key)=>{
      
      if (j==axisI){
        pairAxis=key;
       
      }
      j++;
    });
    
    return pairAxis;
    }
