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
var originalSliderYs;
var sliderWidth = 15;
var sliderHeight = 10;
var isOverSlider = false;
var onSlideri;
var overView = true;
var mapView = false;
var box4Counter;

// variables for pie charts
var pieColors = ['rgb(82,70,86)','rgb(207,71,71)',
                 'rgb(234,122,88)','rgb(228,220,203)',
                 'rgb(77,244,255)','rgb(25,255,205)'];
var mouseAngle = 0, pieDelta = 0, hover = 0;
var pieCenterX;
var verticalDetailSpace = 100;
var pieDiameter = 130;
var spaceBetweenPieCenters;
var pieCenterYs = [];
var industry = [0.1,0.2,0.3,0.2,0.1,0.1];
var productGroup = [0.1,0.2,0.3,0.2,0.1,0.1];
var buildingType = [0.1,0.2,0.3,0.2,0.1,0.1];
var industryLabels = ['cat1','cat2','cat3','cat4','cat5','cat6'];
var productGroupLabels = ['cat1','cat2','cat3','cat4','cat5','cat6'];
var buildingTypeLabels = ['cat1','cat2','cat3','cat4','cat5','cat6'];
var pieSectionLabels = [industryLabels,productGroupLabels,buildingTypeLabels];
var pieDecimalData = [industry,productGroup,buildingType];
var pieLabels = ['Industry','Product Group','Building Type'];
var pieCounter;
var pieDictBuildType = {};

function preload() {
  denver = loadTable(denverFile, "csv", "header");
  atlanta = loadTable(atlantaFile, "csv", "header");
  dallas = loadTable(dallasFile, "csv", "header");
  marketData = [denver,atlanta,dallas];
  
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

}

function draw() {
  
  if(overView){
    background(75);
    if((mouseX>width/2-50) && (mouseX<width/2+50) && (mouseY>height/2-20) && (mouseY<height/2+20)){
      fill(255,0,255);
      if(mouseIsPressed){
        overView = false;
        mapView = true;
      }
      else{
        fill(200);
      }
      market = 0;
    }
    textAlign(CENTER,CENTER);
    textSize(40);
    text('Bar Charts',width/2,height/2);
  }
  
  if(mapView){
  // draw background rectangles
  background(125);
  noStroke();
  fill(100);
  rect(0,0,width-detailSpace,height);
  fill(75);
  rect(0,0,overviewSpace,height);
  
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
    }
  }
  
  if(markets[market] === 'Atlanta'){
    imageMode(CORNER);
    image(mapimg_At,smallMapLeftX,smallMapTopY,mapSize/2.5,mapSize/2.5);
    if(counter === 0){
      clon = clon_At;
      clat = clat_At;
      zoom = zoom_At;
    }
  }
  
  if(markets[market] === 'Dallas'){
    imageMode(CORNER);
    image(mapimg_Da,smallMapLeftX,smallMapTopY,mapSize/2.5,mapSize/2.5);
    if(counter === 0){
      clon = clon_Da;
      clat = clat_Da;
      zoom = zoom_Da;
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
  var checkBoxLabels = ['PROFIT','COST','On Network','Open Opportunity','Details of Selection'];
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
        fill(0,255,255,100);
      }
      else if(checkBox[1] && i===1){
        fill(255,0,255,100);
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
    text("or", boxesX-15, boxesYs[0]+(boxesYs[1]-boxesYs[0])*5/7);
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

  if(checkBox[4]){
    
    textAlign(CENTER,CENTER);
    textSize(30);
    fill(200);
    text('TOP 5',width-detailSpace/2,verticalDetailSpace/3);
    
    // if(box4Counter === counter){
    //   var pieDataOut = getPieData(pieDictBuildType);
    //   pieSectionLabels[2] = pieDataOut[0];
    //   pieDecimalData[2] = pieDataOut[1];
    //   console.log(pieDictBuildType);
    // }
    
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
      // draw pie charts
      for(var n=0,dx=0,dy=0;n<piedata.length;n++,dx=0,dy=0) {
        if(mouseX > (pieCenterX-pieDiameter/2) && mouseX < (pieCenterX+pieDiameter/2) && 
           mouseY > (pieCenterYs[m]-pieDiameter/2) && mouseY < (pieCenterYs[m]+pieDiameter/2)) {
          pieCounter = m;
        }
        if(mouseAngle >= piedata[n][0] && mouseAngle < piedata[n][1] && pieCounter===m && mouseX > (pieCenterX-pieDiameter/2) && mouseX < (pieCenterX+pieDiameter/2) && 
           mouseY > (pieCenterYs[m]-pieDiameter/2) && mouseY < (pieCenterYs[m]+pieDiameter/2)) {
          dx = Math.cos((piedata[n][0] + piedata[n][1])/2) * 10;
          dy = Math.sin((piedata[n][0] + piedata[n][1])/2) * 10;
          noStroke();
          textSize(15);
          textAlign(CENTER,TOP);
          fill(200);
          text((pieSectionLabels[m][n%6]+", "+pieDecimalData[m][n%6]*100+"%"),pieCenterX,pieCenterYs[m]+pieDiameter/2+15);
          stroke(200);
          strokeWeight(2);
        }
        else {
          noStroke();
        }
        fill(pieColors[n%6]);
        arc(pieCenterX + dx, pieCenterYs[m] + dy, pieDiameter, pieDiameter, piedata[n][0], piedata[n][1], PIE);
      }
      // draw titles
      push()
      translate((width-detailSpace)+(detailSpace-pieDiameter)/3,pieCenterYs[m]);
      textSize(20);
      textAlign(CENTER,CENTER);
      noStroke();
      fill(200);
      rotate(-PI/2);
      text(pieLabels[m],0,0)
      pop()
    }
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
            stroke(252, 118, 35);
          }
        }
        
        if(checkBox[0]){
          var profit = row.get('ProfitNPV');
          profit = profit.replace(",","");
          profit = int(profit);
          if((profit>=minProfit) && (profit<=maxProfit)){
            var val = int(map(profit,0,originalMaxProfit,0,255));
            fill(val,255,255,150);
            ellipse(x, y, radius);
            // append(pieRowIndicies,i);
          }
        }
      
        if(checkBox[1]){
          var cost = row.get('BuildCost');
          cost = cost.replace(",","");
          cost = int(cost);
          if((cost>=minCost) && (cost<=maxCost)){
            val = int(map(cost,0,originalMaxCost,0,255));
            fill(255,val,255,150);
            ellipse(x, y, radius);
            var btype = row.get('BuildingType')

                    if (btype in pieDictBuildType)
                    {
                        pieDictBuildType[btype] += 1;
                    }

                    else {pieDictBuildType[btype] = 1}
            
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
  if(isOverMap){
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

function mouseDragged() {
  if(locked){
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
  
  if(sliderLocked){
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

function mouseOverMap() {
  if(((mouseX>overviewSpace+horizontalSpace) && 
     (mouseX<overviewSpace+horizontalSpace+mapSize) &&
     (mouseY>verticalSpace) && 
     (mouseY<verticalSpace+mapSize))) { 
     return true;
     }
  else
    return false;
}

function mouseOverBox(boxX,boxY,boxSize) {
  if((mouseX>boxX) && (mouseX<(boxX+boxSize)) && (mouseY>boxY) && (mouseY<(boxY+boxSize))){
    return true;
  }
  else{
    return false;
  }
}

function mouseOverASlider() {
  if(((mouseX>sliderX-sliderWidth/2) && (mouseX<sliderX+sliderWidth/2) && 
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
        /*
          var pieDictIndustry = {}
          var pieDictProdGroup = {}
          var pieDictBuildType = {}
        */

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
            values.push((sorted[i][1] / sum))
        }

        else if (i = 5)
        {
            names.push("Other")
            othersSum += sorted[i][1]
        }

        else
        {
            othersSum += sorted[i][1]
        }

    }
    values[5] =(othersSum / sum) ;
    return [names, values]
}