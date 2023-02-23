/**
 * Spotify playlist card
 * @link https://pastebin.com/nfAen0t4 usage with pics and code
 * @param {string} img src for img background, if leave empty string then fill with base gradient
 * @param {string} title title for card
 * @param {string} type ["Album", "EP", "Single", "PLAYLIST"] ("PLAYLIST" renders user custom playlist marker)
 * @param {int} id id for card
 * @param {string} user by user for card
 */
class PlaylistCard {
    constructor(img = "", title, type = "", id, user = "") {
        this.img = img;
        this.title = title;
        this.type = type;
        this.id = id;
        this.user = user;
    }
    
    /**
     * render created card
     * @returns {Element} - html element of card
     */
    render() {
        const card = document.createElement("div");
        card.className = "card";
        card.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("button-on-card")) {
                e.stopPropagation();
                e.target.classList.toggle("card-active");
                if (e.target && e.target.classList.contains("card-active"))
                    UploadTrack(1, this.id);
                else Pause(e);
            }
            else{
                let location = `/Playlist/${this.id}`;
                $('#renderBody').load(location +'Partial');
                window.history.pushState(null, null, location);
                /*$( document ).ajaxStop(showPlaylistInfo);*/
            }
                /*window.location.href = `/Playlist/${this.id}`;*/
        });
        
        if (this.user.length > 4) 
            this.user = this.user.slice(0, 4) + "..";
        
        if (this.title.length > 13) 
            this.title = this.title.slice(0, 13) + "..";
        
        let cover = !this.user ? 
            `<h2 class="cover-description">${this.type}</h2>` :
            `<h2 class="cover-description">By ${this.user} 
                <span class="playlist-marker">${this.type}</span>
            </h2>`
        
        let watermark = this.img === "" ? 
            `<div class="watermark empty"></div>` :
            `<img src="${this.img}" alt="" class="watermark"/>`
        
        card.innerHTML = ` 
            <div class="cover">
                ${watermark}
                <div class="button-on-card"></div> <!--can be made active with "card-active" class-->
                <div class="cover-text">
                    <h1 class="cover-title">${this.title}</h1>
                    ${cover}
                </div>
            </div>`
        
        return card;
    }
}