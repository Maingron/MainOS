// document.write("<link rel='stylesheet' type='text/css' href='../../helper.css'>");
// document.write("<link rel='stylesheet' type='text/css' href='../../../helper.css'>");

  
	document.documentElement.style.setProperty("--themecolor",window.parent.setting.themecolor);
    document.documentElement.style.setProperty("--font",window.parent.setting.font);
    document.documentElement.style.setProperty("--hovercolor",window.parent.setting.hovercolor);
    document.documentElement.style.setProperty("--hovercolornontransparent",window.parent.setting.hovercolornontransparent);
    // document.documentElement.style.setProperty("--darkmodeblack","#000");
    // document.documentElement.style.setProperty("--darkmodeblack2","#000");
    // document.documentElement.style.setProperty("--darkmodeblack3","#000");

    if(parent.setting.notsodarkmode == 1) {
      document.documentElement.style.setProperty("--black","#151515");
      document.documentElement.style.setProperty("--black2","#444");
      document.documentElement.style.setProperty("--black3","#555");
      document.documentElement.style.setProperty("--black4","#666");
      document.documentElement.style.setProperty("--black5","#757575");
    } 

    var data = {};
    data.system = {};
    data.system.mouse = {};
    

  document.addEventListener("contextmenu",function(event) {
    console.log(event);
    if(event.ctrlKey != true || event.shiftKey != true) {
      event.preventDefault();
      data.system.mouse.x = event.clientX;
      data.system.mouse.y = event.clientY;
      if(typeof contextMenu === "function") {
        contextMenu(event);
      }
    }

  });

  function spawnContextMenu(content) {
    if(document.getElementsByClassName("contextMenu")[0]) {
      document.getElementsByClassName("contextMenu")[0].outerHTML = "";
    }
    var newelement = document.createElement("div"); 
    newelement.classList.add("contextMenu");
    newelement.style.left = data.system.mouse.x + "px";
    newelement.style.top = data.system.mouse.y + "px";
    document.body.append(newelement);




    for(var i = 0; content.length > i; i++) {
      newelement = document.getElementsByClassName("contextMenu")[0];
      if(content[i][0] == "<hr>") {
        var newcontextelement = document.createElement("hr"); 
      } else {
        var newcontextelement = document.createElement("a"); 
        newcontextelement.innerHTML = content[i][0];
        newcontextelement.href = "javascript:"+content[i][1];
        if(content[i][2] && content[i][2] == "disabled") {
          newcontextelement.removeAttribute("href")
        }
  
      }
      newelement.append(newcontextelement);
    }

    newelement.parentElement.addEventListener("click",function() {
      newelement.outerHTML = "";
    })
  }