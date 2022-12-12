let trackContainer   = document.querySelector(".player-track"),
    trackPosition    = document.querySelector(".player-set"),
    volumeContainer  = document.querySelector(".volume-track"),
    volumePosition   = document.querySelector(".volume-set"),
    playPauseButton     = document.querySelector(".play"),
    forwardButton     = document.querySelector(".step_forward"),
    backButton     = document.querySelector(".step-back"),
    currentTrackTime = document.querySelector("#current"),
    trackDuration     = document.querySelector("#duration"),
    likeButton          = document.querySelector(".like"),
    repeatButton        = document.querySelector(".repeat"),
    shuffleButton       = document.querySelector(".shuffle"),
    playlistButton      = document.querySelector(".bar-playlist-btn"),
    volumeButton        = document.querySelector(".volume"),
    repeatSong       = document.querySelector("#repeat-song"),
    cover       = document.querySelector(".cover"),
    trackName       = document.querySelector(".marquee"),
    artistName       = document.querySelector(".artist");

let audio = new Audio();
let currentPlaylist;
let currentSong;

let interval;
const replay = {NoReplay: 0, Song: 1, Playlist: 2}

/*           states         */

let paused = true;
let shuffle = false;
let liked = false;
let mute = false;
let trackDragging = false;
let volumeDragging = false;
let playlistOpen = false;
let playbackState = 0;
let volume;



/*          set audio           */

function UploadTrack(number, playlistId){
    if (!getToken()){
        window.location.href = "/Account/Login";
        return;
    }
    GetPlaylist(playlistId)
        .then(res => currentPlaylist = res)
        .then(async () => await SetTrack(number-1))
        .then(() => Play());    
}

async function SetTrack(number){
    let artistName;
    GetArtistInfo(number)
        .then(async res => {
            artistName = res['username'];
            currentSong = {number: number, ...currentPlaylist['songs'][number], artistName: artistName};
            await SetSongInfo(number);
            await SetAudioFileById(currentSong.id);})
}

async function SetSongInfo() {
    SetSliderPosition(trackPosition, 0);
    currentTrackTime.innerText = '0:00';
    SetCoverByPlaylistId(currentPlaylist.id);
    artistName.innerText = currentSong['artistName'];
    trackName.innerText = currentSong.name;
    artistName.href = `/Artist/${currentSong['userId']}`;
    trackName.href = `/Playlist/${currentSong['originPlaylistId']}`;
    let isLiked = await IsSongLiked(currentSong['id']);
    if(isLiked){
        liked = true;
        likeButton.firstElementChild.className = "bi bi-heart-fill";
    }
    else {
        liked = false;
        likeButton.firstElementChild.className = "bi bi-heart";
    }
}

audio.addEventListener('loadeddata', () => {
    trackDuration.innerText = GetFormattedTime(audio.duration);
    if(!paused){
        Play();
    }
    // The duration variable now holds the duration (in seconds) of the audio clip
})

audio.addEventListener('ended', () => {
    if (shuffle){
        SetRandomTrack()
        return;
    }
    if(currentPlaylist['songs'][currentSong.number+1]!==undefined)
        SetTrack(currentSong.number+1);
    else if (playbackState === replay.Playlist){
        SetTrack(0);
    }
    // The duration variable now holds the duration (in seconds) of the audio clip
})



/*          control buttons         */

playPauseButton.addEventListener("click", function () {
    PlayPause();
});

likeButton.addEventListener("click", function () {
    if(liked){
        RemoveFromYourLibrary();
    }
    else {
        AddToYourLibrary();
    }
});

shuffleButton.addEventListener("mouseup", function () {
    if(shuffle){
        shuffle = false;
        shuffleButton.firstElementChild.classList.remove("active");
    }
    else {
        shuffle = true;
        shuffleButton.firstElementChild.classList.add("active");
    }
});

playlistButton.addEventListener("click", function () {
    /*if(playlistOpen){
        playlistOpen = false;
        playlistButton.firstElementChild.classList.remove("active");
    }
    else {
        playlistOpen = true;
        playlistButton.firstElementChild.classList.add("active");*/
        let currentPath = window.location.pathname;
        let location = `/Playlist/${currentPlaylist.id}`;
        if (currentPath !== location){
            $('#renderBody').load(location +'Partial');
            window.history.pushState(null, null, location);
        }
    
});

repeatButton.addEventListener("click", function () {
    if(playbackState === replay.NoReplay){
        playbackState = replay.Playlist;
        repeatButton.firstElementChild.classList.add("active");
        audio.loop = false;
    }
    else if(playbackState === replay.Playlist){
        playbackState = replay.Song;
        repeatSong.className = "repeat-song";
        audio.loop = true;
    }
    else if(playbackState === replay.Song){
        playbackState = replay.NoReplay;
        repeatSong.classList.remove("repeat-song")
        repeatButton.firstElementChild.classList.remove("active");
        audio.loop = false;
    }
});

forwardButton.addEventListener('click', function () {
    if(currentPlaylist['songs'][currentSong.number+1]!==undefined) {
        SetTrack(currentSong.number + 1);
    }
    else if (playbackState === replay.Playlist){
        SetTrack(0);
    }
})

backButton.addEventListener('click', () => {
    if(currentPlaylist['songs'][currentSong.number-1]!==undefined)
        SetTrack(currentSong.number-1);
    else if (playbackState === replay.Playlist){
        SetTrack(currentPlaylist['songs'].length-1);
    }
})



/*          track position          */

trackContainer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    trackDragging = true;
});

window.addEventListener('mouseup', function() {
    trackDragging = false;
})

window.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (trackDragging) {
        let position = GetSliderPosition(event, trackContainer);
        SetSliderPosition(trackPosition, position);
        currentTrackTime.innerText = GetFormattedTime((position / 100) * audio.duration);
        audio.currentTime = position / 100 * audio.duration;
    }
});



/*          volume setup           */

volumeButton.addEventListener("click", function () {
    if (mute && volume>0) {
        SoundTurnOn();
        volumePosition.style.width = `${volume}px`;
        audio.volume = volume/100;
    } else {
        SoundTurnOff();
        volume = volumePosition.offsetWidth;
        volumePosition.style.width = "0%";
        audio.volume = 0;
    }
});

volumeContainer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    volumeDragging = true;
});

window.addEventListener('mouseup', function() {
    volumeDragging = false;
});

window.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (volumeDragging) {
        let position = GetSliderPosition(event, volumeContainer);
        SetSliderPosition(volumePosition, position);
        (position <= 0) ? SoundTurnOff() : SoundTurnOn();
        volume = volumePosition.offsetWidth;
        audio.volume = position/100;
    }
});



/*          helpers          */

function SetSliderPosition(slider, position){
    let offset = position;
    if(offset <= 0) {
        offset = 0;
    } else if(offset > 100) {
        offset = 100;
    }
    slider.style.width = `${offset}%`;
}
function GetSliderPosition(event, sliderContainer){
    let position = Math.round(((event.clientX - sliderContainer.offsetLeft) / sliderContainer.offsetWidth) * 100);
    if (position > 100){
        position = 100;
    } 
    if (position < 0){
        position = 0;
    }
    return position;
}

function SoundTurnOff(){
    mute = true;
    volumeButton.firstElementChild.className = "bi bi-volume-mute-fill";
}
function SoundTurnOn(){
    mute = false;
    volumeButton.firstElementChild.className = "bi bi-volume-down-fill";
}

function PlayPause(){
    if(paused){
        Play();
    }
    else {
        Pause();
    }
}
function Play() {
    paused = false;
    audio.play();
    playPauseButton.firstElementChild.className = "play-pause fas fa-pause";
    interval = setInterval(() => {
        currentTrackTime.innerText = GetFormattedTime(Math.round(audio.currentTime));
        trackPosition.style.width = `${100 / audio.duration * audio.currentTime}%`;
    }, 10);
}
function Pause() {
    paused = true;
    audio.pause();
    playPauseButton.firstElementChild.className = "play-pause fas fa-play";
    clearInterval(interval);
}

async function AddToYourLibrary(){
    let res = await GetUserId();
    fetch(`${api}/song/likeSong?songId=${currentSong.id}&userId=${res['id']}`, {
        method: 'POST',
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }})
        .catch(console.log)
    liked = true;
    likeButton.firstElementChild.className = "bi bi-heart-fill";
}
async function RemoveFromYourLibrary(){
    let res = await GetUserId();
    fetch(`${api}/song/deleteLikeSong?songId=${currentSong.id}&userId=${res['id']}`, {
        method: 'POST',
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }})
        .catch(console.log)
    liked = false;
    likeButton.firstElementChild.className = "bi bi-heart";
}

function SetAudioFileById(id){
    audio.src = `${api}/files/song?songId=${id}`;
}
function SetCoverByPlaylistId(id) {
    cover.src = `${api}/files/picture/playlist?playlistId=${id}`;
}
//converts (number)seconds to (string)mm:ss format
function GetFormattedTime(dur){
    let min = (dur - dur%60)/60;
    let sec = ("0"+Math.round(dur%60)).slice(-2);
    return min + ":" + sec;
}

async function GetPlaylist(id){
    return await fetch(`${api}/playlist/${id}`, {
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => response.json())
        .catch(console.log)
}

async function GetArtistInfo(number) {
    return await fetch(`${api}/profile/getProfile?userId=${currentPlaylist['songs'][number]['userId']}`, {
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }})
        .then(response => response.json())
        .catch(console.log)
}

async function IsSongLiked(sid){
    let res = await GetUserId();
    return await fetch(`${api}/song/isSongLiked?songId=${sid}&userId=${res['id']}`, {
        headers : {
            'Method': 'GET',
            'Authorization': `Bearer ${getToken()}`
        }})
        .then(response => response.json())
        .then(res => res).catch(console.log)
    
}

function GetUserId(){
    return fetch(`${api}/auth/validate_token`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    }).then(response => response.json());
}

function SetRandomTrack() {
    SetTrack(Math.floor(Math.random() * currentPlaylist['songs'].length));
}
