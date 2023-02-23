async function getData(url) {
    try{
        return await fetch(`${api}/${url} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
            .then(response => response.json())
            .then(res => res)
            .catch(console.log)
    }
    catch (e) {
        console.log(e)
    }
};