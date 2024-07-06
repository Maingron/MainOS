var path = window.parent.attr;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var steps = [[0,0,0,0,0,0]]; // Mousedown, x, y, color, stroke width, tooltype

var lastRenderComplete = true;
var fileformat = "png";

canvas.mousedown = false;

setCanvasSize(512, 512);


if (path) {
    var canvasbgimage = new Image();
    canvasbgimage.src = iofs.load(path, false);
    document.getElementById("filename1").value = path;
    document.getElementById("loadcanvas").src = iofs.load(path, false);
    window.setTimeout(function() {
        setCanvasSize(document.getElementById("loadcanvas").offsetWidth, document.getElementById("loadcanvas").offsetHeight);
        document.getElementById("imgwidth").value = canvas.width;
        document.getElementById("imgheight").value = canvas.height;

        render();
    },50);
}


ctx.color = "#ff0000";

var tooltype = "pen";

var lastPosition = [0,0,0];


canvas.addEventListener("mousemove", function(e) {
    setTimeout(function() {
        doThisOnMouseMove(e);
    },0)
})

async function doThisOnMouseMove(e) {
    let boundingClientRect = canvas.getBoundingClientRect()
    let color = document.getElementById("color").value;
    ctx.mouseX = +((e.clientX - boundingClientRect.left) * (canvas.width / boundingClientRect.width)).toFixed(0);
    ctx.mouseY = +((e.clientY - boundingClientRect.top) * (canvas.height / boundingClientRect.height)).toFixed(0);

    if(!canvas.mousedown && !lastPosition[2]) {
        steps.pop();
    }

    if(canvas.mousedown) {
        if(tooltype == "pen") {
            paintDraw.line(lastPosition[0], lastPosition[1], ctx.mouseX, ctx.mouseY, color, +document.getElementById("width").value, lastPosition[2]);
        } else if(tooltype == "rectangle") {
            if(steps[steps.length - 1][5] == "rectangle" && steps[steps.length - 1][0]) {
                render();
                steps.pop();
            }
        }
    }

    steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,color,+document.getElementById("width").value,tooltype]);

    lastPosition = [ctx.mouseX, ctx.mouseY, canvas.mousedown];
}


canvas.onmousedown = function() {
    canvas.mousedown = true;
}

canvas.onmouseup = function() {
    canvas.mousedown = false;
    render();
}





async function render(event) {
    if(!lastRenderComplete) {
        return false;
    }

    lastRenderComplete = false;
    
    ctx.clearRect(0,0,canvas.clientWidth,canvas.height);

    if(canvasbgimage) {
        ctx.drawImage(canvasbgimage,0,0,document.getElementById("loadcanvas").offsetWidth,document.getElementById("loadcanvas").offsetHeight);
    }


    ctx.beginPath();

    ctx.moveTo(steps[0][1],steps[0][2]);

    for(let step of steps) {
        if(step[0]) { // If mousedown
            if(step[5] == "pen") {
                paintDraw.line(lastPosition[0], lastPosition[1], step[1], step[2], step[3], step[4], lastPosition[2]);
            } else if(step[5] == "rectangle") {
                paintDraw.rectangle(lastPosition[0], lastPosition[1], step[1], step[2], step[3]);
            }
        }

        // ctx.moveTo(step[1], step[2]);
        lastPosition = [step[1], step[2], step[0]];
    }

    lastRenderComplete = true;

    window.requestAnimationFrame(async function() {
        document.getElementById("canvascopy").src = canvas.toDataURL('image/png');
    });

}



function undo() {
    var was1 = 0;
    for(var i=steps.length;i > 0;i--) {
        if(steps[i - 1][0] == 1) {
            steps[i-1][0] = 0;
            steps.pop();
            was1 = 1;

        } else if(steps[i - 1][0] == 0 && was1 == 1) {
            render();
            return;
        }
    }
    render();
}


function savefile(type) {
    console.log(canvas.toDataURL('image/'+fileformat));
    iofs.save(document.getElementById("filename1").value, canvas.toDataURL('image/'+fileformat), [], 1, 0, false);
    parent.sendNotification({"title": "Image saved", "content": "Saved image as: " + document.getElementById("filename1").value + ".", "type": "success", "sender": this});
}


function setfileformat(which) {
    if(which.toLowerCase() == "jpg") {
        fileformat = "jpeg";
    } else {
        fileformat = which;
    }
}

function contextMenu(event) {
    spawnContextMenu([["Pen","tooltype='pen'"],["Rectangle","tooltype='rectangle'"],["<hr>"],
    ["Undo","undo()"],["Redo","redo()","disabled"],

]);
}

function setCanvasSize(width, height) {
    if(!width) {
        width = canvas.width;
    }
    if(!height) {
        height = canvas.height;
    }

    canvas.width = width;
    canvas.height = height;

    render();
}

render();

var paintDraw = {
    line: function(x, y, x2, y2, color, width, continueLineInstead = false) {
        if(!continueLineInstead) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = width;

            ctx.moveTo(x, y);
        }


        ctx.lineTo(x2, y2);

        ctx.stroke();

    },
    rectangle: function(x, y, x2, y2, color) {
        x2 = x2-x;
        y2 = y2-y;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        ctx.moveTo(x, y);
        ctx.fillRect(x, y, x2, y2);
        ctx.stroke();

    }
}
