/*import {api} from "./consts";*/

async function getClaims(){
    const response = await fetch(`${api}/auth/validate_token`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    }).then(response => response.json())
    return await response
}