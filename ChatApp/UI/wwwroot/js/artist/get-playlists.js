async function getPlaylists(artistId){
    const response = await fetch( `${api}/user/content/playlists/${artistId}`)
        .then(response => response.json())
    return await response
}
