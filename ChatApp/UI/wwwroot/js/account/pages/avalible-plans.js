function onLoad(){
    getClaims()
        .then(result =>{
            let premium = getUserPremium(result["id"])
                .then(result => {
                    if(premium != null){
                        document.querySelector("#plan")
                            .appendChild(new PlanCard(0, result["name"], result["description"], result["userCount"], result["price"], true)
                                .render())
                    }
                    else
                        document.querySelector("#plan")
                            .appendChild(new PlanCard(0, "Free", "Free Spotify" , 1, 0, true)
                                .render())
                })
            getAvailablePremiums(result["id"])
        })
}

$( document ).ready(onLoad)

$(".plans").click(function (){
    $( document ).ajaxStop(onLoad);
});