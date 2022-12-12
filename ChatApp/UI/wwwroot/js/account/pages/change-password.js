document.getElementById('change-password').addEventListener("submit", async function(event) {
    event.preventDefault();
    await getClaims().then( async claims => {
        const changePasswordUrl = "https://localhost:7030/api/profile/password/change";
        const changeData = {
            userId: claims['id'],
            oldPassword: event.target['password'].value,
            newPassword: event.target['new-password'].value
        };
        try {
            await changePasswordAsync(changePasswordUrl, changeData)
                .then((data) => {
                    console.log(data);
                    document.querySelector("#result").innerHTML = data;
                });
        }
        catch (error){
            console.log('fail for changing password');
            document.getElementById('result').innerHTML = "wrong credentials or new password isn't safe";
            document.getElementById('reset').click();
            //window.location.reload();
        }

    });
})

async function changePasswordAsync (url, data) {
    const response = await fetch( url, {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
            //'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });

    if (response.status > 300){
        throw new Error();
    }

    return await response.json();
}