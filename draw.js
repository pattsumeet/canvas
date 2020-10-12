const canvas = document.getElementById('paint');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height=200;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = "red";
let drawing = false;
let pathsry = [];
let points = [];

var mouse = {x: 0, y: 0};
var previous = {x: 0, y: 0};

var mode="pen";
var previousMode="pen";

canvas.addEventListener('mousedown', function(e) {
  if (mode ==="highlight" || (mode ==="pen" && previousMode === "highlight")) {
    drawPaths()
  }

  drawing = true; 
  previous = {x:mouse.x,y:mouse.y};
  mouse = oMousePos(canvas, e);
  points = [];
  points.push({
    x:mouse.x,
    y:mouse.y,
    size: document.getElementById('selWidth').value,
    color: document.getElementById('selColor').value,
    mode: mode
  })
});

// Core logic for different modes
canvas.addEventListener('mousemove', function(e) {
  if(drawing){
      if (mode === "eraser") {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
      previous = {x:mouse.x,y:mouse.y};
      mouse = oMousePos(canvas, e);
      // saving the points in the points array
      points.push({
        x:mouse.x,
        y:mouse.y,
        size: 5,
        color: 'white',
        mode: mode
      })
      // drawing a line from the previous point to the current point
      ctx.beginPath();
      ctx.moveTo(previous.x,previous.y);
      ctx.lineTo(mouse.x,mouse.y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = document.getElementById('selColor').value;
      ctx.lineWidth = document.getElementById('selWidth').value;
      if(mode==="highlight"){
          ctx.lineWidth = 5;
          ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1;
      }
      previous = {x:mouse.x,y:mouse.y};
      mouse = oMousePos(canvas, e);
      // saving the points in the points array
      points.push({
        x:mouse.x,
        y:mouse.y,
        size: document.getElementById('selWidth').value,
        color: document.getElementById('selColor').value,
        mode: mode
      })
      // drawing a line from the previous point to the current point
      ctx.beginPath();
      ctx.moveTo(previous.x,previous.y);
      ctx.lineTo(mouse.x,mouse.y);
      ctx.stroke();
    }
  }
}, false);


canvas.addEventListener('mouseup', function() {
  drawing=false;
  if (mode ==="pen" || mode ==="eraser") {
    // Adding the path to the array or the paths
    pathsry.push(points);
  }
}, false);


// undo.addEventListener("click",Undo);
function switchMode(...mode){
  const elem = document.getElementById(mode[0]);
  elem.style.background = '#49aca3';
  const elem2 = document.getElementById(mode[1]);
  elem2.style.background = '#ffffff';
  const elem3 = document.getElementById(mode[2]);
  elem3.style.background = '#ffffff';
  this.previousMode = this.mode;
  this.mode=mode[0]; 
}

// function for drawing on canvas
function drawPaths(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pathsry.forEach(path=>{
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.moveTo(path[0].x,path[0].y);  
  for(let i = 1; i < path.length; i++){
    ctx.strokeStyle = path[i].color;
    ctx.lineWidth = path[i].size;
    ctx.lineTo(path[i].x,path[i].y); 
  }
    ctx.stroke();
  })
}  

// a function to detect the mouse position
function oMousePos(canvas, evt) {
  var ClientRect = canvas.getBoundingClientRect();
    return { //objeto
      x: Math.round(evt.clientX - ClientRect.left),
      y: Math.round(evt.clientY - ClientRect.top)
    }
}