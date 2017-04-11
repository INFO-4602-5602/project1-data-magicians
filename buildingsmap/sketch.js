var buildings;
var mapimg_De;
var maping_At;

var clat_De = -104.99;
var clon_De = 39.73;

var clat_At = -84.3880;
var clon_At = 33.7490;

var ww = 512;
var hh = 512;

var zoom_De = 8.5;
var zoom_At = 7.5;

var access = 'pk.eyJ1IjoibGlmaSIsImEiOiJjajFjeTE1b3kwMGQyMnFwbWp6NW40NTUxIn0.BYl1Zq_s7wKPFdNBu0WpYg';

function preload() {
  buildings = loadTable("ZayoHackathonData_Buildings.csv", "csv", "header");
  
  mapimg_De = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat_De + ',' + clon_De + ',' + zoom_De + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
  mapimg_At = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat_At + ',' + clon_At + ',' + zoom_At + '/' +
    ww + 'x' + hh +
    '?access_token=' + access);
    
}

function setup() {
  createCanvas(ww*2+5, hh);

}

function draw() {
  //mapimg_De = loadNewImage(mapimg_De,clat_De,clon_De, zoom_De, ww,hh);
  //mapimg_At = loadNewImage(mapimg_At,clat_At,clon_At, zoom_At, ww,hh);
  
  var lats = buildings.getColumn('Latitude');
  var lons = buildings.getColumn('Longitude');
  var network = buildings.getColumn('On Zayo Network Status');
  
    //use web mercator equations
  push();
  translate(width / 4, height / 2);
  imageMode(CENTER);
  image(mapimg_De, 0, 0);
  
  var cx = mercX(clon_De, zoom_De); //center x from center longitude
  var cy = mercY(clat_De, zoom_De); //center y from center latitude
  
  for(i=0; i<buildings.getRowCount(); i++){
    lat = lats[i];
    lon = lons[i];
    var x = mercY(lon, zoom_De) - cy;
    var y = mercX(lat, zoom_De) - cx;
    if(network[i] === 'Not on Zayo Network'){
      //stroke(255, 0, 255);
      fill(255, 0, 255, 50);
    }
    else if(network[i] === "On Zayo Network"){
      fill(0,255,255,50);
    }
    noStroke();
    ellipse(x, y, 2);
  }
  pop();
  
  push();
  translate(width*3 / 4+5, height/2);
  imageMode(CENTER);
  image(mapimg_At, 0, 0);
  
  cx = mercX(clon_At, zoom_At); //center x from center longitude
  cy = mercY(clat_At, zoom_At); //center y from center latitude
  
  for(i=0; i<buildings.getRowCount(); i++){
    lat = lats[i];
    lon = lons[i];
    x = mercY(lon, zoom_At) - cy;
    y = mercX(lat, zoom_At) - cx;
    if(network[i] === 'Not on Zayo Network'){
      //stroke(255, 0, 255);
      fill(255, 0, 255, 50);
    }
    else if(network[i] === "On Zayo Network"){
      fill(0,255,255,50);
    }
    noStroke();
    ellipse(x, y, 2);
  }
  pop();
  
}


// equations found wikipedia for web mercator - used from https://www.youtube.com/watch?v=ZiYdOwOrGyc&t=476s - p5.js tutorial
function mercY(lon, zoom) {
  //var wid = width/2;
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercX(lat, zoom) {
  lat = radians(lat);
  //var wid = width/2;
  var a = (256 / PI) * pow(2, zoom);//(256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

// function mousePan(){
//   var centerlat = map(mouseX,0,width,-180,180);
//   var centerlon = map(mouseY,0,height,-90,90);
//   var arr = [centerlat,centerlon];
//   return arr
// }

// function mouseZoom(y){
//   zoom = map(y,0,height,0,20);
//   return zoom
// }

function keyPressed(){
  if(mouseX<ww){
    if(keyCode === DOWN_ARROW){
      zoom_De += 0.2;
    }
    else if(keyCode === UP_ARROW){
      zoom_De -= 0.2;
    }
  }
  if((mouseX>ww+5)&&(mouseX<ww*2+5)){
    if(keyCode === DOWN_ARROW){
      zoom_At += 0.2;
    }
    else if(keyCode === UP_ARROW){
      zoom_At -= 0.2;
    }
  }
}


function loadNewImage(mapimg_specific,clat,clon,zoom,ww,hh) {
  var mapimg_specific = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=' + access, function(){
      image(mapimg_specific,0,0);
    });
  return mapimg_specific
}