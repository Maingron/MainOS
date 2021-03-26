var path = window.parent.attr;




var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var steps = [[0,0,0,0,0,0]]; // Mousedown, x, y, color, stroke width, tooltype
canvas.mousedown = 0;

canvas.height = 512;
canvas.width = 512;


if (path) {
    var canvasbgimage = new Image();
    canvasbgimage.src = window.parent.loadfile(path);
    document.getElementById("filename1").value = path;
    document.getElementById("loadcanvas").src = window.parent.loadfile(path);
    window.setTimeout(function() {
        canvas.height = document.getElementById("loadcanvas").offsetHeight;
        canvas.width = document.getElementById("loadcanvas").offsetWidth;
        document.getElementById("imgwidth").value = canvas.width;
        document.getElementById("imgheight").value = canvas.height;
    },50);
}


ctx.color = "#777777";

var tooltype = "pen";

var rectangling = 0;

var timeTo0 = 0;




canvas.addEventListener("mousemove",function(e) {
    if(timeTo0 <= 0 || rectangling == 1) {
        timeTo0 = 1;
        ctx.mouseX = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width);
        ctx.mouseY = (e.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height);


            if(steps[0].toString() == "0,0,0,0,0,0") {
                steps.pop();
            }

            if(rectangling == 1) {
                if(canvas.mousedown == 0) {
                    rectangling = 0;

                    steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,document.getElementById("color").value,document.getElementById("width").value,tooltype]);
                }

            } else {
                if(tooltype == "rectangle") {
                    if(canvas.mousedown == 1) {
                        rectangling = 1;
                    } else if(canvas.mousedown == 0) {
                        rectangling = 0;
                    }
                }
                steps.push([canvas.mousedown,ctx.mouseX,ctx.mouseY,document.getElementById("color").value,document.getElementById("width").value,tooltype]);
            }
    } else {
        timeTo0--;
    }


})


// steps.push([1,20,0,"red"]);
// steps.push([1,20,300,"red"]);

// steps.push([0,50,0,"lime"]);
// steps.push([1,50,300,"lime"]);



canvas.onmousedown = function() {
    canvas.mousedown = 1;
}

canvas.onmouseup = function() {
    canvas.mousedown = 0;
}

// var spritesheet = new Image();
// spritesheet.src="sprites.webp";


function render() {

    timeTo0--;

    ctx.clearRect(0,0,canvas.clientWidth,canvas.height);

    if(canvasbgimage) {
        ctx.drawImage(canvasbgimage,0,0,document.getElementById("loadcanvas").offsetWidth,document.getElementById("loadcanvas").offsetHeight);
    }


    // ctx.fillStyle="#000";
    // ctx.fillRect(0,0,canvas.width,canvas.height);

    // ctx.fillStyle="#fff";
    // ctx.fillRect(1,1,canvas.width - 2,canvas.height - 2);

    ctx.fillStyle="#f00";
    ctx.beginPath();

    ctx.moveTo(steps[0][1],steps[0][2]);

    for(var i = 0; steps.length > i; i++) {


        if(steps[i][0] == 1) {
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



    // parent.savefile(parent.setting.settingpath + "backgroundimage.txt", canvas.toDataURL('image/png'), 1, "t=txt");

}

window.setInterval(function() {
    document.getElementById("canvascopy").src = canvas.toDataURL('image/png');
},300)




function undo() {
    var was1 = 0;
    for(var i=steps.length;i > 0;i--) {
        if(steps[i - 1][0] == 1) {
            steps[i-1][0] = 0;
            steps.pop();
            was1 = 1;

        } else if(steps[i - 1][0] == 0 && was1 == 1) {
            return;
        }

    }
}

var renderInterval;

function setRenderInterval(time) {
    if(renderInterval) {
        window.clearInterval(renderInterval);
    }

    renderInterval = window.setInterval(function() {
        render();
    },time)
}

setRenderInterval(20);


function savefile(type) {
    window.parent.savefile(document.getElementById("filename1").value, canvas.toDataURL('image/'+fileformat), 1);
    parent.notification("Paint2","Saved image as: <a href='#' onclick=\\\"parent.run(\'paint2\','"+document.getElementById("filename1").value + "')\\\">"+document.getElementById("filename1").value+"</a>.");
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
    ["Undo","undo()"],["Redo","redo()","disabled"],["<hr>"],
    ["Time between Frames: 20ms","setRenderInterval(20)"],
    ["Time between Frames: 50ms","setRenderInterval(50)"],
    ["Time between Frames: 100ms","setRenderInterval(100)"],
    ["Time between Frames: 200ms","setRenderInterval(200)"]

]);
}