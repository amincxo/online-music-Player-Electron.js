let songs = [];
let currentSongIndex = 0;
let isShuffling = false;
let isRepeating = false;
let isRepeatingAll = false;
const audio = document.getElementById('audio');
const audioSource = document.getElementById('audioSource');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const progressSlider = document.getElementById('progress');
const volumeSlider = document.getElementById('volume');
const coverImage = document.getElementById('cover');
const trackNameDisplay = document.getElementById('trackName');
const artistNameDisplay = document.getElementById('artistName');
const playlistDiv = document.getElementById('playlist');
const playlistItemsDiv = document.getElementById('playlistItems');
const modal = document.getElementById('modal');
const defRoute = "http://gr.vaxgame.top:3000/";
const urlapi = `${defRoute}api/enallsong/`;
const urlstream = `${defRoute}stream/`;

async function fetchSongs() {
    const response = await fetch(urlapi);
    const data = await response.json();
    songs = data.songs;
    loadSong(currentSongIndex);
    displayPlaylist();
}

function loadSong(index) {
    audioSource.src = urlstream + songs[index].src;
    coverImage.src = defRoute + songs[index].cover;
    trackNameDisplay.textContent = songs[index].name;
    artistNameDisplay.textContent =  songs[index].artist;
    audio.load();
}

function playPause() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error('Autoplay was prevented:', error);
        });
    } else {
        audio.pause();
    }
}

function prevSong() {
    currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songs.length - 1;
    loadSong(currentSongIndex);
    audio.play();
}

function showVolumeModal() {
    document.getElementById('volumeModal').style.display = 'block';
}

function closeVolumeModal() {
    document.getElementById('volumeModal').style.display = 'none';
}

document.getElementById('volumeControl').oninput = function() {
    audio.volume = this.value / 100;
};

function nextSong() {
    if (isShuffling) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
    }
    loadSong(currentSongIndex);
    audio.play();
}

audio.ontimeupdate = function() {
    const currentTime = Math.floor(audio.currentTime);
    const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
    const seconds = String(currentTime % 60).padStart(2, '0');
    currentTimeDisplay.textContent = `${minutes}:${seconds}`;
    progressSlider.value = (audio.currentTime / audio.duration) * 100 || 0;
};

audio.onloadedmetadata = function() {
    const totalDuration = Math.floor(audio.duration);
    const totalMinutes = String(Math.floor(totalDuration / 60)).padStart(2, '0');
    const totalSeconds = String(totalDuration % 60).padStart(2, '0');
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
};

progressSlider.oninput = function() {
    audio.currentTime = (progressSlider.value / 100) * audio.duration;
};


function displayPlaylist() {
    playlistItemsDiv.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'playlist-item';
        songItem.onclick = () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            audio.play();
        };

        const img = document.createElement('img');
        img.src = defRoute + song.cover;
        img.alt = song.name;

        songItem.textContent = `${song.name} - ${song.artist}`;
        songItem.prepend(img);
        playlistItemsDiv.appendChild(songItem);
    });
}

audio.onended = function() {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
    } else if (isRepeatingAll) {
        currentSongIndex = (currentSongIndex < songs.length - 1) ? currentSongIndex + 1 : 0;
        loadSong(currentSongIndex);
        audio.play();
    } else {
        nextSong();
    }
};

function showModal(message) {
    modal.textContent = message;
    modal.style.display = 'block';
    modal.style.opacity = '1';
    setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }, 5000);
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    showModal(`تکرار یک آهنگ: ${isRepeating ? 'فعال' : 'غیرفعال'}`);
}

function shuffleSongs() {
    isShuffling = !isShuffling;
    showModal(`شافل: ${isShuffling ? 'فعال' : 'غیرفعال'}`);
}

function toggleRepeatAll() {
    isRepeatingAll = !isRepeatingAll;
    showModal(`تکرار کل لیست: ${isRepeatingAll ? 'فعال' : 'غیرفعال'}`);
}

function togglePlaylist() {
    if (playlistDiv.style.display === 'none' || playlistDiv.style.display === '') {
        playlistDiv.style.display = 'block';
        playlistDiv.classList.add('show');
    } else {
        playlistDiv.style.display = 'none';
        playlistDiv.classList.remove('show');
    }
}

fetchSongs();
