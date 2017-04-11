var mapimg;

var clat = 30;
var clon = 0;

var ww = 1024;
var hh = 512;

var zoom = 3;

var access = 'pk.eyJ1IjoibGlmaSIsImEiOiJjajFjeTE1b3kwMGQyMnFwbWp6NW40NTUxIn0.BYl1Zq_s7wKPFdNBu0WpYg';

var center = [0,0];

function setup() {
  createCanvas(ww, hh);
}

function draw() {
  loadNewImage(clat,clon,zoom,ww,hh);
  image(mapimg, 0, 0);
  //zoom = mouseZoom(mouseY);
  center = mousePan();
  clat = center[0];
  clon = center[1];
  print(center);
}

// function mouseZoom(y){
//   zoom = map(y,0,height,0,20);
//   return zoom
// }

function mousePan(){
  var centerlat = map(mouseX,0,width,-180,180);
  var centerlon = map(mouseY,0,height,-90,90);
  var arr = [centerlat,centerlon];
  return arr
}

function keyPressed(){
    if(keyCode === DOWN_ARROW){
      zoom += 0.2;
    }
    else if(keyCode === UP_ARROW){
      zoom -= 0.2;
    }
  }

function loadNewImage(clat,clon,zoom,ww,hh) {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clat + ',' + clon + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=' + access, function(){
      image(mapimg,0,0);
    });
}