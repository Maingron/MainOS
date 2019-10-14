var requested = window.location + "";
requested = requested.split("\#")[1];
  try {
    var xhr=new XMLHttpRequest();
    xhr.open("GET",requested,false);
    xhr.onload=function(){
      document.body.parentElement.innerHTML = xhr.response;
    }
    xhr.send();

  } catch (e) {
  }
