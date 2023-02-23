async function getUserProfile(id) {
    return await fetch(`${api}/profile/getProfile?userId=${id}`, {
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => response.json())
        .then(res => res)
        .catch(console.log)
}