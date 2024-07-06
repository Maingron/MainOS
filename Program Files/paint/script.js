var path = window.parent.attr;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var steps = [[0,0,0,0,0,0]]; // Mousedown, x, y, color, stroke width, tooltype
canvas.mousedown = 0;

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

var rectangling = 0;



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



        ctx.beginPath();

        ctx.moveTo(steps[steps.length - 1][1],steps[steps.length - 1][2]);

        ctx.fillStyle=color;
        ctx.strokeStyle=color;
        ctx.lineWidth=+document.getElementById("width").value;


        if(rectangling == 1) {
            if(canvas.mousedown == 0) {
                rectangling = 0;
                steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,color,+document.getElementById("width").value,tooltype]);

            }

        } else {
            if(tooltype == "rectangle") {
                if(canvas.mousedown == 1) {
                    rectangling = 1;
                } else if(canvas.mousedown == 0) {
                    rectangling = 0;
                }
            }
            steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,color,+document.getElementById("width").value,tooltype]);
        }

        ctx.lineTo(ctx.mouseX,ctx.mouseY);

        if(canvas.mousedown) {
            ctx.stroke();
        }
}


canvas.onmousedown = function() {
    canvas.mousedown = 1;
}

canvas.onmouseup = function() {
    canvas.mousedown = 0;
    render();
}


var lastRenderComplete = true;


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

    for(var i = 0; steps.length > i; i++) {

        if(steps[i][0]) {
            ctx.fillStyle=steps[i][3];
            ctx.strokeStyle=steps[i][3];
            ctx.lineWidth=steps[i][4];

            if(steps[i][5] == "pen") {
                ctx.lineTo(steps[i][1],steps[i][2]);
            } else if(steps[i][5] == "rectangle") {
                if(steps[i + 1]) {
                    ctx.fillRect(steps[i][1],steps[i][2],(steps[i + 1][1] - steps[i][1]),(steps[i + 1][2] - steps[i][2]));
                } else {
                    ctx.fillRect(steps[i][1],steps[i][2],(ctx.mouseX - steps[i][1]),(ctx.mouseY - steps[i][2]))
                }
            }

        } else {
            ctx.moveTo(steps[i][1],steps[i][2]);
            ctx.beginPath();
        }

        ctx.stroke();

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

var fileformat = "png";

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
