class SongCard {
    constructor(number, img="", name, artist, artistId, playlist, playlistId, time, trackId) {
        this.number = number;
        this.img = img;
        this.name = name;
        this.artist = artist;
        this.artistId = artistId;
        this.playlist = playlist;
        this.playlistId = playlistId;
        this.time = time;
        this.trackId = trackId;
    }

    render() {
        const songCard = document.createElement("div");
        songCard.className = "song-card";
        songCard.addEventListener("click", function(e) {
            // if (e.target && e.target.classList.contains("bi-three-dots")) {
            //     let menu = document.querySelector(".popup-menu");
            //     if (menu.style.display === "block")
            //         menu.style.display = "none";
            //     else {
            //         menu.style.display = "block";
            //     }
            // }
            
            if (e.target && e.target.classList.contains("like-btn")) {
                let userId;
                fetch(`${api}/auth/validate_token`, {
                    headers: {"Authorization": `Bearer ${getToken()}`}
                })
                    .then(response => response.json())
                    .then(res => {
                        userId = res['id'];
                        fetch(`${api}/song/likeSong?songId=${e.target.id}&userId=${userId}`,{
                            method: 'POST',
                        })
                            .then(res => {
                                if (res.status===400) {
                                    fetch(`${api}/song/deleteLikeSong?songId=${e.target.id}&userId=${userId}`, {
                                        method: 'POST'
                                    })
                                        .then(() => alert("You removed song from favourites"))
                                        .catch(console.log)
                                }
                                else {
                                    alert("You added this song to your favourite songs")
                                }
                        })
                            .catch(console.log)
                    })
            }
        });

        // document.querySelector(`#track${this.trackId}`).addEventListener("click", (e) => {
        //     fetch(`${api}/song/likeSong?songId=${this.trackId}&userId=${this.currentUser}`)
        //         .catch(console.log)
        // });
        
        songCard.innerHTML = `
            <div class="song-number">
                <div class="number">${this.number}</div>
                <div class="play-btn">
                    <svg width="20" height="20" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                    </svg>
                </div>
            </div>
            <div class="song-info">
                <div class="me-3" style="float:left;"> 
                    <img src="${api}/files/picture/playlist?playlistId=${this.playlistId}" width="40" height="40" alt=""> 
                </div>  
                <div class="ms-1" style="float:left;">
                    <div class="song-name">${this.name}</div>
                    <a href="/artist/${this.artistId}" class="song-artist">${this.artist}</a>
                </div>
            </div>
            
            <div class="song-album">
                <a href="/playlist/${this.playlistId}">${this.playlist}</a> 
            </div>
            <div class="song-time">
                <span class="me-3">${this.time}</span>              
                <button id="${this.trackId}" class="like-btn" id="like-btn">
                    <i class="bi bi-heart"></i>
                </button>
                <button class="three-dots-menu">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                    </svg>
                </button>
<!--                <div class="popup-menu">-->
<!--                    <p id="album">To album</p>-->
<!--                    <p id="playlist">Add to playlist</p>-->
<!--                </div> //TODO : three dots menu-->
            </div>
        `;

        // window.addEventListener("click", function (e){
        //     if (e.target && !e.target.classList.contains("like-btn")) {
        //         document.querySelector(".popup-menu").style.display = "none";
        //     }
        // })

        let play_btn = songCard.querySelector(".play-btn");
        play_btn.addEventListener("click", () => {
            /*UploadTrack(this.number, this.img, this.name, this.artist,
                this.artistId, this.playlist, this.playlistId, this.trackId);*/
            UploadTrack(this.number, this.playlistId);//Я знаю что криво
        });
        
        return songCard;
    }
}
