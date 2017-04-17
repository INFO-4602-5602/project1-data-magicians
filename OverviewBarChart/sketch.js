
var fileName = "overviewData.csv"
var data;

var numGraphs = 3;
var numMarkets;
  
var verticalMargin;
var horizontalMargin;
var spaceBetweenGraphs;
var spaceBetweenBars;
var barWidth;
  
var graphLength;
var graphWidth;

var barColors = ['#ff00ff','#99ff33','#00ccff'];
var barColumns = ['medianProfit','medianBuildingCost','medianProximity'];

function preload() {
  data = loadTable(fileName, "csv", "header");
}

function setup() {
  createCanvas(1000,600);
  background(100);
  
  //set sizes to be interactive with window size
  verticalMargin = height/6;
  horizontalMargin = width/8;
  spaceBetweenGraphs = (height-2*height/6)/20;
  graphHeight = (height-2*height/6-spaceBetweenGraphs*2)/3;
  graphWidth = width-2*width/8;
  spaceBetweenBars = graphWidth/20;
  barWidth = (graphWidth-spaceBetweenBars*4)/3;
  
  numMarkets = data.getColumn('Market').length;
  
}

function draw() {
  
  var lineY = [verticalMargin,verticalMargin+graphHeight];
  for(i=0; i<numGraphs; i++){
    //make lines for axes
    strokeWeight(1);
    stroke(0);
    line(horizontalMargin,lineY[0],horizontalMargin,lineY[1]);
    line(horizontalMargin,lineY[1],horizontalMargin+graphWidth,lineY[1]);
    
    //draw bars
    var vals = data.getColumn(barColumns[i]);
    var rectX = [horizontalMargin+spaceBetweenBars,
                 horizontalMargin+spaceBetweenBars+barWidth];
    for(j=0; j<numMarkets; j++){
      var val = map(vals[j],0,max(vals),lineY[1],lineY[0])
      fill(barColors[j]);
      noStroke();
      rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val)

      //update bar locations
      rectX[0] = rectX[1]+spaceBetweenBars;
      rectX[1] = rectX[1]+spaceBetweenBars+barWidth;
    }
    //update line and bar locations
    lineY[0] = lineY[1]+spaceBetweenGraphs;
    lineY[1] = lineY[1]+spaceBetweenGraphs+graphHeight;
  }
}

