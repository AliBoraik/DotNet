class PlanCard{
    constructor(id, name, description, account_count, cost, is_bought) {
        this.id = id
        this.name = name
        this.description = description
        this.account_count = account_count
        this.cost = cost
        this.is_bought = is_bought
    }
    
    render(){
        let accountCountText = `${this.account_count} account`;
        if(this.account_count > 1)
            accountCountText = `${this.account_count} accounts`;
        let buy_button = `<div class="col-2">
            <a href="/Account/ChangePlan?planId=${this.id}" class="btn btn-outline-dark border-dark-btn">
                <b>Buy</b>
            </a>
        </div>`
        if(this.is_bought){
            buy_button = ''
        }
        
        const planCard = document.createElement("div");
        planCard.className = "card plan-card mb-3";
        planCard.innerHTML = `
        <div class="ms-4 plan-card-bg">
            <h1 class="text-dark mt-3 mb-3"><b>${this.name}</b></h1>
            <div class="accounts-count text-white">${accountCountText}</div>
            <h5 class="text-dark mt-3 mb-3">
                ${this.description}
            </h5>
        </div>
        <hr class="ms-3 me-3"/>
        <div class="row ms-3">
            <div class="col-10">
                    <h5 class="card-title"><b>${this.cost}$</b></h5>
            <div class="text-secondary">/month</div>
        </div>
        ${buy_button}
        </div>`
        return planCard;
    }
}