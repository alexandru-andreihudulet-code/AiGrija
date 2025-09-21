window.addEventListener("load", () => {
    const player = document.querySelector('audio');
    const playList = document.querySelector('div[data-name="playlist"]');
    const playerProgressBar = document.querySelector('.player-wrapper>input[type="range"]');
    const randomBtn = document.querySelector('button[data-name="player-random"]');
    const prevBtn = document.querySelector('button[data-name="player-prev"]');
    const playPauseBtn = document.querySelector('button[data-name="player-play-pause"]');
    const nextBtn = document.querySelector('button[data-name="player-next"]');
    const loopBtn = document.querySelector('button[data-name="player-loop"]');
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    const tracks = Array.from(playList.children).map(elem => `/media/${elem.dataset.videoFile}`)

    let currentTrack = 0;
    let playInLoop = false;
    let playRandom = false;

    loopBtn.addEventListener("click", () => {
        playInLoop = !playInLoop
        if(playInLoop){
            loopBtn.classList.add("active");
        }
        else {
            loopBtn.classList.remove("active");
        }
    })

    randomBtn.addEventListener("click", () => {
        playRandom = !playRandom
        if(playRandom){
            randomBtn.classList.add("active");
        }
        else {
            randomBtn.classList.remove("active");
        }
    })
    
    player.src = tracks[currentTrack];
    playList.children[0].classList.add("selected");
    player.onplaying = () => {
        console.log("playing")
    }

    const clearSelectedTrack = () => {
        Array.from(playList.children).forEach(element => {
            element.classList.remove("selected");
        });
    }

    const selectTrack = (index) => {
        currentTrack=index;
        clearSelectedTrack()
        playList.children[index].classList.add("selected");
        if (tracks[index]) {
            player.src = tracks[index];
        }

    }

    playList.addEventListener("click", (e) => {
        fileName = e.target?.dataset?.videoFile;
        selectedTrack = tracks.indexOf(`/media/${fileName}`);
        selectTrack(selectedTrack);
    })
    playPauseBtn.addEventListener("click", () => {
        if(player.paused){
            player.play()
        }
        else {
            player.pause();
        }
    })
    player.onplay = () => {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    }
    player.onpause = () => {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }

    player.onloadeddata = () => {
        playerProgressBar.min = 0;
        playerProgressBar.max = player.duration;
        playerProgressBar.value = 0;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    player.onended = () => {
        if(!playRandom && currentTrack === tracks.length - 1){
            if(playInLoop){
                currentTrack = 0;
                selectTrack(currentTrack);
            }
            else {
                currentTrack = 0;
                player.currentTime = 0;
                playerProgressBar.value = 0;
                player.pause();
            }
        }
        else {
            if(!playRandom)selectTrack(++currentTrack)
        }
        if(playRandom){
            const randomTrack = getRandomInt(0, tracks.length - 1);
            selectTrack(randomTrack);
        }
    }
    
    const tick = setInterval(() => {
        if(!player.paused){
            playerProgressBar.value = player.currentTime;
        }
    }, 100)

    playerProgressBar.oninput = (e) => {
        player.currentTime = e.target.value;
    }

    nextBtn.addEventListener("click", () => {
        if(currentTrack === tracks.length - 1)return;
        selectTrack(++currentTrack)
    })

    prevBtn.addEventListener("click", () => {
        if(currentTrack === 0)return;
        selectTrack(--currentTrack)
    })
    
})

