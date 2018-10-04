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
    var duration = player.duration;    // Durée totale
    var time = player.currentTime; // Temps écoulé
    var fraction = time / duration;
    var percent = Math.ceil(fraction * 100);

    var progress = document.querySelector('#progressBar');

    progress.style.width = percent + '%';
    var time = format(Math.floor(player.currentTime / 60)) + " : " + format(Math.floor(player.currentTime) % 60);
    var duration = format(Math.floor(player.duration / 60)) + " : " + format(Math.floor(player.duration) % 60);
    document.getElementById('progressTime').textContent = time + " / " + duration;
}


function format(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}