const video = document.querySelector(".fullscreen-video");
const canvas = document.querySelector("#canvas");
const cover = document.querySelector(".cover");
const title = document.querySelector(".menu-title");
const liveInfo = document.querySelector(".live-info");
const playInfo = document.querySelector(".play-info");
const counter = document.querySelector(".counter");
const congrtas = document.querySelector(".bro-won");
const replayInfo = document.querySelector(".replay-info");
const liveCounter = document.querySelector(".lives");

let ctx = canvas.getContext("2d");
let mouseX, mouseY;
let videoDrawWidth, videoDrawHeight, videoX, videoY;

const debounceTime = 50;
const treshold = 190;
let timeout = 0;
let lives = 3;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
    updateDemensions();

    ctx.drawImage(video, videoX, videoY, videoDrawWidth, videoDrawHeight);

    document.addEventListener("keydown", function handler(event) {
        if (event.keyCode != 32) { return; }
        event.currentTarget.removeEventListener("keydown", handler);
        playVideo();
    });

    document.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    video.addEventListener("play", function(event) {
        mainLoop();
    });

    video.addEventListener("ended", function(event) {
        cover.style.display = "block";
        congrtas.style.display = "block";
        replayInfo.style.display = "block";
        liveCounter.style.display = "none";

        document.addEventListener("keydown", function handler(event) {
            if (event.keyCode != 32) { return; }
            event.currentTarget.removeEventListener("keydown", handler);

            video.currentTime = 0;
            video.pause();

            reset();
            playVideo();
        });
    });
}

function updateDemensions() {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    const canvasAspect = canvas.width / canvas.height;
    const videoAspect = videoWidth / videoHeight;

    if (videoAspect > canvasAspect) {
        videoDrawWidth = canvas.width;
        videoDrawHeight = canvas.width / videoAspect;
        videoX = 0;
        videoY = (canvas.height - videoDrawHeight) / 2;
    } else {
        videoDrawHeight = canvas.height;
        videoDrawWidth = canvas.height * videoAspect;
        videoX = (canvas.width - videoDrawWidth) / 2;
        videoY = 0;
    }
}

function reset() {
    congrtas.innerHTML = "Congratulations!!";
    counter.style.display = "none";
    congrtas.style.display = "none";
    replayInfo.style.display = "none";
    liveCounter.style.display = "none";

    timeout = 0;
    lives = 3;
}

async function playVideo() {
    title.style.display = "none";
    liveInfo.style.display = "none";
    playInfo.style.display = "none";
    counter.style.display = "block";
    
    for (let i = 3; i >= 1; i--) {
        counter.innerHTML = i;
        await sleep(1000);
    }
    
    liveCounter.style.display = "block";
    cover.style.display = "none";
    counter.style.display = "none";
    
    video.play();
}

function mainLoop() {
    if (video.paused || video.ended) { return; }
    updateDemensions();

    ctx.drawImage(video, videoX, videoY, videoDrawWidth, videoDrawHeight);

    const pixel = ctx.getImageData(mouseX/window.innerWidth * canvas.width, mouseY/window.innerHeight * canvas.height, 1, 1).data;

    const red = pixel[0];
    const green = pixel[1];
    const blue = pixel[2];
    const luminance = 0.299*red + 0.587*green + 0.114*blue;

    if (luminance < treshold && timeout <= 0) {
        lives -= 1;
        liveCounter.innerHTML = "Lives: " + lives;
        timeout = debounceTime;
    } else {
        timeout--;
    }

    if (lives <= 0) {
        death();
    }

    requestAnimationFrame(mainLoop);
};

function death() {
    congrtas.innerHTML = "Game Over";
    cover.style.display = "block";
    congrtas.style.display = "block";
    replayInfo.style.display = "block";
    liveCounter.style.display = "none";

    video.currentTime = 0;
    video.pause();

    document.addEventListener("keydown", function handler(event) {
        if (event.keyCode != 32) { return; }
        event.currentTarget.removeEventListener("keydown", handler);

        reset();
        playVideo();
    });
}