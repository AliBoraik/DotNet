class ProfileCard { 
    constructor(img, name, type, id) {
        this.img = img;
        this.name = name;
        this.type = type;
        this.id = id;
    }
    
    render() {
        const card = document.createElement("div");
        card.className = "card";
        card.addEventListener("click", (e) => {
            if (e.target && e.target.classList.contains("button-on-card")) {
                e.stopPropagation();
                e.target.classList.toggle("card-active")
            }
            else 
                window.location.href = this.type === "user" ? `/User/Index/${this.id}` : `/artist/${this.id}`;
        });

        
        
        let watermark = this.img === "" ?
            `<div class="watermark profile empty"></div>` :
            `<img src="${this.img}" alt="" class="watermark profile"/>`

        let button = this.type === "Artist"? 
            `<div class="button-on-card"></div> <!--can be made active with \"card-active\" class-->` :
            ``;

        if (this.name.length > 13) 
            this.name = this.name.slice(0, 13) + "..";

        card.innerHTML = ` 
            <div class="cover">
                ${watermark}
                ${button}
                <div class="cover-text profile">
                    <h1 class="cover-title">${this.name}</h1>
                    <h2 class="cover-description">${this.type}</h2>
                </div>
            </div>`

        return card;
    }
}