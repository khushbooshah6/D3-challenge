var svgWidth = 900;
var svgHeight = 600;

  var margin = {
    top: 50,
    bottom: 100,
    right: 50,
    left: 110
  };

var labelspair={"poverty": "Poverty (%)","age":"Age (Median)","income":"Household Income (Median)","healthcare":"Lacks Healthcare (%)","smokes":"Smokes (%)","obesity":"Obesity (%)"}
var Xlabelspair ={"poverty": "Poverty (%)","age":"Age (Median)","income":"Household Income (Median)"}
var Ylabelspair={"healthcare":"Lacks Healthcare (%)","smokes":"Smokes (%)","obesity":"Obesity (%)"}
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
var currentX="poverty";
var currentY="healthcare";
var currentText = "abbr";
var currentTip="state"
var chartGroup,labelsGroup,axisI,pairAxis,jData;
var iPair={0:3,1:4,2:5,3:0,4:1,5:2}

function handeBuild(currentX,currentY){
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
      }
    console.clear();
    d3.csv("D3_data_journalism/assets/data/data.csv").then(function(jData) {    
        jData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        });
       
        
        var chartGroup = Chartcreation();
        var xLinearScale=Scalecreation(jData,currentX)
        var yLinearScale=Scalecreation(jData,currentY)
        Axiscreation(chartGroup,xLinearScale,null);
        Axiscreation(chartGroup,null,yLinearScale);
        circlesGroup=updateChartCircles(chartGroup,jData,currentX,currentY,xLinearScale,yLinearScale);
        updateText(chartGroup,jData,currentX,currentY,currentText,xLinearScale,yLinearScale);
        
        var labelsGroup=LabelsGroupcreation(chartGroup);
        populateLabels(labelsGroup,currentX,currentY)
    

        labelsGroup.selectAll("text")
        .on("click", function() {
        var clickedvalue = d3.select(this).attr("value");
        var PairAxis=findObject(clickedvalue)
        Object.keys(Xlabelspair).forEach((key)=>{
            if(clickedvalue==key)
                {

                    currentX=clickedvalue;
                    currentY=PairAxis;
                    handeBuild(currentX,currentY);
                }
        })
        Object.keys(Ylabelspair).forEach((key)=>{
            if(clickedvalue==key)
                {

                    currentY=clickedvalue;
                    currentX=PairAxis;
                    handeBuild(currentX,currentY);
                }
        })
       

    })
    });
}

handeBuild(currentX,currentY);
