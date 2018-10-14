var playlist = [];
/*
window.onload = function(){
    playlist = new Array();
}*/
function customPlay(boutonID) {
    var player = document.querySelector("video");

    if (player.paused) {
        player.play();
        boutonID.textContent = "||"; 
    } else {
        player.pause();
        boutonID.textContent = "►";
    }
    
}

function customStop(){
    var player = document.querySelector("video");
    player.pause();
    player.currentTime = 0;

    document.getElementById('play').textContent = "►";
}

function controlVolume(value) {
    var player = document.querySelector("video");
    player.volume = value;
}

function update(player) {
    var time = player.currentTime;
    var duration = player.duration;
    var fraction = time / duration;
    var percent = Math.ceil(fraction * 100);

    var progress = document.querySelector('#progressBar');

    progress.style.width = percent + '%';
    var stringTime = format(time);
    var stringDuration = format(duration);
    document.getElementById('progressTime').textContent = stringTime + " / " + stringDuration;
}


function format(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time) % 60;
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    result = minutes +" : "+seconds;
    return result;
}

function getMousePosition(event) {
    return {
        x: event.pageX,
        y: event.pageY
    };
}

function getPosition(element){
    var top = 0;
    var left = 0;

    do{
        top += element.offsetTop;
        left += element.offsetLeft;
    }while (element = element.offsetParent);

    return{x: left, y:top};
}

function clickProgress(control, event) {
    var parent = getPosition(control);    // La position absolue de la progressBar
    var target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
    var player = document.querySelector("video");
    var x = target.x - parent.x; 
    var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    
    var percent = Math.ceil((x / wrapperWidth) * 100);    
    var duration = player.duration;
    
    player.currentTime = (duration * percent) / 100;
}
function show(elem) {
    elem.hidden = false;
}

function getVideo(elem) {
    elem.hidden = true;
    var lien = document.getElementById('lienXML').value;
    var lien = 'https://cors-anywhere.herokuapp.com/' + lien;

    var request = new XMLHttpRequest();
    request.open("GET", lien);
    request.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.status === 200) {
            var xml = this.responseXML;
            playlist = xml.getElementsByTagName("item");
            updateVideoList();
        }
    })
    request.send();
}


function updateVideoList() {
    for (var i = 0; i < playlist.length; i++) {
        //console.log(playlist[i].getElementsByTagName("enclosure")[0].textContent);
        //console.log(playlist[i].getElementsByTagName("itunes:image")[0].href);
        newVideo(playlist[i]);
    }
}

function addVideo() {
    var list = document.getElementById("listeVideo");
    if(list.children.length === 0){createVideoElem(list);}
    else{newVideo(list);}
}

function newVideo(list){
    var clone = list.children[0].cloneNode(true);
    list.appendChild(clone);
}

function newVideo(item) {
    var list = document.getElementById("listeVideo");
    var clone = list.children[0].cloneNode(true);
    var titre = item.getElementsByTagName("title")[0].textContent;
    var img = item.getElementsByTagName("itunes:image")[0].getAttribute("href");

    clone.querySelector("h2").innerHTML = titre;
    clone.querySelector("image").setAttribute("href",img);
    list.appendChild(clone);
}

//Création d'une div de vignette vidéo si aucune n'existe
function createVideoElem(list){
    list.innerHTML = "";

    var newDiv = document.createElement("div");
    list.appendChild(newDiv);
    newDiv.setAttribute("class","vignette");

    var title = document.createElement("h2");
    title.innerHTML ="default";
    newDiv.appendChild(title);

    var image = document.createElement("image");
    image.setAttribute("href", "null");
    image.setAttribute("width","150px");
    newDiv.appendChild(image);

    var button1 = document.createElement("input");
    button1.setAttribute("type","button");
    button1.setAttribute("value","↑");
    button1.setAttribute("onclick","moveUp(this)")
    newDiv.appendChild(button1);

    var button2 = document.createElement("input");
    button2.setAttribute("type","button");
    button2.setAttribute("value","↓");
    button2.setAttribute("onclick", "moveDown(this)");
    newDiv.appendChild(button2);

    var button3 = document.createElement("input");
    button3.setAttribute("type","button");
    button3.setAttribute("value","Delete");
    button3.setAttribute("onclick", "deleteVid(this)");
    newDiv.appendChild(button3);
}

//Déplace l'élément vers le haut dans la liste
function moveUp(elem){
    elem = elem.parentNode;

    //Si c'est le premier de la liste, quitte la fonction
    if(elem.previousSibling === null){return;}

    //On insère l'élément avant celui qui le précède
    elem.parentNode.insertBefore(elem,elem.previousSibling);
}


//Déplace l'élément vers le bas dans la liste
function moveDown(elem){
    elem = elem.parentNode;

    //Si c'est le dernier de la liste, quitte la fonction
    if(elem.nextSibling === null){return;}

    //On insère l'élément après celui qui le suit
    elem.parentNode.insertBefore(elem,elem.nextSibling.nextSibling);
}

//Supprime une vidéo dans la liste d'attente
function deleteVid(elem){
    var elem = elem.parentNode;
    var list = document.getElementById("listeVideo");
    list.removeChild(elem);
}

//Supprime une vidéo dans la liste d'attente
function deleteVid(){
    var list = document.getElementById("listeVideo");
    list.removeChild(list.children[0]);
}