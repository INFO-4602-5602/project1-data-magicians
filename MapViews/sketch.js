var counter = 0;

// variables for images
var mapimg_De;
var maping_At;
var maping_Da;
var clon_De = -104.99;
var clat_De = 39.73;
var clon_At = -84.3880;
var clat_At = 33.7490;
var clon_Da = -96.7970;
var clat_Da = 32.7767;
var clon;
var clat;
var ww = 256*7/4;
var hh = 256*7/4;
var zoom_De = 8.5;//8.5;
var zoom_At = 8.2;
var zoom_Da = 7.8;
var zoom;
var access = 'pk.eyJ1IjoibGlmaSIsImEiOiJjajFjeTE1b3kwMGQyMnFwbWp6NW40NTUxIn0.BYl1Zq_s7wKPFdNBu0WpYg';
var clonNames = [clon_De,clon_At,clon_Da];
var clatNames = [clat_De,clat_At,clat_Da];
var zoomNames = [zoom_De,zoom_At,zoom_Da];

// variables for data
var atlantaFile = 'atlantaMin.csv';
var denverFile = 'denverMin.csv';
var dallasFile = 'dallasMin.csv';
var denver;
var atlanta;
var dallas;
var marketData;
var lats;
var lons;
var onoffNetwork;
var cost;
var profit;
var proximity;
var oppClosed;
var statusData;
var markets = ['Denver','Atlanta','Dallas'];
var market;
var originalMaxProfit = 500000;
var maxProfit = 500000;
var originalMinProfit = 0;
var minProfit = 0;
var originalMaxCost = 600000;
var maxCost = 600000;
var originalMinCost = 0;
var minCost = 0;
var maxProximity;
var nonCustomers = [];

// variables for maps & spacing
var mapSize = 256*7/4;
var mapImageSize = mapSize/2.5;
var verticalSpaceBetweenMaps;
var horizontalSpaceBetweenMaps;
var overviewSpace = 200;
var detailSpace = 200;
var mapCenterXs;
var mapCenterYs;
var markName = ['D E N V E R','A T L A N T A','D A L L A S'];
var originalEdgeLat = [];
var originalEdgeLon = [];
var smallMapLeftX;
var smallMapRightX; 
var smallMapTopY;
var smallMapBottomY;
var fontRegular;

// variables for interaction
var isOverMap = false;
var locked = false;
var xOffset = 0;
var yOffset = 0;
var onDot = false;
var onDoti = [];
var onMapj;
var checkBox = [true,false,false,false,false];
var clickedBox = false;
var isOverBox = false;
var boxi = [false,false,false,false,false];
var sliderX;
var sliderYs;
var sliderYsInitial;
var originalSliderYs;
var sliderWidth = 15;
var sliderHeight = 10;
var isOverSlider = false;
var onSlideri;
var overView = true;
var mapView = false;
var box4Counter;
var sliderLocked = false;

// variables for pie charts
var pieColors = [['rgb(182,0,203)','rgb(137,44,148)',
                 'rgb(114,0,127)','rgb(191,84,203)',
                 'rgb(68,0,76)','rgb(136,0,203)'],
                 ['rgb(79,255,126)','rgb(39,203,78)',
                 'rgb(2,255,70)','rgb(25,127,53)',
                 'rgb(2,204,56)','rgb(2,127,70)'],
                 ['rgb(127,0,26)','rgb(255,76,113)',
                 'rgb(255,0,52)','rgb(127,38,57)',
                 'rgb(204,0,42)','rgb(255,61,34)']];
var mouseAngle = 0, pieDelta = 0, hover = 0;
var pieCenterX;
var verticalDetailSpace = 100;
var pieDiameter = 130;
var spaceBetweenPieCenters;
var pieCenterYs = [];
var pieSectionLabels = [[],[],[]];
var pieDecimalData = [[],[],[]];
var pieLabels = ['Industry','Product Group','Building Type'];
var pieCounter;
var checkBox4zoom;
var checkBox4clat;
var checkBox4clon;
var checkBox4zero;
var checkBox4one;
var checkBox4min;
var checkBox4max;

//pie chart read in data
var buildData;
var industryData;
var productData;

var pieDictInd = {};
var pieDictProd = {};
var pieDictBuildType = {};

// variables for bar charts
var overviewFile = "overviewData.csv";
var onNetFile = "onNetData.csv";
var numGraphs = 2;
var numMarkets;
var widthScreen;
var heightScreen;
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
// var barColors = ['#ff00ff','#99ff33','#00ccff'];
var barColors = [['#004dff','#0c89e8','#0dd6ff'],
                 ['#e8620c','#ff8700','#ffa608']];
// var rgbColors = [[255, 179, 255],[218, 255, 179],[179, 240, 255]];
var graphTitle = "MEDIAN VALUES";
var onNetworkBool = false;
//var onBar = false;
var prevVals;
var prevVal;
var onAvg = false;
var avgClicked = true;
var onMed = false;
var medClicked = false;
var onSum = false;
var sumClicked = false;
var maxYValues = [[30000,45000],[30000,30000],[190000000,210000000]];
var maxValNum = 0;
var mouseOnBar = false;
var mouseOverBarNum;


function preload() {
  denver = loadTable(denverFile, "csv", "header");
  atlanta = loadTable(atlantaFile, "csv", "header");
  dallas = loadTable(dallasFile, "csv", "header");
  marketData = [denver,atlanta,dallas];
  
  overviewData = loadTable(overviewFile, "csv", "header");
  onNetData = loadTable(onNetFile, "csv", "header");
  
  // pull images from mapbox for each city (512 x 512px)
  mapimg_De = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon_De + ',' + clat_De + ',' + zoom_De + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
  mapimg_At = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon_At + ',' + clat_At + ',' + zoom_At + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
  mapimg_Da = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon_Da + ',' + clat_Da + ',' + zoom_Da + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
  
  fontRegular = textFont("Georgia");

}

function setup() {
  createCanvas(1200,700);
  background(125);
  
  // set spacing
  verticalSpace = ((height-mapSize)*3/5);
  horizontalSpace = (width-overviewSpace-detailSpace-mapSize)*3/4;
  mapCenterX = overviewSpace+horizontalSpace+mapSize/2;
  mapCenterY = verticalSpace+mapSize/2;
  mapTextX = overviewSpace+horizontalSpace+mapSize;
  mapTextY = verticalSpace-verticalSpace/6;
  sliderX = overviewSpace+horizontalSpace+mapSize+(width-overviewSpace-detailSpace-horizontalSpace-mapSize)/4.7;
  sliderYsInitial = [verticalSpace+mapSize/6, verticalSpace+mapSize-mapSize/6];
  sliderYs = [verticalSpace+mapSize/6, verticalSpace+mapSize-mapSize/6];
  originalSliderYs = [verticalSpace+mapSize/6, verticalSpace+mapSize-mapSize/6];
  sliderLineYs = [verticalSpace+mapSize/6, verticalSpace+mapSize-mapSize/6];
  
  // small map coords           
  smallMapLeftX = overviewSpace+(horizontalSpace-mapImageSize)/2;
  smallMapRightX = overviewSpace+(horizontalSpace-mapImageSize)/2+mapImageSize; 
  smallMapTopY = verticalSpace+mapSize-mapImageSize;
  smallMapBottomY = verticalSpace+mapSize;
               
  // get min/max lat/long for each market
  for(i=0; i<3; i++) {
    var centerX = mercX(clonNames[i], zoomNames[i]);
    var centerY = mercY(clatNames[i], zoomNames[i]);
    originalEdgeLat[i] = invMercY(-mapSize/2.5,zoomNames[i],centerY);
    originalEdgeLon[i] = invMercX(-mapSize/2.5,zoomNames[i],centerX);
  }

  // pie chart locations
  spaceBetweenPieCenters = (height-verticalDetailSpace)/3;
  pieCenterYs = [verticalDetailSpace+spaceBetweenPieCenters/3,
                 verticalDetailSpace+spaceBetweenPieCenters+spaceBetweenPieCenters/3,
                 verticalDetailSpace+spaceBetweenPieCenters*2+spaceBetweenPieCenters/3];
  pieCenterX = (width-detailSpace)+detailSpace/2+(detailSpace-pieDiameter)/4;

  // values for bar charts
  numMarkets = overviewData.getColumn('Market').length;

}

function draw() {
  
  if(overView){
    // bar chart locs
    widthScreen = 1200;
    heightScreen = 700;
    verticalMargin = height/12;
    horizontalMargin = width/8;
    yAxisLabel = horizontalMargin/4
    spaceBetweenGraphs = (height-2*height/6)/5;
    graphHeight = (height/3);
    graphWidth = width-2*width/6;
    spaceBetweenBars = graphWidth/20;
    barWidth = (graphWidth-spaceBetweenBars*4)/3;
    
    // draw graph title
    background(75);
    fill(200);
    textSize(35);
    textAlign(CENTER);
    textStyle(NORMAL);
    noStroke();
    // text(graphTitle, widthScreen/2.2, heightScreen - (heightScreen/1.07));
    text('Prospective Customers Across Markets', 
        widthScreen/2.2, heightScreen - (heightScreen/1.07))
  	
    var lineY = [verticalMargin+15,verticalMargin+graphHeight]; 
  
    //intialize filter boxes
    filterAvg();
    filterMedian();
    filterSum();
    
    filterNetworkStatus();
      
    for(i=0; i<numGraphs; i++){
      // initialize the bar titles
      textSize(14);
      noStroke();
      fill(200);
      
  	  if (i==1){
        textAlign(CENTER,CENTER);
    	  textSize(22);
    	  textStyle(NORMAL);
        text('DENVER', horizontalMargin+spaceBetweenBars+barWidth/2, 
             lineY[1] + 30);
        text('ATLANTA', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, 
             lineY[1] + 30);
        text('DALLAS', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, 
             lineY[1] + 30);
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
      stroke(200);
      line(horizontalMargin,lineY[0],horizontalMargin,lineY[1]);
      line(horizontalMargin,lineY[1],horizontalMargin+graphWidth,lineY[1]);
      
  	  //draw bars and implement interaction
      var vals = overviewData.getColumn(barColumns[i]);
  	  var networkVals = onNetData.getColumn(networkColumns[i]);
      var rectX = [horizontalMargin+spaceBetweenBars,
                   horizontalMargin+spaceBetweenBars+barWidth];
      
    	//add graph ticks
    	strokeWeight(1);
    	stroke(200);
    	line(horizontalMargin-5,lineY[1],horizontalMargin,lineY[1]);
    	line(horizontalMargin-5,lineY[0],horizontalMargin,lineY[0]);
    	noStroke();
    	textStyle(NORMAL);
    	textSize(16);
    	textAlign(RIGHT,CENTER);
      text('$0',horizontalMargin-15,lineY[1]);
    	text("$"+nfc(maxYValues[maxValNum][i]),horizontalMargin-15,lineY[0]+5);
        
      for(j=0; j<numMarkets; j++){
        var val = map(vals[j],0,maxYValues[maxValNum][i],lineY[1],lineY[0]);
  	    var netVal = map(networkVals[j],0,maxYValues[maxValNum][i],lineY[1],lineY[0]);

    	  //draw rectangle
    	  fill(barColors[i][j]);
    	  noStroke();
    	  rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
    	  mouseOverBar(rectX[0], rectX[1], val, lineY[1],j);
    	  if(mouseOnBar && mouseOverBarNum === j){
    		    strokeWeight(4);
    		    stroke(230);
    		    noFill();
    		    rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
    	  }
    	  if ((mouseX > rectX[0]) && (mouseX < rectX[1]) && 
    	      (mouseY > val) && (mouseY < lineY[1])) {
    	    //mouseOnBar = true;
    	    if(mouseIsPressed){
    	      market = j;
    	      mapView = true;
    	      overView = false;
    	      counter=-1;
    	    }
    		  // make hover box
    		  noStroke();
    		  fill(200);
  	  	  rect(mouseX+10, mouseY+10, vals[j].length*12, 20);
    		  textSize(13);
    		  fill(50);
    		  textAlign(LEFT);
    		  textStyle(NORMAL);
    		  text(nfc("$"+vals[j]),mouseX+20,mouseY+25);
    		  // if (i==1){
    		  // 	mapPrevious(i-1,j,lineY,rectX);}
    		  // else if (i==0){
    			 // mapAfter(i+1,j,lineY,rectX);
  		    // }
  	    }
  	   // else {
  	   //   mouseOnBar = false;
  	   // }

  	  if (onNetworkBool == true){
  		  fill(255,130);//rgbColors[j]);
  		  noStroke();
  		  rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
  		  // push();
  		  if ((mouseX > rectX[0]) && (mouseX < rectX[1]) && 
  		      (mouseY > val) && (mouseY < lineY[1])){
  		    if(mouseIsPressed){
    	      market = j;
    	      mapView = true;
    	      overView = false;
    	      counter=-1;
    	    }
  			  strokeWeight(4);
  		  	stroke(255);
  			 // fill(rgbColors[j]);
  			  noFill();
  			  rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
  			  noStroke();
  			  fill(255);
  			  rect(mouseX+10, mouseY+10, (vals[j].length+networkVals[j].length)*10, 20);
  			  textSize(13);
  			  fill(100);
  			  textAlign(LEFT);
  		  	textStyle(NORMAL);
  		  	text('$'+nfc(vals[j])+ ', $' +nfc(networkVals[j]),mouseX+20,mouseY+25);
  			 // mapPrevious(i-1,j,lineY,rectX);
  		  }
  		  //rect(rectX[0],netVal,rectX[1]-rectX[0],lineY[1]-1-netVal);
  		  // pop();
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
  
  if(mapView){
  // draw background rectangles
  background(125);
  noStroke();
  fill(100);
  rect(0,0,width-detailSpace,height);
  fill(75);
  rect(0,0,overviewSpace,height);
  
  // draw small graphs
  // reset values based on new space
  widthScreen = overviewSpace;
  verticalMargin = height/12;
  horizontalMargin = widthScreen/4;
  yAxisLabel = horizontalMargin/2
  spaceBetweenGraphs = (height-2*height/6)/5;
  graphHeight = (height/3);
  graphWidth = widthScreen-2*widthScreen/6;
  spaceBetweenBars = graphWidth/20;
  barWidth = (graphWidth-spaceBetweenBars*4)/3;
  lineY = [verticalMargin+15,verticalMargin+graphHeight];

  for(i=0; i<numGraphs; i++){
    // initialize the bar titles
    textSize(14);
    noStroke();
    fill(200);
  
    if (i==1){
      textAlign(CENTER,CENTER);
      textSize(9);
      textStyle(NORMAL);
      text('DENVER', horizontalMargin+spaceBetweenBars+barWidth/2, 
           lineY[1] + 30);
      text('ATLANTA', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, 
           lineY[1] + 30);
      text('DALLAS', horizontalMargin+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth+spaceBetweenBars+barWidth/2, 
           lineY[1] + 30);
    }
    
    if (i==0){
      push();
      translate(yAxisLabel,heightScreen/4);
      fill(200);
      rotate(-PI/2);
      textAlign(CENTER,CENTER);
      textSize(14);
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
      textSize(14);
      textStyle(NORMAL);
      text('NET PRESENT VALUE',0,0);
      pop();	
    }
        
    //make lines for axes
    strokeWeight(1);
    stroke(200);
    line(horizontalMargin,lineY[0],horizontalMargin,lineY[1]);
    line(horizontalMargin,lineY[1],horizontalMargin+graphWidth,lineY[1]);
    
    //draw bars and implement interaction
    var vals = overviewData.getColumn(barColumns[i]);
    var rectX = [horizontalMargin+spaceBetweenBars,
                 horizontalMargin+spaceBetweenBars+barWidth];
      
    for(j=0; j<numMarkets; j++){
      var val = map(vals[j],0,maxYValues[maxValNum][i],lineY[1],lineY[0]);
  
      //draw rectangle
      fill(barColors[i][j]);
      noStroke();
      rect(rectX[0],val,rectX[1]-rectX[0],lineY[1]-1-val);
    
      //update bar locations
      rectX[0] = rectX[1]+spaceBetweenBars;
      rectX[1] = rectX[1]+spaceBetweenBars+barWidth;
    }
    
    //update line and bar locations
    lineY[0] = lineY[1]+spaceBetweenGraphs;
    lineY[1] = lineY[1]+spaceBetweenGraphs+graphHeight;
  }
  
  // draw back arrow
  noStroke();
  if((mouseX>overviewSpace-15) && (mouseX<overviewSpace) && (mouseY>35) && (mouseY<55)){
    fill(200);
    if(mouseIsPressed){
      overView = true;
      mapView = false;
    }
  }
  else{
    fill(100);
  }
  triangle(overviewSpace,30,overviewSpace,60,overviewSpace-20,45);
  
  // draw picture
  if(markets[market] === 'Denver'){
    imageMode(CORNER);
    image(mapimg_De,smallMapLeftX,smallMapTopY,mapSize/2.5,mapSize/2.5);
    if(counter === 0){
      clon = clon_De;
      clat = clat_De;
      zoom = zoom_De;
      sliderYs = sliderYsInitial;
    }
  }
  
  if(markets[market] === 'Atlanta'){
    imageMode(CORNER);
    image(mapimg_At,smallMapLeftX,smallMapTopY,mapSize/2.5,mapSize/2.5);
    if(counter === 0){
      clon = clon_At;
      clat = clat_At;
      zoom = zoom_At;
      sliderYs = sliderYsInitial;
    }
  }
  
  if(markets[market] === 'Dallas'){
    imageMode(CORNER);
    image(mapimg_Da,smallMapLeftX,smallMapTopY,mapSize/2.5,mapSize/2.5);
    if(counter === 0){
      clon = clon_Da;
      clat = clat_Da;
      zoom = zoom_Da;
      sliderYs = sliderYsInitial;
    }
  }
  
  // draw rectangle on image to track where map is
  strokeWeight(1);
  stroke(200);
  noFill();
  var centerX = mercX(clon, zoom);
  var centerY = mercY(clat, zoom);
  var topEdgeLat = invMercY(-mapSize/2.5,zoom,centerY);
  var leftEdgeLon = invMercX(-mapSize/2.5,zoom,centerX);
  var rightEdgeLon = invMercX(mapSize/2.5,zoom,centerX);
  var edgeLocY = map(topEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
  var leftEdgeLocX = map(leftEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
  var rightEdgeLocX = map(rightEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
  var edgeLength = rightEdgeLocX - leftEdgeLocX;
  rect(leftEdgeLocX,edgeLocY,edgeLength,edgeLength);
  
  // draw rectangles for edge of map
  strokeWeight(1);
  stroke(200);
  fill(85);
  rect(overviewSpace+horizontalSpace,verticalSpace,
       mapSize,mapSize);
  
  // draw slider bars
  line(sliderX,sliderLineYs[0],sliderX,sliderLineYs[1]);
  fill(200);
  isOverSlider = mouseOverASlider();
  for(i=0; i<2; i++){
    if((mouseX>sliderX-sliderWidth/2) && (mouseX<sliderX+sliderWidth/2) && 
       (mouseY>sliderYs[i]) && (mouseY<sliderYs[i]+sliderHeight)){
      stroke(75);
      onSlideri = i;
    }
    else {
      noStroke();
    }
    rect(sliderX-sliderWidth/2,sliderYs[i],sliderWidth,sliderHeight);
  }
  fill(200);
  noStroke();
  textSize(12);
  textStyle(NORMAL);
  if(checkBox[0]){
    var showTextMin = minProfit;
    var showTextMax = maxProfit;
  }
  else if(checkBox[1]){
    var showTextMin = minCost;
    var showTextMax = maxCost;
  }
  textAlign(LEFT,CENTER);
  text("$"+nfc(showTextMax), sliderX+sliderWidth/2+4, sliderYs[0]+sliderHeight/2);
  text("$"+nfc(showTextMin), sliderX+sliderWidth/2+4, sliderYs[1]+sliderHeight/2);
       
  // boxes for filters on map
  var boxSize = 20;
  var boxesX = overviewSpace+horizontalSpace*5/6-boxSize;
  var boxesYs = [verticalSpace,
                 (height-((height-verticalSpace-mapSize)+mapImageSize+verticalSpace))/5+verticalSpace-10,
                 (height-((height-verticalSpace-mapSize)+mapImageSize+verticalSpace))*2/5+verticalSpace,
                 (height-((height-verticalSpace-mapSize)+mapImageSize+verticalSpace))*3/5+verticalSpace-10,
                 (height-((height-verticalSpace-mapSize)+mapImageSize+verticalSpace))*4/5+verticalSpace];
  var checkBoxLabels = ['NET PRESENT VALUE','BUILDING COST','On Network','Open Opportunity','Details of Selection'];
  for(i=0; i<boxesYs.length; i++){
    stroke(200);
    isOverBox = mouseOverBox(boxesX,boxesYs[i],boxSize);
    if(isOverBox){
      boxi[i] = true;
      strokeWeight(2);
      fill(0,100);
      if(mouseIsPressed){
        if(checkBox[i] && (i>1)){
          checkBox[i] = false;
        }
        else if(!checkBox[i] && (i>1)){
          checkBox[i] = true;
          if(checkBox[4]){
            box4Counter = counter;
          }
        }
        else if(!checkBox[i] && (i<=1)){
          if(i===0){
            checkBox[0] = true;
            checkBox[1] = false;
          }
          else if(i===1){
            checkBox[1] = true;
            checkBox[0] = false;
          }
        }
      }
    }
    else{
      boxi[i] = false;
      strokeWeight(1);
      if(checkBox[0] && i===0){
        //fill(0,255,255,100);
        fill(barColors[0][market]);
      }
      else if(checkBox[1] && i===1){
        //fill(255,0,255,100);
        fill(barColors[1][market]);
      }
      else if(checkBox[4] && i===4){
        fill(50);
      }
      else {
        noFill();
      }
    }

    if(i<2){
      triangle(boxesX,boxesYs[i],boxesX,boxesYs[i]+boxSize,boxesX+boxSize,boxesYs[i]+boxSize/2);
    }
    else if(i>=2 && i<4){
      rect(boxesX,boxesYs[i],boxSize,boxSize);
    }
    else if(i===4){
      ellipse(boxesX+boxSize/2,boxesYs[i]+boxSize/2,boxSize,boxSize);
    }
    if(checkBox[i] && i>1 && i<4){
      if(i===2){
        stroke(255,255,0);
      }
      if(i===3){
        stroke(252, 118, 35)
      }
      line(boxesX,boxesYs[i],boxesX+boxSize,boxesYs[i]+boxSize);
      line(boxesX+boxSize,boxesYs[i],boxesX,boxesYs[i]+boxSize);
    }
    fill(200);
    noStroke();
    textStyle(NORMAL);
    textSize(16);
    textAlign(RIGHT,CENTER);
    text(checkBoxLabels[i], boxesX-15, boxesYs[i]+boxSize/2);
    //text("or", boxesX-15, boxesYs[0]+(boxesYs[1]-boxesYs[0])*5/7);
  }
  stroke(200);
  strokeWeight(1);
  line(smallMapLeftX,boxesYs[1]+boxSize+20,smallMapLeftX+mapImageSize,boxesYs[1]+boxSize+20);
  line(smallMapLeftX,boxesYs[3]+boxSize+20,smallMapLeftX+mapImageSize,boxesYs[3]+boxSize+20);
  
  //use web mercator equations to plot points on map
  isOverMap = mouseOverMap();
  mapGraphs(mapCenterX,mapCenterY,clon,clat,zoom)
  
  fill(200);
  textAlign(RIGHT,CENTER);
  textSize(60);
  textStyle(NORMAL);
  text(markName[market],overviewSpace+horizontalSpace+mapSize,verticalSpace/2);
  textSize(20);
  text("PROSPECTIVE CUSTOMERS",overviewSpace+horizontalSpace+mapSize,verticalSpace*4/5)

  // pie chart rendering
  if(checkBox[4]){
    
    textAlign(CENTER,CENTER);
    textSize(30);
    fill(200);
    text('Account',width-detailSpace/2,verticalDetailSpace/3);
    text('Information',width-detailSpace/2,verticalDetailSpace/3+30);
    
    if (counter === box4Counter) {

      buildData = getPieData(pieDictBuildType);
      industryData = getPieData(pieDictInd);
      productData = getPieData(pieDictProd);

      pieDictBuildType = {};
      pieDictInd = {};
      pieDictProd = {};
      
      checkBox4zoom = zoom;
      checkBox4clat = clat;
      checkBox4clon = clon;
      checkBox4zero = checkBox[0];
      checkBox4one = checkBox[1];
      if(checkBox[0]) {
        checkBox4min = minProfit;
        checkBox4max = maxProfit;
      }
      else if(checkBox[1]) {
        checkBox4min = minCost;
        checkBox4max = maxCost;
      }
    }

    pieSectionLabels[0] = industryData[0];
    pieDecimalData[0] = industryData[1];
    pieSectionLabels[1] = productData[0];
    pieDecimalData[1] = productData[1];
    pieSectionLabels[2] = buildData[0];
    pieDecimalData[2] = buildData[1];
    
    var data;
    var total;
    var piedata = [];
    for(m=0; m<pieCenterYs.length; m++){
      data = decimalToDegrees(pieDecimalData[m]);
      total = data.reduce(function(a,b){ return a+b; }, 0);
      for(var j=0,count=0;j<data.length;j++) {
          piedata.push([Math.PI * 2 * count / total, Math.PI * 2 * (count + data[j]) / total]);
          count += data[j];
      }
    }

      // draw pie charts
      var m = 0;
      for(var n=0,dx=0,dy=0;n<piedata.length;n++,dx=0,dy=0) {
        if(n<6){
          m = 0;
        }
        else if(n<12){
          m = 1;
        }
        else if(n<18){
          m = 2;
        }
        
          if(mouseX > (pieCenterX-pieDiameter/2) && mouseX < (pieCenterX+pieDiameter/2) &&
            mouseY > (pieCenterYs[m]-pieDiameter/2) && mouseY < (pieCenterYs[m]+pieDiameter/2)) {
              pieCounter = m;
          }
          if(mouseAngle >= piedata[n][0] && mouseAngle < piedata[n][1] &&
            mouseX > (pieCenterX-pieDiameter/2) && mouseX < (pieCenterX+pieDiameter/2) &&
            mouseY > (pieCenterYs[m]-pieDiameter/2) && mouseY < (pieCenterYs[m]+pieDiameter/2)) {
              dx = Math.cos((piedata[n][0] + piedata[n][1])/2) * 10;
              dy = Math.sin((piedata[n][0] + piedata[n][1])/2) * 10;
              noStroke();
              textSize(12);
              textAlign(CENTER,TOP);
              fill(200);
              text((pieSectionLabels[m][n%6]+", "+nf(pieDecimalData[m][n%6]*100,2,1)+"%"),
                  pieCenterX,pieCenterYs[m]+pieDiameter/2+15);
              stroke(200);
              strokeWeight(2);
          }
          else {
              noStroke();
          }
          fill(pieColors[m][n%6]);
          arc(pieCenterX + dx, pieCenterYs[m] + dy, pieDiameter, pieDiameter, 
              piedata[n][0], piedata[n][1], PIE);
              // console.log(piedata)
      push()
      translate((width-detailSpace)+(detailSpace-pieDiameter)/3,pieCenterYs[m]);
      textSize(20);
      textAlign(CENTER,CENTER);
      noStroke();
      fill(200);
      rotate(-PI/2);
      text(pieLabels[m],0,0);
      pop();
      }
    }

  if((zoom != checkBox4zoom) || (clon != checkBox4clon) || (clat != checkBox4clat) || 
     (checkBox4zero != checkBox[0]) || (checkBox4one != checkBox[1]) || (overView) ||
     (checkBox[0] && (checkBox4min != minProfit)) || (checkBox[0] && (checkBox4max != maxProfit)) ||
     (checkBox[1] && (checkBox4min != minCost)) || (checkBox[1] && (checkBox4max != maxCost))) {
    checkBox[4] = false;
    }
  counter += 1;
  }
}


function mapGraphs(mapCenterX,mapCenterY,clon,clat,zoom){
  onDoti = [];

  push();
  translate(mapCenterX,mapCenterY);
  // center for lat and long - for Denver
  var cx = mercX(clon, zoom);
  var cy = mercY(clat, zoom);

  var radius;
  var row;
  pieRowIndicies = [];
  for(i=0; i<marketData[market].getRowCount(); i++){
    row = marketData[market].getRow(i);
      // convert long,lat to x,y
      var lat = row.get('Lat');
      var lon = row.get('Long');
      var y = mercY(lat, zoom) - cy;
      var x = mercX(lon, zoom) - cx;

      if ((mouseX-mapCenterX <= x+2) && (mouseX-mapCenterX >= x-2) &&
         (mouseY-mapCenterY <= y+2) && (mouseY-mapCenterY >= y-2)){
        strokeWeight(2);
        stroke(255);
        radius = 20;
        onDot = true;
        onDoti.push(i);
      }
      else if (onDot && (onDoti.indexOf(i)>=0)) {
        strokeWeight(2);
        stroke(255);
        radius = 20;
      }
      else {
        noStroke();
        radius = 5;
      }
      if((x>-mapSize/2) && (x<mapSize/2) && (y>-mapSize/2) && 
         (y<mapSize/2)){
        
        if(checkBox[2]) {
          var onoffNet = row.get('NetStatus')
          if(onoffNet === 'On Zayo Network'){
            strokeWeight(1);
            stroke(255,255,0);
          }
        }
        
        if(checkBox[3]) {
          var onoffNet = row.get('isClosed')
          if(onoffNet){
            strokeWeight(1);
            stroke(255, 101, 157);
          }
        }
        
        if(checkBox[0]){
          var profit = row.get('ProfitNPV');
          profit = profit.replace(",","");
          profit = int(profit);
          if((profit>=minProfit) && (profit<=maxProfit)){
            //var val = int(map(profit,0,originalMaxProfit,0,255));
            //fill(val,255,255,150);
            if(!checkBox[2]){
              stroke(200);
              strokeWeight(0.5);
            }
            fill(barColors[0][market]);
            ellipse(x, y, radius);
            var btype = row.get('BuildingType');
                var prodRow = row.get('ProductGroup');
                var indRow = row.get('Industry');

                if (box4Counter === counter)
                {

                    if (btype in pieDictBuildType)
                    {
                        pieDictBuildType[btype] += 1;

                    }

                    else {pieDictBuildType[btype] = 1}


                    if (indRow in pieDictInd)
                    {
                        pieDictInd[indRow] += 1;

                    }

                    else {pieDictInd[indRow] = 1}



                    if (prodRow in pieDictProd)
                    {
                        pieDictProd[prodRow] += 1;

                    }

                    else {pieDictProd[prodRow] = 1}

                }
          }
        }
      
        if(checkBox[1]){
          var cost = row.get('BuildCost');
          cost = cost.replace(",","");
          cost = int(cost);
          if((cost>=minCost) && (cost<=maxCost)){
            //val = int(map(cost,0,originalMaxCost,0,255));
            //fill(255,val,255,150);
            if(!checkBox[2]){
              stroke(200);
              strokeWeight(0.5);
            }
            fill(barColors[1][market]);
            ellipse(x, y, radius);
            var btype = row.get('BuildingType')
            var prodRow = row.get('ProductGroup');
            var indRow = row.get('Industry');

            if (box4Counter === counter) {
              if (btype in pieDictBuildType) {
                pieDictBuildType[btype] += 1;
              }
              else {pieDictBuildType[btype] = 1}

              if (indRow in pieDictInd){
                pieDictInd[indRow] += 1;
              }
              else {pieDictInd[indRow] = 1}

              if (prodRow in pieDictProd){
                pieDictProd[prodRow] += 1;
              }
              else {pieDictProd[prodRow] = 1}
            }
          }
        }
    }
    
    if ((mouseX-mapCenterX <= x+2) && (mouseX-mapCenterX >= x-2) &&
         (mouseY-mapCenterY <= y+2) && (mouseY-mapCenterY >= y-2)){
        if(onDoti.length===1){
          var address = row.get('StreetAddress');
          var partsAddress = address.split(" ");
          var line1Length = partsAddress.length-3;
          var addressLine1 = "";
          var addressLine2 = "";
          for(k=0;k<line1Length;k++){
            addressLine1 += partsAddress[k]+" ";
          }
          for(k=0;k<3;k++){
            if(k===2){
              addressLine2 += partsAddress[k+line1Length];
            }
            else {
              addressLine2 += partsAddress[k+line1Length]+", ";
            }
          }
          fill(200);
          noStroke();
          rect(x+15,y-5,130,30);
          textAlign(LEFT,TOP);
          textSize(12);
          fill(0);
          text(addressLine1,x+15,y-5);
          text(addressLine2,x+15,y-5+15);
        }
      }
  }
  
  pop();
  return;
}

// equations found wikipedia for web mercator - used from https://www.youtube.com/watch?v=ZiYdOwOrGyc&t=476s - p5.js tutorial
function mercX(lon, zoom) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat, zoom) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

// inverse mercator functions to go from pixel on image to lat/long
function invMercX(x,zoom,cx) {
  var a = ((x+cx) * PI) / (256 * pow(2, zoom));
  var b = degrees(a - PI);
  return b;
}

function invMercY(y,zoom,cy) {
  var a = ((y+cy) * PI) / (256 * pow(2, zoom));
  var b = atan(exp(PI-a));
  var c = 2 * (b - (PI / 4));
  return degrees(c);
}

function mouseWheel(event){
  if(isOverMap && mapView){
    var amount = map(event.delta,-5000,5000,-5,5);
    
    // check if new lat and long edges are in range
    var centerX = mercX(clon, zoom+amount);
    var centerY = mercY(clat, zoom+amount);
    var topEdgeLat = invMercY(-mapSize/2.5,zoom+amount,centerY);
    var bottomEdgeLat = invMercY(mapSize/2.5,zoom+amount,centerY);
    var leftEdgeLon = invMercX(-mapSize/2.5,zoom+amount,centerX);
    var rightEdgeLon = invMercX(mapSize/2.5,zoom+amount,centerX);
    
    var topEdgeLocY = map(topEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
    var bottomEdgeLocY = map(bottomEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
    var leftEdgeLocX = map(leftEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
    var rightEdgeLocX = map(rightEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
    
    if((leftEdgeLocX >= smallMapLeftX) && (rightEdgeLocX <= smallMapRightX) && 
       (topEdgeLocY >= smallMapTopY) && (bottomEdgeLocY <= smallMapBottomY) && 
       ((zoom+amount) >= zoomNames[market])){
      zoom += amount;
    }
  }
  return false;
}

function mousePressed() {
  if(mapView){
    if(isOverMap){
      locked = true;
    }
    else{
      locked = false;
    }
    
    if(isOverSlider){
      sliderLocked = true;
    }
    else{
      sliderLocked = false;
    }
    
    xOffset = mouseX;
    yOffset = mouseY;
  }
}

function mouseDragged() {
  if(locked && mapView){
    var amountX = map(xOffset-mouseX,-100,100,-0.1,0.1);
    var amountY = map(yOffset-mouseY,100,-100,-0.1,0.1);
    
    // check if new lat and long edges are in range
    var centerX = mercX(clon+amountX, zoom);
    var centerY = mercY(clat+amountY, zoom);
    var topEdgeLat = invMercY(-mapSize/2.5,zoom,centerY);
    var bottomEdgeLat = invMercY(mapSize/2.5,zoom,centerY);
    var leftEdgeLon = invMercX(-mapSize/2.5,zoom,centerX);
    var rightEdgeLon = invMercX(mapSize/2.5,zoom,centerX);
    
    var topEdgeLocY = map(topEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
    var bottomEdgeLocY = map(bottomEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
    var leftEdgeLocX = map(leftEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
    var rightEdgeLocX = map(rightEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
    
    if((leftEdgeLocX >= smallMapLeftX) && (rightEdgeLocX <= smallMapRightX) && 
       (topEdgeLocY >= smallMapTopY) && (bottomEdgeLocY <= smallMapBottomY)){
      clat += amountY;
      clon += amountX;
    }
  }
  
  if(mapView && sliderLocked){
    if(onSlideri === 0){
      var checkProfit = map(mouseY,originalSliderYs[0],originalSliderYs[1],
                            originalMaxProfit,originalMinProfit);
      var checkCost = map(mouseY,originalSliderYs[0],originalSliderYs[1],
                           originalMaxCost,originalMinCost);
      if(checkBox[0] && (checkProfit>minProfit) && (checkProfit<=originalMaxProfit)) {
        maxProfit = int(checkProfit);
        sliderYs[0] = mouseY;
        maxCost = int(checkCost);
      }
      if(checkBox[1] && (checkCost>minCost) && (checkCost<=originalMaxCost)) {
        maxProfit = int(checkProfit);
        sliderYs[0] = mouseY;
        maxCost = int(checkCost);
      }
      if(mouseY<originalSliderYs[0]){
        maxProfit = originalMaxProfit;
        maxCost = originalMaxCost;
      }
    }
    else if(onSlideri === 1){
      checkProfit = map(mouseY,originalSliderYs[0],originalSliderYs[1],
                         originalMaxProfit,originalMinProfit);
      checkCost = map(mouseY,originalSliderYs[0],originalSliderYs[1],
                         originalMaxCost,originalMinCost);
      if(checkBox[0] && (checkProfit<maxProfit) && (checkProfit>=originalMinProfit)) {
        minProfit = int(checkProfit);
        sliderYs[1] = mouseY;
        minCost = int(checkCost);
      }
      if(checkBox[1] && (checkCost<maxCost) && (checkCost>=originalMinCost)) {
        minProfit = int(checkProfit);
        sliderYs[1] = mouseY;
        minCost = int(checkCost);
      }
      if(mouseY>originalSliderYs[1]){
        minProfit = originalMinProfit;
        minCost = originalMinCost;
      }
    }
    else if(onSlideri === 0 && checkBox[1]){
      var checkCost = map(mouseY,sliderYs[0],sliderYs[1],maxCost,minCost);
      if((checkCost>minCost) && (checkCost<=originalMaxCost)) {
        maxCost = int(checkCost);
        sliderYs[0] = mouseY;
      }
    }
    else if(onSlideri === 1 && checkBox[1]){
      checkCost = map(mouseY,sliderYs[0],sliderYs[1],maxCost,minCost);
      if((checkCost<maxCost) && (checkCost>=originalMinCost)) {
        minCost = int(checkCost);
        sliderYs[1] = mouseY;
      }
    }
  }
}

function mouseReleased() {
  locked = false;
}

function mouseClicked(){
	if (overView && (mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && 
	    (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && 
	    (mouseY > heightScreen/4) && (mouseY < heightScreen/4+20)){
		if (opportunityFilterBool == false){
		  opportunityFilterBool = true;
		}
	  	 else{
		  opportunityFilterBool = false;
		 }
	}
	else if (overView && (mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && 
	        (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && 
	        (mouseY > heightScreen/2+70+10) && (mouseY < heightScreen/2+70+10+20)){
		if (onNetworkBool == false){
			onNetworkBool = true;
		}
		 else{
		  onNetworkBool = false;
		}
	}
	
	if (overView && onAvg){
	  avgClicked = true;
	  sumClicked = false;
	  medClicked = false;
	}
	if (overView && onSum){
	  sumClicked = true;
	  avgClicked = false;
	  medClicked = false;
	}
	if (overView && onMed){
	  medClicked = true;
	  avgClicked = false;
	  sumClicked = false;
	}
// 	if (overView && onNetwork){
// 	  if(onNetwork){
// 	    onNetwork = false;
// 	  }
// 	  else {
// 	    networkClicked = true;
// 	  }
// 	}
}

function mouseOverMap() {
  if((mouseX>overviewSpace+horizontalSpace) && 
     (mouseX<overviewSpace+horizontalSpace+mapSize) &&
     (mouseY>verticalSpace) && 
     (mouseY<verticalSpace+mapSize) && mapView) { 
     return true;
     }
  else
    return false;
}

function mouseOverBox(boxX,boxY,boxSize) {
  if(mapView && (mouseX>boxX) && (mouseX<(boxX+boxSize)) && (mouseY>boxY) && (mouseY<(boxY+boxSize))){
    return true;
  }
  else{
    return false;
  }
}

function mouseOverASlider() {
  if(mapView && ((mouseX>sliderX-sliderWidth/2) && (mouseX<sliderX+sliderWidth/2) && 
       (mouseY>sliderYs[0]) && (mouseY<sliderYs[0]+sliderHeight)) || 
       ((mouseX>sliderX-sliderWidth/2) && (mouseX<sliderX+sliderWidth/2) && 
       (mouseY>sliderYs[1]) && (mouseY<sliderYs[1]+sliderHeight))){
         return true;
       }
  else {
    return false;
  }
}

function decimalToDegrees(dataVals){
  var dataAngles = [];
  for(i=0; i<dataVals.length; i++){
    append(dataAngles, dataVals[i]*360);
  }
  return dataAngles;
}

function mouseMoved() {
  mouseAngle = Math.PI / 2 - Math.atan((pieCenterX - mouseX) / (pieCenterYs[pieCounter] - mouseY));
  if(mouseY < pieCenterYs[pieCounter]) mouseAngle = mouseAngle + Math.PI;
}

function getPieData(dict)
{
    //takes dictionary and gives you percents with labels that share index

    var toSort = [];
    var names = [];
    var values = [];

    for (var keys in dict)
    {
        toSort.push([keys, dict[keys]]);
    }


    var sorted = toSort.sort(function(a, b) {
        return b[1] - a[1];
    });

    var sum = 0;

    //find sum for percentages

    for (var i = 0; i < sorted.length; i++)
    {
        sum += sorted[i][1];
    }

    //get top five, divide for percent
    var othersSum = 0;

    //fill in output list
    for (i = 0; i < sorted.length; i++)
    {
        if (i < 5)
        {
            names.push(sorted[i][0]);
            values.push((sorted[i][1] / sum).toFixed(3));
        }

        else if (i === 5)
        {
            names.push("Other")
            othersSum += sorted[i][1]
        }

        else
        {
            othersSum += sorted[i][1]
        }

    }
    values[5] = (othersSum / sum).toFixed(3);
    return [names, values]
}

function filterAvg(){
  stroke(200);
  strokeWeight(1);
  noFill();
  if ((mouseX > (widthScreen - horizontalMargin - (horizontalMargin/4))) && 
      (mouseX < (widthScreen - horizontalMargin - (horizontalMargin/4) + 20)) && 
      (mouseY > heightScreen/2-100) && (mouseY < heightScreen/2 -80)){
    onAvg = true;
	  if(mouseIsPressed){
	    barColumns = ['costMean', 'NPVmean'];
	    networkColumns = ['costMean', 'NPVmean'];
	    graphTitle = 'AVERAGE VALUES';
	  }
	  fill(50);
  }
  else {
    onAvg = false;
  }
  if(avgClicked){
    fill(250);
    maxValNum = 0;
  }
  triangle(widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-100,
           widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-100+20,
           widthScreen - horizontalMargin - (horizontalMargin/4),heightScreen/2-100+10);
  noStroke();
  fill(200);
  textStyle(NORMAL);
  textAlign(LEFT,CENTER);
  textSize(16);
  text('AVERAGE', widthScreen - horizontalMargin - (horizontalMargin/4)+30, heightScreen/2-100+10);
}

function filterMedian(){
  stroke(200);
  strokeWeight(1);
  noFill();
  if ((mouseX > (widthScreen - horizontalMargin - (horizontalMargin/4))) && 
      (mouseX < (widthScreen - horizontalMargin - (horizontalMargin/4) + 20)) && 
      (mouseY > heightScreen/2-50) && (mouseY < heightScreen/2-50 + 20)){
    onMed = true;
	  if(mouseIsPressed){
	    barColumns = ['costMedian', 'NPVmedian'];
	    networkColumns = ['costMedian', 'NPVmedian'];
	    graphTitle = 'MEDIAN VALUES';
	  }
	  fill(50);
  }
  else{
    onMed = false;
  }
  if(medClicked){
    fill(250);
    maxValNum = 1;
  }
  triangle(widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-50,
           widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-50+20,
           widthScreen - horizontalMargin - (horizontalMargin/4),heightScreen/2-50+10);
  noStroke();
  fill(200);
  textStyle(NORMAL);
  textAlign(LEFT,CENTER);
  textSize(16);
  text('MEDIAN', widthScreen - horizontalMargin - (horizontalMargin/4)+30, heightScreen/2-50+10);
}

function filterSum(){
  stroke(200);
  strokeWeight(1);
  noFill();
  if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && 
      (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && 
      (mouseY > heightScreen/2-50+50) && (mouseY < heightScreen/2-50+70)){
    onSum = true;
	  if(mouseIsPressed){
	    barColumns = ['costSum', 'NPVSum'];
	    networkColumns = ['costSum', 'NPVSum'];
	    graphTitle = 'TOTAL VALUES';
	  }
	  fill(50);
  }
  else {
    onSum = false;
  }
  if(sumClicked){
    fill(250);
    maxValNum = 2;
  }
  triangle(widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-50+50,
           widthScreen - horizontalMargin - (horizontalMargin/4)+20,heightScreen/2-50+50+20,
           widthScreen - horizontalMargin - (horizontalMargin/4),heightScreen/2-50+50+10);
  // rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/2+50, 20, 20);
  noStroke();
  fill(200);
  textStyle(NORMAL);
  textAlign(LEFT,CENTER);
  textSize(16);
  text('TOTAL', widthScreen - horizontalMargin - (horizontalMargin/4) + 30, heightScreen/2-50+50+10);
  stroke(200);
  strokeWeight(1);
  line(widthScreen - horizontalMargin - (horizontalMargin/4)-20,heightScreen/2-10+50+10,
       widthScreen - horizontalMargin - (horizontalMargin/4)-20+150,heightScreen/2-10+50+10)
}

function filterNetworkStatus(){
  stroke(200);
  strokeWeight(1);
  noFill();
  if ((mouseX > widthScreen - horizontalMargin - (horizontalMargin/4)) && 
      (mouseX < widthScreen - horizontalMargin - (horizontalMargin/4) + 20) && 
      (mouseY > heightScreen/2+70+10) && (mouseY < heightScreen/2+70+10+20)){
	  fill(50);
	}
	if(onNetworkBool){
    line((widthScreen - horizontalMargin - (horizontalMargin/4)),
        heightScreen/2+70+10,
        (widthScreen - horizontalMargin - (horizontalMargin/4) + 20),
        heightScreen/2+70+10+20);
    line((widthScreen - horizontalMargin - (horizontalMargin/4) + 20),
        heightScreen/2+70+10,
        (widthScreen - horizontalMargin - (horizontalMargin/4)),
        heightScreen/2+70+10+20);
  }
  rect(widthScreen - horizontalMargin - (horizontalMargin/4), heightScreen/2+70+10, 20, 20);
  textAlign(LEFT,CENTER);
  textStyle(NORMAL);
  textSize(16);
  noStroke();
  fill(200);
  text('On Network', widthScreen - horizontalMargin - (horizontalMargin/4) + 30, heightScreen/2+70+10+10);
}

function mapPrevious(i,j,lineY,rectX){
	prevVals = overviewData.getColumn(barColumns[i]);
	prevVal = map(prevVals[j],0,maxYValues[maxValNum][i],lineY[1],lineY[0]);
	strokeWeight(4);
	stroke(230);
	fill(barColors[i][j]);
	rect(rectX[0],prevVal-spaceBetweenGraphs-graphHeight,rectX[1]-rectX[0],lineY[1]-1-prevVal);
}

function mapAfter(i,j,lineY,rectX){
	prevVals = overviewData.getColumn(barColumns[i]);
	prevVal = map(prevVals[j],0,maxYValues[maxValNum][i],lineY[1],lineY[0]);
	strokeWeight(4);
	stroke(230);
	fill(barColors[i][j]);
	rect(rectX[0],prevVal+spaceBetweenGraphs+graphHeight,rectX[1]-rectX[0],lineY[1]-1-prevVal);
}

function mouseOverBar(rectX0, rectX1, Y0, Y1,j){
  if ((mouseX > rectX0) && (mouseX < rectX1) && 
    	      (mouseY > Y0) && (mouseY < Y1)) {
    mouseOnBar = true;
    mouseOverBarNum = j;
  }
}