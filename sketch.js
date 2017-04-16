
var fileName = "overviewData.csv";
var onNetFile = "onNetData.csv";
var data;

var numGraphs = 2;
var numMarkets;

var widthScreen = 1300;
var heightScreen = 700;
  
var verticalMargin;
var horizontalMargin;
var spaceBetweenGraphs;
var spaceBetweenBars;
var barWidth;
var yAxisLabel;
  
var graphHeight;
var graphWidth;

var barColumns = ['costMedian', 'NPVmedian'];
var networkColumns = ['costMedian', 'NPVmedian'];

var barColors = ['#ff00ff','#99ff33','#00ccff'];
var rgbColors = [[255, 179, 255],[218, 255, 179],[179, 240, 255]];

var graphTitle = "MEDIAN VALUES";
//var oppColumns = ['medianOppProf','medianOppCost','medianOppProx'];
//var opportunityFilterBool = false;

var onNetworkBool = false;

var onBar = false;
var prevVals;
var preVal;

function preload() {
  data = loadTable(fileName, "csv", "header");
  onNetData = loadTable(onNetFile, "csv", "header");
}

function setup() {
  createCanvas(widthScreen,heightScreen);
  background(100);
    
  //set sizes to be interactive with window size
  verticalMargin = height/12;
  horizontalMargin = width/8;
  yAxisLabel = horizontalMargin/4
  spaceBetweenGraphs = (height-2*height/6)/5;
  graphHeight = (height/3);
  graphWidth = width-2*width/6;
  spaceBetweenBars = graphWidth/20;
  barWidth = (graphWidth-spaceBetweenBars*4)/3;
  
  numMarkets = data.getColumn('Market').length;
  
}

function draw() {
  background(100);
  push();
  fill(255);
  textSize(35);
  textAlign(CENTER);
  textStyle(NORMAL);
  text(graphTitle, widthScreen/2.2, heightScreen - (heightScreen/1.07));
  pop();
	
  var lineY = [verticalMargin+15,verticalMargin+graphHeight]; 

  //intialize filter boxes
  filterAvg();
  filterMedian();
  filterSum();
  //filterOpportunity();
  filterNetworkStatus();
    
  for(i=0; i<numGraphs; i++){
      
    // initialize the bar titles
    textSize(14);  
    fill(255);
	if (i==1){
    push();
    textAlign(CENTER);
	textSize(22);
	textStyle(NORMAL);
    text('DENVER', horizontalMargin+spaceBetweenBars+barWidth/2, lineY[1] + 30);
    text('ATLANTA', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, lineY[1] + 30);
    text('DALLAS', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, lineY[1] + 30);
	pop();
	}
	  
    if (i==0){
		push();
     	translate(yAxisLabel,heightScreen/4);
     	fill(200);
     	rotate(-PI/2);
     	textAlign(CENTER,CENTER);
     	textSize(22);
     	textStyle(NORMAL);
     	text('BUILDING COST',0,0);
     	pop();	
    }
    else if (i==1){
		push();
     	translate(yAxisLabel,heightScreen - (heightScreen/4)-20);
     	fill(200);
     	rotate(-PI/2);
     	textAlign(CENTER,CENTER);
     	textSize(22);
     	textStyle(NORMAL);
     	text('NET PRESENT VALUE',0,0);
     	pop();	
    }
	      
    //make lines for axes
    strokeWeight(1);
    stroke(0);
    line(horizontalMargin,lineY[0],horizontalMargin,lineY[1]);
    line(horizontalMargin,lineY[1],horizontalMargin+graphWidth,lineY[1]);
	
	//add graph tick
	strokeWeight(1);
	stroke(0);
	line(horizontalMargin-5,lineY[1],horizontalMargin,lineY[1]);
	textStyle(NORMAL);
    text('0',horizontalMargin-15,lineY[1]);
	line(horizontalMargin-5,lineY[0],horizontalMargin,lineY[0]);	 
      
    //draw bars and implement interaction

    var vals = data.getColumn(barColumns[i]);
	//var oppVals = data.getColumn(oppColumns[i]);
	var networkVals = onNetData.getColumn(networkColumns[i]);
	console.log(networkVals)
    
	var rectX = [horizontalMargin+spaceBetweenBars,
                 horizontalMargin+spaceBetweenBars+barWidth];
	
	//add y axis label
	push();
	fill(255);
	textAlign(RIGHT);
	text(max(vals),horizontalMargin-15,lineY[0]+5);
	pop();
      
    for(j=0; j<numMarkets; j++){
      var val = map(vals[j],0,max(vals),lineY[1],lineY[0]);
	  //var oppVal = map(oppVals[j],0,max(vals),lineY[1],lineY[0]);
	  var netVal = map(networkVals[j],0,max(vals),lineY[1],lineY[0]);

	  //draw rectangle
	  fill(barColors[j]);
	  noStroke();
	  rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
	  push();
	  if ((mouseX > rectX[0]) && (mouseX < rectX[1]) && (mouseY > val) && (mouseY < lineY[1])){
		  strokeWeight(4);
		  stroke(255);
		  fill(barColors[j]);
		  rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
		  noStroke();
		  fill(255);
	  	  rect(mouseX+10, mouseY+10, vals[j].length*12, 20);
		  textSize(13);
		  fill(100);
		  textAlign(LEFT);
		  textStyle(NORMAL);
		  text(vals[j],mouseX+20,mouseY+25);
		  
	  }
      //rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
	  pop();
	  
//	  draw opportunity bars if it is filled
//      if (opportunityFilterBool == true){
//		  fill(rgbColors[j]);
//		  push();
//		  if ((mouseX > rectX[0]) && (mouseX < rectX[1]) && (mouseY > val) && (mouseY < lineY[1])){
//			  strokeWeight(4);
//		  	  stroke(255);
//			  textAlign(CENTER);
//		  	  textStyle(NORMAL);
//		  	  text(oppVals[j],rectX[0]+barWidth/2,oppVal-12);
//			  mapPrevious(i,j,lineY);
//		  }
//		  rect(rectX[0],oppVal,rectX[1]-rectX[0],lineY[1]-1-oppVal);
//		  pop();
//	  }
//		
	  if (onNetworkBool == true){
		  fill(rgbColors[j]);
		  noStroke();
		  rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
		  push();
		  if ((mouseX > rectX[0]) && (mouseX < rectX[1]) && (mouseY > val) && (mouseY < lineY[1])){
			  strokeWeight(4);
		  	  stroke(255);
			  fill(rgbColors[j]);
			  rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
			  noStroke();
			  fill(255);
			  rect(mouseX+10, mouseY+10, (vals[j].length+networkVals[j].length)*10, 20);
			  textSize(13);
			  fill(100);
			  textAlign(LEFT);
		  	  textStyle(NORMAL);
		  	  text(vals[j]+ ', ' +networkVals[j],mouseX+20,mouseY+25);
			  //mapPrevious(i,j,lineY);
			  
		  }
		  //rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
		  pop();
	  }
		
	  
      //update bar locations
      rectX[0] = rectX[1]+spaceBetweenBars;
      rectX[1] = rectX[1]+spaceBetweenBars+barWidth;
    }
    
    //update line and bar locations
    lineY[0] = lineY[1]+spaceBetweenGraphs;
    lineY[1] = lineY[1]+spaceBetweenGraphs+graphHeight;
    }
  }

function filterAvg(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > (widthScreen - horizontalMargin - (horizontalMargin/4))) && (mouseX < (widthScreen - horizontalMargin - (horizontalMargin/4) + 20)) && (mouseY > heightScreen/2 - 50) && (mouseY < heightScreen/2 - 30) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['costMean', 'NPVmean'];
	  networkColumns = ['costMean', 'NPVmean'];
	  graphTitle = 'AVERAGE VALUES';
  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/2 - 50, 20, 20);
  pop();
  textStyle(NORMAL);
  textAlign(LEFT);
  text('AVERAGE', widthScreen - horizontalMargin - (horizontalMargin/4) + 25, heightScreen/2-35);
}

function filterMedian(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > (widthScreen - horizontalMargin - (horizontalMargin/4))) && (mouseX < (widthScreen - horizontalMargin - (horizontalMargin/4) + 20)) && (mouseY > heightScreen/2) && (mouseY < heightScreen/2 + 20) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['costMedian', 'NPVmedian'];
	  networkColumns = ['costMedian', 'NPVmedian'];
	  graphTitle = 'MEDIAN VALUES';
  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/2, 20, 20);
  pop();
  textStyle(NORMAL);
  textAlign(LEFT);
  text('MEDIAN', widthScreen - horizontalMargin - (horizontalMargin/4) + 25, heightScreen/2+15);
}

function filterSum(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && (mouseY > heightScreen/2+50) && (mouseY < heightScreen/2+70) && (mouseIsPressed)){
	  fill(0);
	  barColumns = ['costSum', 'NPVSum'];
	  networkColumns = ['costSum', 'NPVSum'];
	  graphTitle = 'TOTAL VALUES';
  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/2+50, 20, 20);
  pop();
  textStyle(NORMAL);
  textAlign(LEFT);
  text('TOTAL', widthScreen - horizontalMargin - (horizontalMargin/4) + 25, heightScreen/2+65);
}

function filterOpportunity(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && (mouseY > heightScreen/4) && (mouseY < heightScreen/4+20) & (mouseIsPressed)){
	  fill(0);
	  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/4, 20, 20);
  pop();
  textAlign(LEFT);
  textStyle(NORMAL);
  text('OPPORTUNITY', widthScreen - horizontalMargin - (horizontalMargin/4) + 25, heightScreen/4+15);
}

function filterNetworkStatus(){
  noStroke();
  fill(255);
  push();
  if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && (mouseY > heightScreen/4-50) && (mouseY < heightScreen/4-30) && (mouseIsPressed)){
	  fill(0);
	  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/4-50, 20, 20);
  pop();
  textAlign(LEFT);
  textStyle(NORMAL);
  text('ON NETWORK', widthScreen - horizontalMargin - (horizontalMargin/4) + 25, heightScreen/4-35);
}

function mouseClicked(){
	if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && (mouseY > heightScreen/4) && (mouseY < heightScreen/4+20)){
		if (opportunityFilterBool == false){
		  opportunityFilterBool = true;
		}
	  	 else{
		  opportunityFilterBool = false;
		 }
	}
	else if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && (mouseY > heightScreen/4-50) && (mouseY < heightScreen/4-30)){
		if (onNetworkBool == false){
			onNetworkBool = true;
		}
		 else{
		  onNetworkBool = false;
		}
	}
}

function mapPrevious(i,j,lineY){
	prevVals = data.getColumn(barColumns[i]);
	prevVal = map(prevVals[j],0,max(preVal),lineY[1],lineY[0]);
	rect(rectX[0],preVal,rectX[1]-rectX[0],lineY[1]-1-preVal);
	console.log(preVal);
}

