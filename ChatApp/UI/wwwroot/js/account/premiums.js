async function getUserPremium(userId){
    const response = await fetch(`${api}/profile/user_premium/${userId}`)
        .then(response => response.json())
    return await response
}

function getAvailablePremiums(userId){
    fetch(`${api}/profile/premiums/${userId}`)
        .then(response => response.json())
        .then(data => {
            data.map(plan =>{
                document.querySelector("#plans")
                    .appendChild(new PlanCard(plan["id"], plan["name"], plan["description"], plan["userCount"], plan["price"], false)
                        .render())
            })
        })
}

function getPremium(premiumId){

    fetch(`${api}/profile/premium/${premiumId}`)
        .then(response => response.json())
        .then(data => {
                document.querySelector("#new-plan")
                    .appendChild(new PlanCard(data["id"], data["name"], data["description"], data["userCount"], data["price"], true)
                        .render())
        })
}