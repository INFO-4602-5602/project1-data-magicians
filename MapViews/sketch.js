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
var ww = 256*5/4;
var hh = 256*5/4;
var zoom_De = 8.0;//8.5;
var zoom_At = 7.5;
var zoom_Da = 7.0;
var zoom;
var access = 'pk.eyJ1IjoibGlmaSIsImEiOiJjajFjeTE1b3kwMGQyMnFwbWp6NW40NTUxIn0.BYl1Zq_s7wKPFdNBu0WpYg';
var clonNames = [clon_De,clon_At,clon_Da];
var clatNames = [clat_De,clat_At,clat_Da];
var zoomNames = [zoom_De,zoom_At,zoom_Da];

// variables for data
var fileName1 = 'ZayoHackathonData_Buildings.csv';
var fileName2 = 'ZayoHackathonData_CPQs.csv';
var buildings;
var cpqs;
var lats;
var lons;
var onoffNetwork;
var cost;
var profit;
var proximity;
var markets = ['Denver','Atlanta','Dallas'];
var market = 1;
var maxCost;
var maxProximity;
var mark;

// variables for maps & spacing
var mapSize = 256*5/4;
var mapImageSize = mapSize/2;
var verticalSpaceBetweenMaps;
var horizontalSpaceBetweenMaps;
var overviewSpace = 200;
var detailSpace = 200;
var mapLocs = ['Left', 'Right'];
var mapCenterXs;
var mapCenterYs;
var mapLabels = ['PROFIT','COST'];
var markName = ['DENVER','ATLANTA','DALLAS'];
var originalEdgeLat = [];
var originalEdgeLon = [];
var smallMapLeftX;
var smallMapRightX; 
var smallMapTopY;
var smallMapBottomY;

// variables for interaction
var isOverMap = false;
var locked = false;
var xOffset = 0;
var yOffset = 0;
var onDot = false;
var onDoti = [];
var onMapj;

function preload() {
  buildings = loadTable(fileName1, "csv", "header");
  cpqs = loadTable(fileName2, "csv", "header");
  
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

}

function setup() {
  createCanvas(1200,700);
  background(125);
  
  // pull necessary data into arrays
  lats = buildings.getColumn('Latitude');
  lons = buildings.getColumn('Longitude');
  onoffNetwork = buildings.getColumn('On Zayo Network Status');
  cost = buildings.getColumn('Estimated Build Cost');
  maxCost = max(cost);
  profit = cpqs.getColumn('X36 NPV List');
  //proximity = buildings.getColumn('Network Proximity');
  //maxProximity = max(proximity);
  mark = buildings.getColumn('Market');
  
  // set spacing
  verticalSpaceBetweenMaps = ((height-mapSize)*3/5);
  horizontalSpaceBetweenMaps = (width-overviewSpace-detailSpace-mapSize*2)/3;
  mapCenterXs = [overviewSpace+horizontalSpaceBetweenMaps+mapSize/2,
                   overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*3/2];
  mapCenterYs = [verticalSpaceBetweenMaps+mapSize/2,
                   verticalSpaceBetweenMaps+mapSize/2];
  mapTextXs = [overviewSpace+horizontalSpaceBetweenMaps/2,
               overviewSpace+horizontalSpaceBetweenMaps*3/2+mapSize];
  mapTextYs = [verticalSpaceBetweenMaps+mapSize/2,
               verticalSpaceBetweenMaps+mapSize/2];
  
  // small map coords           
  smallMapLeftX = width-detailSpace-mapSize/2-horizontalSpaceBetweenMaps;
  smallMapRightX = width-detailSpace-mapSize/2-horizontalSpaceBetweenMaps+mapSize/2; 
  smallMapTopY = (verticalSpaceBetweenMaps-mapSize/2)/2;
  smallMapBottomY = (verticalSpaceBetweenMaps-mapSize/2)/2+mapSize/2;
               
  // get min/max lat/long for each market
  for(i=0; i<3; i++) {
    var centerX = mercX(clonNames[i], zoomNames[i]);
    var centerY = mercY(clatNames[i], zoomNames[i]);
    originalEdgeLat[i] = invMercY(-mapSize/2,zoomNames[i],centerY);
    originalEdgeLon[i] = invMercX(-mapSize/2,zoomNames[i],centerX);
  }

}

function draw() {
  // draw background rectangles
  noStroke();
  fill(100);
  rect(0,0,width-detailSpace,height);
  fill(75);
  rect(0,0,overviewSpace,height);
  
  // draw picture
  if(markets[market] === 'Denver'){
    imageMode(CORNER);
    image(mapimg_De,smallMapLeftX,smallMapTopY,mapSize/2,mapSize/2);
    if(counter === 0){
      clon = clon_De;
      clat = clat_De;
      zoom = zoom_De;
    }
  }
  
  if(markets[market] === 'Atlanta'){
    imageMode(CORNER);
    image(mapimg_At,smallMapLeftX,smallMapTopY,mapSize/2,mapSize/2);
    if(counter === 0){
      clon = clon_At;
      clat = clat_At;
      zoom = zoom_At;
    }
  }
  
  if(markets[market] === 'Dallas'){
    imageMode(CORNER);
    image(mapimg_Da,smallMapLeftX,smallMapTopY,mapSize/2,mapSize/2);
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
  var topEdgeLat = invMercY(-mapSize/2,zoom,centerY);
  var leftEdgeLon = invMercX(-mapSize/2,zoom,centerX);
  var rightEdgeLon = invMercX(mapSize/2,zoom,centerX);
  var edgeLocY = map(topEdgeLat,originalEdgeLat[market],(clatNames[market]-originalEdgeLat[market])*2+originalEdgeLat[market],
                     smallMapTopY,smallMapBottomY);
  var leftEdgeLocX = map(leftEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
  var rightEdgeLocX = map(rightEdgeLon,originalEdgeLon[market],(clonNames[market]-originalEdgeLon[market])*2+originalEdgeLon[market],
                     smallMapLeftX,smallMapRightX);
  var edgeLength = rightEdgeLocX - leftEdgeLocX;
  rect(leftEdgeLocX,edgeLocY,edgeLength,edgeLength);

  //use web mercator equations
  isOverMap = mouseOverMap();
  //imageMode(CENTER);
  //image(mapimg_De,mapCenterXs[1],mapCenterYs[1],mapSize,mapSize);
  for(j=0; j<2; j++){
    mapGraphs(mapCenterXs[j],mapCenterYs[j],clon,clat,zoom,mapLocs[j],j)
  }
  
  // draw rectangles for edges of map boxes
  strokeWeight(1);
  stroke(200);
  noFill();
  rect(overviewSpace+horizontalSpaceBetweenMaps,verticalSpaceBetweenMaps,
       mapSize,mapSize);
  rect(overviewSpace+horizontalSpaceBetweenMaps*2+mapSize,
       verticalSpaceBetweenMaps,
       mapSize,mapSize);
  
  // draw labels
  for(i=0; i<2; i++){
    push();
    translate(mapTextXs[i],mapTextYs[i]);
    fill(200);
    rotate(-PI/2);
    textAlign(CENTER,CENTER);
    textSize(14);
    textStyle(NORMAL);
    text(mapLabels[i],0,0);
    pop();
  }
  
  fill(200);
  textAlign(LEFT,CENTER);
  textSize(60);
  textStyle(NORMAL);
  text(markName[market],overviewSpace+horizontalSpaceBetweenMaps,verticalSpaceBetweenMaps/2);

  counter += 1;
}


function mapGraphs(mapCenterX,mapCenterY,clon,clat,zoom,mapLoc,j){
  if(onMapj === j){
    onDoti = [];
  }

  push();
  translate(mapCenterX,mapCenterY);

  // center for lat and long - for Denver
  var cx = mercX(clon, zoom);
  var cy = mercY(clat, zoom);

  var radius;
  for(i=0; i<buildings.getRowCount(); i++){
    if(markets[market] === mark[i]){
      // pull lat and long for data point
      lat = lats[i];
      lon = lons[i];
      var y = mercY(lat, zoom) - cy;
      var x = mercX(lon, zoom) - cx;
      if ((mouseX-mapCenterX <= x+2) && (mouseX-mapCenterX >= x-2) &&
         (mouseY-mapCenterY <= y+2) && (mouseY-mapCenterY >= y-2)){
        strokeWeight(2);
        stroke(255);
        radius = 20;
        onDot = true;
        onDoti.push(i);
        onMapj = j;
      }
      else if (onDot && (onDoti.indexOf(i)>=0)) {
        strokeWeight(2);
        stroke(255);
        radius = 20;
     }
      else {
        noStroke();
        radius = 2;
      }
      if((x>-mapSize/2) && (x<mapSize/2) && (y>-mapSize/2) && (y<mapSize/2)){
        var pointcolor;
      
      // if(mapLoc === 'Left'){
      //   if(profit[i] > maxProfit/1000){
      //     fill(0,0,255,100);
      //   }
      //   else {
      //     fill(0,100);
      //   }
      //   ellipse(x, y, radius);
      // }
      
        if(mapLoc === 'Right'){
          //pointColor = map(cost[i],0,max(cost),0,255)
          if((cost[i] > maxCost/1000)){
            fill(0,255,255,100);
          }
          else {
            fill(0,100);
          }
          ellipse(x, y, radius);
        }
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
    if((zoom + amount) >= zoomNames[market]){
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
  xOffset = mouseX;
  yOffset = mouseY;
}

function mouseDragged() {
  if(locked){
    var amountX = map(xOffset-mouseX,-100,100,-0.1,0.1)
    var amountY = map(yOffset-mouseY,100,-100,-0.1,0.1)
    
    // check if new lat and long edges are in range
    var centerX = mercX(clon+amountX, zoom);
    var centerY = mercY(clat+amountY, zoom);
    var topEdgeLat = invMercY(-mapSize/2,zoom,centerY);
    var bottomEdgeLat = invMercY(mapSize/2,zoom,centerY);
    var leftEdgeLon = invMercX(-mapSize/2,zoom,centerX);
    var rightEdgeLon = invMercX(mapSize/2,zoom,centerX);
    
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
}

function mouseReleased() {
  locked = false;
}

function mouseOverMap() {
  if(((mouseX>overviewSpace+horizontalSpaceBetweenMaps) && 
     (mouseX<overviewSpace+horizontalSpaceBetweenMaps+mapSize) &&
     (mouseY>verticalSpaceBetweenMaps) && 
     (mouseY<verticalSpaceBetweenMaps+mapSize)) || 
     ((mouseX>overviewSpace+horizontalSpaceBetweenMaps*2+mapSize) && 
     (mouseX<overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*2) &&
     (mouseY>verticalSpaceBetweenMaps) && 
     (mouseY<verticalSpaceBetweenMaps+mapSize))) { 
     return true;
     }
  else
    return false;
}