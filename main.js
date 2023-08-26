const video = document.querySelector(".fullscreen-video");
const cover = document.querySelector(".cover");
const title = document.querySelector(".menu-title");
const liveInfo = document.querySelector(".live-info");
const playInfo = document.querySelector(".play-info");
const counter = document.querySelector(".counter");
const congrtas = document.querySelector(".bro-won");
const liveCounter = document.querySelector(".lives");
let mouseX = 0;
let mouseY = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 32) {
            document.removeEventListener('keydown', playVideo);
            playVideo();
        }
    });
    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    video.addEventListener('ended', function(event) {
        video.style.display = "none";
        congrtas.style.display = "block";
        liveCounter.style.display = "none";
    });
}

async function playVideo() {
    title.style.display = "none";
    liveInfo.style.display = "none";
    playInfo.style.display = "none";
    counter.style.display = "block";
    liveCounter.style.display = "block";

    for (let i = 3; i >= 1; i--) {
        counter.innerHTML = i;
        await sleep(1000);
    }

    cover.style.display = "none";
    counter.style.display = "none";
    video.play();
    mainLoop();
}

function mainLoop() {
    requestAnimationFrame(mainLoop);
}