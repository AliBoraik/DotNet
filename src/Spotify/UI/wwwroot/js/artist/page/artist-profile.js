async function onLoad(){
    const pathname = window.location.pathname;
    const artistId = pathname.split('/')[2];
    fetch(`${api}/user/content/name/${artistId}`)
        .then(response => response.json())
        .then(data => {
            const name = document.getElementById('artist-name')
            name.innerText = data['name']
        })
    
    getPlaylists(artistId).then(result => {
        console.log(result)
        result.map(playlist =>{
                if(playlist['playlistType'] == 0){
                    document.querySelector("#albums")
                        .appendChild(new PlaylistCard(
                            "",
                            playlist['title'],
                            "Album",
                            playlist['id'])
                            .render());
                }
                if(playlist['playlistType'] == 1){
                    document.querySelector("#singles-and-eps")
                        .appendChild(new PlaylistCard(
                            "",
                            playlist['title'],
                            "Album",
                            playlist['id'])
                            .render());
                }
                if(playlist['playlistType'] == 2){
                    document.querySelector("#singles-and-eps")
                        .appendChild(new PlaylistCard(
                            "",
                            playlist['title'],
                            "EP",
                            playlist['id'])
                            .render());
                }
    }
    )
})}
$( document ).ready(onLoad)
