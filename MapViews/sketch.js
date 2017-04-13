// variables for images
var mapimg_De;
var maping_At;
var maping_Da;
var clat_De = -104.99;
var clon_De = 39.73;
var clat_At = -84.3880;
var clon_At = 33.7490;
var clat_Da = -96.7970;
var clon_Da = 32.7767;
var clon;
var clat;
var ww = 256;
var hh = 256;
var zoom_De = 8.0;//8.5;
var zoom_At = 7.5;
var zoom_Da = 7.0;
var zoom;
var access = 'pk.eyJ1IjoibGlmaSIsImEiOiJjajFjeTE1b3kwMGQyMnFwbWp6NW40NTUxIn0.BYl1Zq_s7wKPFdNBu0WpYg';

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
var market = 'Dallas';
var maxCost;
var maxProximity;
var mark;

// variables for spacing
var mapSize = 256;
var mapImageSize = mapSize/2;
var verticalSpaceBetweenMaps;
var horizontalSpaceBetweenMaps;
var overviewSpace = 150;
var detailSpace = 200;
var mapLocs = ['upperLeft', 'upperRight', 'lowerLeft', 'lowerRight'];
var mapCenterXs;
var mapCenterYs;

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
    clat_De + ',' + clon_De + ',' + zoom_De + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
  mapimg_At = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat_At + ',' + clon_At + ',' + zoom_At + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
  mapimg_Da = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat_Da + ',' + clon_Da + ',' + zoom_Da + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
}

function setup() {
  createCanvas(1000,600);
  background(125);
  
  // pull necessary data into arrays
  lats = buildings.getColumn('Latitude');
  lons = buildings.getColumn('Longitude');
  onoffNetwork = buildings.getColumn('On Zayo Network Status');
  cost = buildings.getColumn('Estimated Build Cost');
  maxCost = max(cost);
  profit = cpqs.getColumn('X36 NPV List');
  proximity = buildings.getColumn('Network Proximity');
  maxProximity = max(proximity);
  mark = buildings.getColumn('Market');
  
  // set spacing
  verticalSpaceBetweenMaps = (height-mapSize*2)/3;
  horizontalSpaceBetweenMaps = (width-overviewSpace-detailSpace-mapSize*2)/3;
  mapCenterXs = [overviewSpace+horizontalSpaceBetweenMaps+mapSize/2,
                   overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*3/2,
                   overviewSpace+horizontalSpaceBetweenMaps+mapSize/2,
                   overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*3/2];
  mapCenterYs = [verticalSpaceBetweenMaps+mapSize/2,
                   verticalSpaceBetweenMaps+mapSize/2,
                   verticalSpaceBetweenMaps*2+mapSize*3/2,
                   verticalSpaceBetweenMaps*2+mapSize*3/2];
}

function draw() {
  // draw background rectangles
  noStroke();
  fill(100);
  rect(0,0,width-detailSpace,height);
  fill(75);
  rect(0,0,overviewSpace,height);
  
  // draw picture
  if(market === 'Denver'){
    imageMode(CORNER);
    image(mapimg_De,width-detailSpace+(detailSpace-mapImageSize)/2,
                    verticalSpaceBetweenMaps,mapSize/2,mapSize/2);
    clon = clon_De;
    clat = clat_De;
    zoom = zoom_De;
  }
  
  if(market === 'Atlanta'){
    imageMode(CORNER);
    image(mapimg_At,width-detailSpace+(detailSpace-mapImageSize)/2,
                    verticalSpaceBetweenMaps,mapSize/2,mapSize/2);
    clon = clon_At;
    clat = clat_At;
    zoom = zoom_At;
  }
  
  if(market === 'Dallas'){
    imageMode(CORNER);
    image(mapimg_Da,width-detailSpace+(detailSpace-mapImageSize)/2,
                    verticalSpaceBetweenMaps,mapSize/2,mapSize/2);
    clon = clon_Da;
    clat = clat_Da;
    zoom = zoom_Da;
  }
  
  //use web mercator equations
  isOverMap = mouseOverMap();
  for(j=0; j<4; j++){
    mapGraphs(mapCenterXs[j],mapCenterYs[j],clon,clat,zoom,mapLocs[j],j)
  }
  
  // draw rectangles for edges of map boxes
  strokeWeight(1);
  stroke(0);
  noFill();
  rect(overviewSpace+horizontalSpaceBetweenMaps,verticalSpaceBetweenMaps,
       mapSize,mapSize);
  rect(overviewSpace+horizontalSpaceBetweenMaps,
       verticalSpaceBetweenMaps*2+mapSize,
       mapSize,mapSize);
  rect(overviewSpace+horizontalSpaceBetweenMaps*2+mapSize,
       verticalSpaceBetweenMaps,
       mapSize,mapSize);
  rect(overviewSpace+horizontalSpaceBetweenMaps*2+mapSize,
       verticalSpaceBetweenMaps*2+mapSize,
       mapSize,mapSize);
  
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
    if(market === mark[i]){
      // pull lat and long for data point
      lat = lats[i];
      lon = lons[i];
      var x = mercY(lon, zoom) - cy;
     var y = mercX(lat, zoom) - cx;
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
      if((x>-128) && (x<128) && (y>-128) && (y<128)){
        var pointcolor;
        if(mapLoc === 'upperLeft'){
          if(onoffNetwork[i] === 'Not on Zayo Network'){
            fill(255,0,255,100);
          }
          else if(onoffNetwork[i] === "On Zayo Network"){
            fill(0,100);
          }
          //noStroke();
          ellipse(x, y, radius);
        }
      
      // if(mapLoc === 'upperRight'){
      //   if(onoffNetwork[i] === 'Not on Zayo Network'){
      //     //stroke(255, 0, 255);
      //     fill(255,0,255,100);
      //   }
      //   else if(onoffNetwork[i] === "On Zayo Network"){
      //     fill(255,100);
      //   }
      //   noStroke();
      //   ellipse(x, y, 2);
      // }
      
        if(mapLoc === 'lowerLeft'){
          //pointColor = map(cost[i],0,max(cost),0,255)
          if((cost[i] > maxCost/1000)){
            fill(0,255,255,100);
          }
          else {
            fill(0,100);
          }
          ellipse(x, y, radius);
        }
      
        if(mapLoc === 'lowerRight'){
          //pointColor = map(proximity[i],0,maxProximity,0,255);
          //fill(255,255,0,100);
          if((cost[i] > maxCost/1000)){
            fill(255,255,0,100);
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
function mercY(lon, zoom) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercX(lat, zoom) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function mouseWheel(event){
  if(isOverMap){
    var amount = map(event.delta,-5000,5000,-5,5);
    zoom_De += amount;
    zoom_At += amount;
    zoom_Da += amount;
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
    clat_De += amountX;
    clon_De += amountY;
    clat_At += amountX;
    clon_At += amountY;
    clat_Da += amountX;
    clon_Da += amountY;
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
     ((mouseX>overviewSpace+horizontalSpaceBetweenMaps) && 
     (mouseX<overviewSpace+horizontalSpaceBetweenMaps+mapSize) &&
     (mouseY>verticalSpaceBetweenMaps*2+mapSize) && 
     (mouseY<verticalSpaceBetweenMaps*2+mapSize*2)) || 
     ((mouseX>overviewSpace+horizontalSpaceBetweenMaps*2+mapSize) && 
     (mouseX<overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*2) &&
     (mouseY>verticalSpaceBetweenMaps) && 
     (mouseY<verticalSpaceBetweenMaps+mapSize)) || 
     ((mouseX>overviewSpace+horizontalSpaceBetweenMaps*2+mapSize) && 
     (mouseX<overviewSpace+horizontalSpaceBetweenMaps*2+mapSize*2) &&
     (mouseY>verticalSpaceBetweenMaps*2+mapSize) && 
     (mouseY<verticalSpaceBetweenMaps*2+mapSize*2))) {
       return true;
     }
  else
    return false;
}