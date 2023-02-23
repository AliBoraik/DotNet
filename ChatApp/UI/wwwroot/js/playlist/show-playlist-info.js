var playlistId = window.location.href.split('/').pop();
var nickname, userId, userType, playlist;
var playlistCreator = document.querySelector(".playlist-creator"),
    playlistType = document.querySelector(".playlist-type"),
    playlistName = document.querySelector(".playlist-name"),
    tracksAmount = document.querySelector("#tracks-amount"),
    songsPlacePlaylist = document.querySelector("#songs"),
    playlistImage = document.querySelector(".playlist-img"),
    playlistInfo = document.querySelector(".playlist-info");

window.addEventListener("load", showPlaylistInfo);
$(document).ajaxComplete(() => {
    if (window.location.pathname.split('/')[1] === 'Playlist'){
        showPlaylistInfo();
    }
});

async function showPlaylistInfo() {
    await getPlaylistInfo(playlistId)
        .then(async res => {
            playlist = res;
            await getUserProfile(playlist['userId'])
                .then(res => {
                    if (res)
                        nickname = res['username'];
                    else 
                        nickname = playlist['userId'];
                    
                    userId = playlist['userId'];
                    userType = userTypes[res['userType']];
                });
        });

    showSongs(playlist)

    let tracksCountWord = playlist['songs'].length !== 1 ? " tracks" : " track";
    
    playlistImage.src = playlist['imgSrc'] 
        ?`${api}/files/picture/playlist?playlistId=${playlist['id']}` 
        : playlistImage.classList.add('empty');
    playlistType.innerText = playlistTypes[playlist['playlistType']];
    playlistName.innerText = playlist['title'];
    playlistCreator.innerText = nickname;
    if (userType !== "Artist")
        userType = "User";
    playlistCreator.href = `/${userType}/${userId}`;
    tracksAmount.innerText = " • " + playlist['songs'].length + tracksCountWord;
    document.querySelector('.play-button').addEventListener('click', (e)=>{
        if (e.target && e.target.classList.contains("active")){
            UploadTrack(1, playlist['id']);
        }
        else
            Pause();
    })
    
    toggleLoading(playlistImage, playlistInfo);
}

async function getPlaylistInfo(id) {
    return await fetch(`${api}/playlist/${playlistId}`, {
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => response.json())
        .then(res => res)
        .catch(console.log)
}

function showSongs(playlist) {
    songsPlacePlaylist.innerHTML = "";
    let index = 1;
    playlist['songs'].forEach(song => {
        songsPlacePlaylist
            .appendChild(
                new SongCard(
                    index,
                    '',
                    song['name'],
                    nickname,
                    song['userId'],
                    playlist['title'],
                    playlist['id'],
                    "3:02", // TODO: что с этим делать
                    song["id"])
                    .render());
        index++;
    })
}