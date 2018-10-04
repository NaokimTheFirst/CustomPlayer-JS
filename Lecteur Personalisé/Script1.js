// JavaScript source code
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
   console.log("called");
    var x = target.x - parent.x; 
    var wrapperWidth = document.querySelector('#progressBarControl').offsetWidth;
    
    var percent = Math.ceil((x / wrapperWidth) * 100);    
    var duration = player.duration;
    
    player.currentTime = (duration * percent) / 100;
}