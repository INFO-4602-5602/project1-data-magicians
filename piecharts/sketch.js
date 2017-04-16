
var fileName = "overviewData.csv";
var csvdata;


// var data = [48.96,47.268,27.18,156.78,11.3,68.512];
// var data1 = [85.212,54.144,35.1,23.364,31.716,130.464];
// var data2 = [94.5,50.796,46.512,12.168,29.844,126.18];

var data = [];
var data1 = [];
var data2 = [];

var piedata = [], piecolor = ['rgb(82,70,86)','rgb(207,71,71)', 'rgb(234,122,88)','rgb(228,220,203)','rgb(77,244,255)','rgb(25,255,205)'];
var piedata1 =[],  piecolor1 = ['rgb(82,70,86)','rgb(207,71,71)', 'rgb(234,122,88)','rgb(228,220,203)','rgb(77,244,255)','rgb(25,255,205)'];
var piedata2 = [],  piecolor2 = ['rgb(82,70,86)','rgb(207,71,71)', 'rgb(234,122,88)','rgb(228,220,203)','rgb(77,244,255)','rgb(25,255,205)'];

var mouseAngle = 0, pieDelta = 0, hover = 0;
var mouseAngle1 = 0;
var mouseAngle2 = 0;


var dataA = [.1360,.1313,.0755,.4355,.0314,.1903];
var dataB = [.2367,.1504,.0975,.0649,.0881,.3624];
var dataC = [.2625,.1411,.1292,.0338,.0829,.3505];


function decimalToDegrees(dataVals){
  var dataAngles = [];
  for(i=0; i<dataVals.length; i++){
    append(dataAngles, dataVals[i]*360);
  }
  return dataAngles;
}



function setup()
{
  data = decimalToDegrees(dataA);
  data1 = decimalToDegrees(dataB);
  data2 = decimalToDegrees(dataC);

  createCanvas(1000,600);
  background(100);
  total = data.reduce(function(a,b){ return a+b; }, 0);
  total1 = data1.reduce(function(a,b){ return a+b; }, 0);
  total2 = data2.reduce(function(a,b){ return a+b; }, 0);



  console.log(data);

  for(var i=0,count=0;i<data.length;i++) {
    piedata.push([Math.PI * 2 * count / total, Math.PI * 2 * (count + data[i]) / total]);
    count += data[i];
  }

  for(var i=0,count=0;i<data1.length;i++) {
    piedata1.push([Math.PI * 2 * count / total1, Math.PI * 2 * (count + data1[i]) / total1]);
    count += data1[i];
  }

  for(var i=0,count=0;i<data2.length;i++) {
    piedata2.push([Math.PI * 2 * count / total2, Math.PI * 2 * (count + data2[i]) / total2]);
    count += data2[i];
  }

}



function draw() {
background(100);
fill(256);
text("DENVER", 820, 20);
text("ATLANTA", 820, 220);
text("DALLAS", 820, 420);

console.log(mouseAngle);

  for(var i=0,dx=0,dy=0;i<piedata.length;i++,dx=0,dy=0) {
    fill(piecolor[i%6]);
    if(mouseAngle >= piedata[i][0] && mouseAngle < piedata[i][1] && mouseX>775 && mouseX<925 && mouseY > 30 && mouseY < 180) {
      fill(255);
      dx = Math.cos((piedata[i][0] + piedata[i][1])/2) * 10;
      dy = Math.sin((piedata[i][0] + piedata[i][1])/2) * 10;
      text(data[i],20,20);
      text(data[i],20,40);
    }
    arc(850 + dx, 105 + dy, 150, 150, piedata[i][0], piedata[i][1], PIE);
  }

  for(var i=0,dx=0,dy=0;i<piedata1.length;i++,dx=0,dy=0) {
    fill(piecolor1[i%6]);
    if(mouseAngle1 >= piedata1[i][0] && mouseAngle1 < piedata1[i][1] && mouseX>775 && mouseX<925 && mouseY > 230 && mouseY < 380) {
      fill(255);
      dx = Math.cos((piedata1[i][0] + piedata1[i][1])/2) * 10;
      dy = Math.sin((piedata1[i][0] + piedata1[i][1])/2) * 10;
      text(data1[i],20,20);
      text(data1[i],20,40);
    }
    arc(850 + dx, 305 + dy, 150, 150, piedata1[i][0], piedata1[i][1], PIE);
  }

  for(var i=0,dx=0,dy=0;i<piedata2.length;i++,dx=0,dy=0) {
    fill(piecolor2[i%6]);
    if(mouseAngle2 >= piedata2[i][0] && mouseAngle2 < piedata2[i][1] && mouseX>775 && mouseX<925 && mouseY > 430 && mouseY < 580) {
      fill(255);
      dx = Math.cos((piedata2[i][0] + piedata2[i][1])/2) * 10;
      dy = Math.sin((piedata2[i][0] + piedata2[i][1])/2) * 10;
      text(data2[i],20,20);
      text(data2[i],20,40);
    }
    arc(850 + dx, 505 + dy, 150, 150, piedata2[i][0], piedata2[i][1], PIE);
  }
}

function mouseMoved() {
  mouseAngle = Math.PI / 2 - Math.atan((850 - mouseX) / (105 - mouseY));
  if(mouseY < 105) mouseAngle = mouseAngle + Math.PI;
  mouseAngle1 = Math.PI / 2 - Math.atan((850 - mouseX) / (305 - mouseY));
  if(mouseY < 305) mouseAngle1 = mouseAngle1 + Math.PI;
  mouseAngle2 = Math.PI / 2 - Math.atan((850 - mouseX) / (505 - mouseY));
  if(mouseY < 505) mouseAngle2 = mouseAngle2 + Math.PI;
}
