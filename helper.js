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
    