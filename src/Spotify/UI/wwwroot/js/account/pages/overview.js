const Countries = {0: "Russia", 1:"Ukraine", 2:"USA", 3:"Greece"}
const Months = {
    1:"January", 2:"February", 3:"March", 4:"April",
    5:"May", 6:"June", 7:"July", 8:"August", 9:"September",
    10:"October", 11:"November", 12:"December"}

const setDate = function (date) {
    let parsedDate = date.split('-')
    return Months[parsedDate[1].replace('0','')] + ' ' + + parsedDate[2] + ', ' + parsedDate[0]
}

function getProfile(userId){
    let username = document.getElementById("username")
    let email = document.getElementById("email")
    let birthdate = document.getElementById("birthdate")
    let country = document.getElementById("country")
    fetch(`${api}/profile/getProfile?userId=${userId}`, {
        headers : {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => response.json())
        .then(data => {
            username.innerText = data["username"]
            email.innerText = data["email"]
            birthdate.innerText = setDate(data["birthday"])
            country.innerText = Countries[data["country"]]
        })
        .catch(console.log)
}

function onLoad(){
    getClaims().then(result => {
        getProfile(result["id"])
        let premium = getUserPremium(result["id"]).then(result =>{
            if(premium != null){
                document.querySelector("#plan")
                    .appendChild(new PlanCard(result["id"], result["name"], result["description"], result["userCount"], result["price"], true)
                        .render())
            }
            else
                document.querySelector("#plan")
                    .appendChild(new PlanCard(0, "Free", "Free Spotify" , 1, 0, true)
                        .render())
        })
    })
    
}

$( document ).ready(onLoad)
$(".overview").click(function (){
    $( document ).ajaxStop(onLoad);
});