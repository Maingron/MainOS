var addiconstothese = document.getElementsByClassName("addfaviconicons")[0].querySelectorAll("a");

for (var i = 0; i < addiconstothese.length; i++) {
    var url = addiconstothese[i].href;
    var result = appendResult(url);
    addiconstothese[i].prepend(result);
    addiconstothese[i].classList.add("has_hover");
}

function appendResult(url) {
    var result = "https://www.google.com/s2/favicons?sz=32&domain_url=" + url;
    var newElement = document.createElement("img");
    newElement.setAttribute("loading", "lazy");
    newElement.src = result;
    return newElement;
}