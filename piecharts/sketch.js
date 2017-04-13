var data = [48.96,47.268,27.18,156.78,11.3,68.512];
var data1 = [85.212,54.144,35.1,23.364,31.716,130.464];
var data2 = [94.5,50.796,46.512,12.168,29.844,126.18];

var piedata = [], piecolor = ['rgb(100,16,20)','rgb(153,131,61)', 'rgb(255,140,0)','rgb(77,244,255)','rgb(20,204,165)','rgb(25,255,205)'];
var piedata1 =[],  piecolor1 = ['rgb(100,16,20)','rgb(153,131,61)', 'rgb(255,140,0)','rgb(77,244,255)','rgb(20,204,165)','rgb(25,255,205)'];
var piedata2 = [],  piecolor2 = ['rgb(100,16,20)','rgb(153,131,61)', 'rgb(255,140,0)','rgb(77,244,255)','rgb(20,204,165)','rgb(25,255,205)'];

var mouseAngle = 0, pieDelta = 0, hover = 0;

var fileName = "overviewData.csv"
var data1;


function setup() {
  createCanvas(1000,600);
  background(100);
  total = data.reduce(function(a,b){ return a+b; }, 0);
  total1 = data1.reduce(function(a,b){ return a+b; }, 0);
  total2 = data2.reduce(function(a,b){ return a+b; }, 0);


  for(var i=0,count=0;i<data.length;i++) {
    piedata.push([Math.PI * 2 * count / total, Math.PI * 2 * (count + data[i]) / total]);
    count += data[i];
  }

  for(var i=0,count=0;i<data1.length;i++) {
    piedata1.push([Math.PI * 2 * count / total1, Math.PI * 2 * (count + data1[i]) / total1]); //not sure if I should have total, total1, and total2
    count += data1[i];
  }

  for(var i=0,count=0;i<data2.length;i++) {
    piedata2.push([Math.PI * 2 * count / total2, Math.PI * 2 * (count + data2[i]) / total2]);
    count += data2[i];
  }

}

function draw() {
  for(var i=0,dx=0,dy=0;i<piedata.length;i++,dx=0,dy=0) {
    fill(piecolor[i%6]);
    if(mouseAngle >= piedata[i][0] && mouseAngle < piedata[i][1]) {
      dx = Math.cos((piedata[i][0] + piedata[i][1])/2) * 10;
      dy = Math.sin((piedata[i][0] + piedata[i][1])/2) * 10;
    }
    arc(850 + dx, 105 + dy, 150, 150, piedata[i][0], piedata[i][1], PIE);
  }

  for(var i=0,dx=0,dy=0;i<piedata1.length;i++,dx=0,dy=0) {
    fill(piecolor1[i%6]);
    if(mouseAngle >= piedata1[i][0] && mouseAngle < piedata1[i][1]) {
      dx = Math.cos((piedata1[i][0] + piedata1[i][1])/2) * 10;
      dy = Math.sin((piedata1[i][0] + piedata1[i][1])/2) * 10;
    }
    arc(850 + dx, 305 + dy, 150, 150, piedata1[i][0], piedata1[i][1], PIE);
  }

  for(var i=0,dx=0,dy=0;i<piedata2.length;i++,dx=0,dy=0) {
    fill(piecolor2[i%6]);
    if(mouseAngle >= piedata2[i][0] && mouseAngle < piedata[i][1]) {
      dx = Math.cos((piedata2[i][0] + piedata2[i][1])/2) * 10;
      dy = Math.sin((piedata2[i][0] + piedata2[i][1])/2) * 10;
    }
    arc(850 + dx, 505 + dy, 150, 150, piedata2[i][0], piedata2[i][1], PIE);
  }
}

// function mouseMoved() {
//   //noStroke(1);
//   mouseAngle = Math.PI / 2 - Math.atan((320 - mouseX) / (200 - mouseY));
//   if(mouseY < 200) mouseAngle = mouseAngle + Math.PI;
//
// }
