var playlist = [];

function customPlay() {
    var player = document.querySelector("video");
    button = document.getElementById('play');

    if(player.getAttribute("src")!=""){
        if (player.paused) {
            player.play();
            button.textContent = "||"; 
        } else {
            player.pause();
            button.textContent = "►";
        }
    }
}

function customStop(){
    var player = document.querySelector("video");

    if(player.getAttribute("src")!=""){
        player.pause();
        player.currentTime = 0;

        document.getElementById('play').textContent = "►";
    }
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
    var player = document.querySelector("video");
    if(player.getAttribute("src")!=""){
        //On enregistre l'état du lecteur pause ou play
        var status = player.paused;
        //Si le lecteur est sur play, on le stop
        if(status === false){
            player.pause();
        }

        var parent = getPosition(control);    // La position absolue de la progressBar
        var target = getMousePosition(event); // L'endroit de la progressBar où on a cliqué
        var x = target.x - parent.x; 
        var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
        
        var percent = Math.ceil((x / wrapperWidth) * 100);    
        var duration = player.duration;
        
        player.currentTime = (duration * percent) / 100;
        
        //Si le lecteur était sur play, on le relance
        if(status === false){
            player.play();
        }
    }
}
function show(elem) {
    elem.hidden = false;
}

function getVideo(elem) {
    //On cache le champ qui permet de rentrer un url
    elem.hidden = true;

    //On enregistre la taille de la liste avant modification
    var previousLength = playlist.length;

    //On récupère l'URL et on le modifie pour pouvoir y accéder
    var lien = document.getElementById('lienXML').value;
    lien = 'https://cors-anywhere.herokuapp.com/' + lien;

    //On exécute notre requête pour récupérer tous les "item" du fichier XML
    var request = new XMLHttpRequest();
    request.open("GET", lien);
    request.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.status === 200) {
            var xml = this.responseXML;
            listElem =xml.getElementsByTagName("item")
            for (var i = 0; i < listElem.length; i++) {
                playlist.push(listElem[i]);
            }
            updateVideoList(previousLength);
        }
    })
    request.send();
}

//Fonction qui ajoute des div à la page web
function updateVideoList(previousLength) {

    //Si la liste était vide auparavant, on enlève le texte d'information de la liste
    if(previousLength == 0){
        var list = document.getElementById("listeVideo");
        list.innerHTML = "";
    }

    //Pour chaque nouvel élément de la liste on ajoute un div
    for (var i = previousLength; i < playlist.length; i++) {
        newDiv = createVideoElem();
        newVideo(playlist[i], newDiv);
    }

    //Si la liste était vide auparavant, on démarre la première vidéo
    if(previousLength == 0){
        StartFirstVid();
    }
}


function newVideo(item, div) {
    var titre = item.getElementsByTagName("title")[0].textContent;
    var img = item.getElementsByTagName("itunes:image")[0].getAttribute("href");

    div.querySelector("h3").innerHTML = titre;
    div.querySelector("img").setAttribute("src",img);
}

//Création d'une div de vignette vidéo
function createVideoElem(){
    var list = document.getElementById("listeVideo");

    var newDiv = document.createElement("div");
    list.appendChild(newDiv);
    newDiv.setAttribute("class","vignette");

    var title = document.createElement("h3");
    title.innerHTML ="default";
    newDiv.appendChild(title);

    var image = document.createElement("img");
    image.setAttribute("src", "null");
    image.setAttribute("class","IMGvignette")
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
    button3.setAttribute("onclick", "RemoveVid(this)");
    newDiv.appendChild(button3);

    return newDiv;
}

//Déplace l'élément vers le haut dans la liste
function moveUp(elem){
    elem = elem.parentNode;

    //Si c'est le premier de la liste, quitte la fonction
    if(elem.previousSibling === null){return;}

    //On récupère son index
    var i = whichChild(elem);
    //On l'échange de place dans la playlist
    var temp  = playlist[i];
    playlist[i] = playlist[i-1];
    playlist[i-1]= temp;
    //On insère l'élément avant celui qui le précède
    elem.parentNode.insertBefore(elem,elem.previousSibling);

    //Si on change la vidéo courrante d'une place, on démarre la nouvelle vidéo 0
    if(i-1===0){
        StartFirstVid();
    }
}


//Déplace l'élément vers le bas dans la liste
function moveDown(elem){
    elem = elem.parentNode;

    //Si c'est le dernier de la liste, quitte la fonction
    if(elem.nextSibling === null){return;}

    //On récupère son index
    var i = whichChild(elem);
    //On l'échange de place dans la playlist
    var temp  = playlist[i];
    playlist[i] = playlist[i+1];
    playlist[i+1]= temp;
    //On insère l'élément après celui qui le suit
    elem.parentNode.insertBefore(elem,elem.nextSibling.nextSibling);
    //Si on change la vidéo courrante d'une place, on démarre la nouvelle vidéo 0
    if(i===0){
        StartFirstVid();
    }
}

//Supprime la vidéo précédente et démarre la suivante
function StartNextVid(){
    DeleteFirstVid();
    if(playlist.length != 0){
        StartFirstVid();
    }
}

//Démarre la vidéo à l'index 0
function StartFirstVid(){
    var player = document.querySelector("video");
    var lien = playlist[0].getElementsByTagName("enclosure")[0].getAttribute("url");
    //Change le lien de la vidéo
    player.setAttribute("src",lien);
    //Démarre la video
    customPlay();
}

//Supprime une vidéo dans la liste d'attente
function RemoveVid(elem){
    var elem = elem.parentNode;
    var list = document.getElementById("listeVideo");

    //On compte pour savoir quelle est la position de la vidéo dans la liste de div
    var  i= whichChild(elem);

    //Si on supprime la vidéo courrante
    if(i===0){
        StartNextVid();
    } else {
    //Sinon on supprime la vidéo de la liste de Div et de la playlist
        list.removeChild(elem);
        playlist.splice(i,1);   //Param1 : Position, param2 : nb d'elem a supprimer
    }   
}

//Fonction qui retourne l'index de l'élement dans la liste de son parent
function whichChild(elem){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

//Supprime le premier élément de la liste
function DeleteFirstVid(){
    var list = document.getElementById("listeVideo");
    //Supprime le premier élément de la liste et décale tous les autres élément à l'index inférieur
    playlist.shift();
    list.removeChild(list.children[0]);
}