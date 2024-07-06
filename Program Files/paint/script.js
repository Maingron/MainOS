var path = window.parent.attr;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var steps = [[0,0,0,0,0,0]]; // Mousedown, x, y, color, stroke width, tooltype

var lastRenderComplete = true;
var fileformat = "png";

canvas.mousedown = false;



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
} else {
    setCanvasSize(512, 512);
}


var lastPosition = [0,0,0];


canvas.addEventListener("mousemove", function(e) {
    setTimeout(function() {
        doThisOnMouseMove(e);
    },0)
})

async function doThisOnMouseMove(e) {
    let boundingClientRect = canvas.getBoundingClientRect()
    ctx.mouseX = +((e.clientX - boundingClientRect.left) * (canvas.width / boundingClientRect.width)).toFixed(0);
    ctx.mouseY = +((e.clientY - boundingClientRect.top) * (canvas.height / boundingClientRect.height)).toFixed(0);

    if(!canvas.mousedown && !lastPosition[2]) {
        steps.pop();
    }

    if(canvas.mousedown) {
        let tool = props.getTool();
        if(tool == "pen") {
            paintDraw.line(lastPosition[0], lastPosition[1], ctx.mouseX, ctx.mouseY, props.getColor(), +document.getElementById("width").value, lastPosition[2]);
        } else if(tool == "rect") {
            if(steps[steps.length - 1][5] == "rect" && steps[steps.length - 1][0]) {
                render();
                steps.pop();
            }
        } else if(tool == "circle") {
            if(steps[steps.length - 1][5] == "circle" && steps[steps.length - 1][0]) {
                render();
                steps.pop();
            }
        } else {
            render();
        }
    }

    steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,props.getColor(),+document.getElementById("width").value, props.getTool()]);

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
            } else if(step[5] == "rect") {
                paintDraw.rectangle(lastPosition[0], lastPosition[1], step[1], step[2], step[3]);
            } else if(step[5] == "spherebrush") {
                paintDraw.spherebrush(lastPosition[0], lastPosition[1], step[1], step[2], step[3], step[4]);
            } else if(step[5] == "circle") {
                paintDraw.circle(lastPosition[0], lastPosition[1], step[1], step[2], step[3]);
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
    spawnContextMenu([["Pen","props.setTool('pen')"],["Rectangle","props.setTool('rect')"],["<hr>"],
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

    document.getElementById("canvas-width").value = width;
    document.getElementById("canvas-height").value = height;

    render();
}

render();

function setCanvasScale(scale) {
    if(scale < .1 || scale > 999) {
        return false;
    }

    canvas.style.transform = `scale(${scale})`;

    document.getElementById("zoom").value = scale;

    return true;
}

function getCanvasScale() {
    return canvas.style.transform.split("(")[1].split(")")[0];
}

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
    },

    spherebrush: function(x, y, x2, y2, color, width) {
        const radius = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2)) / 2;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = width / 4;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    },

    circle: function(x, y, x2, y2, color, width, outlineOnly = false) {
        const centerX = (x + x2) / 2;
        const centerY = (y + y2) / 2;
    
        // Calculate the radius of the circle
        const radius = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2)) / 2;
    
        ctx.lineWidth = 0;
        // Set the fill style and stroke style
        ctx.fillStyle = color;
    
        // Draw the circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI); // Full circle
        if(!outlineOnly) {
            ctx.strokeStyle = "transparent";
            ctx.fill();
        }

        if(outlineOnly) {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

}

var props = (function() {
    var _ = {
        tool: 0,
        toolMap: {
            "pen": 1,
            "rect": 2,
            "spherebrush": 3,
            "circle": 4
        },
        color: "#ff0000"
    }

    return {
        setTool: function(selectTool, event) {
            if(_.toolMap[selectTool]) {
                _.tool = _.toolMap[selectTool];

                if(event) {
                    for(let myElement of document.querySelectorAll(".tool.active")) {
                        myElement.classList.remove("active");
                    }
    
                    event.classList.add("active");
                }

                return true;
            }

            return false;
        },

        getTool: function() {
            return Object.keys(_.toolMap).find(key => _.toolMap[key] === _.tool);
        },

        setColor: function(color, event) {
            _.color = color;

            if(event) {
                event.value = color;
            }

            return true;
        },

        getColor: function() {
            return _.color;
        }
    }
}());

// Init:
props.setTool('pen', document.querySelector('.tool--pen'));
props.setColor('#00ff00', document.querySelector('.color'));

setCanvasScale(1);
