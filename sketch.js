
var fileName = "overviewData.csv";
var data;

var numGraphs = 3;
var numMarkets;
  
var verticalMargin;
var horizontalMargin;
var spaceBetweenGraphs;
var spaceBetweenBars;
var barWidth;
var yAxisLabel;
  
var graphHeight;
var graphWidth;

var barColumns = ['medianProfit','medianBuildingCost','medianProximit'];
var barColors = ['#ff00ff','#99ff33','#00ccff'];
//var barMedianColumns = ['medianProfit','medianBuildingCost','medianProximit'];
//var barAvgColumns =
//['averageProfit','averageBuildingCost','averageProximity'];
//var barSumColumns =
//['sumProfit','sumBuildingCost','sumProximity'];

var onBar = false;

function preload() {
  data = loadTable(fileName, "csv", "header");
}

function setup() {
  createCanvas(1000,600);
  background(100);
    
  //set sizes to be interactive with window size
  verticalMargin = height/13;
  horizontalMargin = width/8;
  yAxisLabel = horizontalMargin/4
  spaceBetweenGraphs = (height-2*height/6)/5;
  graphHeight = (height-2*height/6-spaceBetweenGraphs*2)/2;
  graphWidth = width-2*width/6;
  spaceBetweenBars = graphWidth/20;
  barWidth = (graphWidth-spaceBetweenBars*4)/3;
  
  numMarkets = data.getColumn('Market').length;
  
}

function draw() {
  background(100);
  var lineY = [verticalMargin,verticalMargin+graphHeight]; 
  var tempLineY = [verticalMargin,verticalMargin+graphHeight]; 

  //intialize filter boxes
  filterAvg();
  filterMedian();
  filterSum();
    
  for(i=0; i<numGraphs; i++){
    barTicks(graphHeight,tempLineY, lineY);
      
    // initialize the bar titles
    textSize(14);  
    fill(255);
    text('Denver', horizontalMargin+spaceBetweenBars+50, lineY[1] + 15);
    text('Atlanta', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+50, lineY[1] + 15);
    text('Dallas', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth+spaceBetweenBars+50, lineY[1] + 15);
    
    if (i==0){
        text('Cost', yAxisLabel, graphHeight);
    }
    else if (i==1){
        text('Profit', yAxisLabel, graphHeight*2+spaceBetweenGraphs);
    }
    else if (i==2){
        text('Proximity', yAxisLabel, graphHeight*3+spaceBetweenGraphs*2);
    }
          
    //make lines for axes
    strokeWeight(1);
    stroke(0);
    line(horizontalMargin,lineY[0],horizontalMargin,lineY[1]);
    line(horizontalMargin,lineY[1],horizontalMargin+graphWidth,lineY[1]);
      
    //draw bars and implement interaction
    var vals = data.getColumn(barColumns[i]);
    var rectX = [horizontalMargin+spaceBetweenBars,
                 horizontalMargin+spaceBetweenBars+barWidth];
      
    for(j=0; j<numMarkets; j++){
      var val = map(vals[j],0,max(vals),lineY[1],lineY[0])
      noStroke();
      overBar(i,j,rectX,lineY,val);
      if(onBar) {
        fill(255);
        text(vals[j], rectX[0]+barWidth/2, val-5);
      }
      else{
        fill(barColors[j]);
      }
        
      rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val)
      
      //update bar locations
      rectX[0] = rectX[1]+spaceBetweenBars;
      rectX[1] = rectX[1]+spaceBetweenBars+barWidth;
    }
    
    //update line and bar locations
    lineY[0] = lineY[1]+spaceBetweenGraphs;
    lineY[1] = lineY[1]+spaceBetweenGraphs+graphHeight;
    
    //update the temp line positions for the ticks
    tempLineY[0] = lineY[1]+spaceBetweenGraphs;
    tempLineY[1] = lineY[1]+spaceBetweenGraphs+graphHeight;
    }
  }

function overBar(i,j,rectX,lineY,val){
    if((mouseX > rectX[0]) && (mouseX < rectX[1]) && (mouseY > val) && (mouseY < lineY[1])) {
        onBar = true;
        numOnGraph = i;
        numOnBar = j;
      }
    else{
        onBar = false;
    }
}

function barTicks(graphHeight, tempLineY, lineY){
    separate = graphHeight / 5;
    currentY = tempLineY[1]
    for(x=0; x<6; x++){
        strokeWeight(1);
        stroke(0);
        line(horizontalMargin-5,currentY,horizontalMargin,currentY);
        currentY = currentY - separate;
    }
}

function filterAvg(){
  
  noStroke();
  fill(255);
  push();
  if ((mouseX > 840) && (mouseX < 860) && (mouseY > 250) && (mouseY < 270) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['averageProfit','averageBuildingCost','averageProximity'];
  }
  rect(840, 250, 20, 20);
  pop();
  text('Average', 870, 265);
}
function filterMedian(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > 840) && (mouseX < 860) && (mouseY > 300) && (mouseY < 320) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['medianProfit','medianBuildingCost','medianProximit'];
  }
  rect(840, 300, 20, 20);
  pop();
  text('Median', 870, 315);
}
function filterSum(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > 840) && (mouseX < 860) && (mouseY > 350) && (mouseY < 370) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['sumProfit','sumBuildingCost','sumProximity'];
  }
  rect(840, 350, 20, 20);
  pop();
  text('Sum', 870, 365);
}
