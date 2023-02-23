function setChange(userId, premiumId){
    const change_btn = document.getElementById('change')
    let formData = new FormData()
    formData.append('userId', userId)
    formData.append('premiumId', premiumId)
    document.addEventListener("click", function (){
        fetch(`${api}/profile/changePremium`, {
            method: 'POST',
            body: formData
        })
        window.location.href = 'Plans'
    })
}



function onLoad(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const premiumId = urlParams.get('planId')
    fetch(api + "/auth/validate_token", {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => response.json())
        .then(data =>{
        getPremium(premiumId)
        setChange(data["id"], premiumId)
    })
    
}
$( document ).ready(onLoad)
/*
$(".plans").click(function (){
    $( document ).ajaxStop(onLoad);
});*/
