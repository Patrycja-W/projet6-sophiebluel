// variables 

const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres")

// fonction pour obtenir les projets via l'api

async function toutLesProjets () {
    const reponse = await fetch ("http://localhost:5678/api/works");
    return await reponse.json();

}
toutLesProjets();

// affichage des works dans le DOM,boucle forEach pour recuperer chaque element du tableau et exécute la fonction de rappel définie

async function creationTableau () {
    const tableau = await toutLesProjets()
    tableau.forEach(element => {
        creationImage(element)
    });
}
creationTableau();


async function creationImage (element) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = element.imageUrl
        figcaption.textContent = element.title

        figure.classList.add("figure")
        figure.appendChild(img)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
}
creationImage();


// affichage dynamique des boutons de categories
// recuperer le tableau des categories

async function recupererCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    return await reponse.json();
}
recupererCategories();

//afficher les boutons pour chaque categorie

async function afficherCategories() {
    const categories = await recupererCategories();
    categories.forEach(element => {
        const bouton = document.createElement("button");
        bouton.textContent = element.name;
        bouton.id = element.id;
        bouton.classList.add("tous")
        filtres.appendChild(bouton)
    });
}
afficherCategories();


// filtrer au click les categories des boutons

async function filtrerCategories() {
    const lesProjets = await toutLesProjets();
    const boutons = document.querySelectorAll(".filtres button")
    boutons.forEach(element => {
        element.addEventListener("click",(e) =>{
           let boutonsID = e.target.id;
           gallery.innerHTML = "";
           if (boutonsID !== "0") {
            const triCategories = lesProjets.filter((projet) =>{
                return projet.categoryId == boutonsID;
            });
            triCategories.forEach(element => {
                creationImage(element)
            });
            
           } else{
            creationTableau();
           }
        })
    });
    
}
filtrerCategories();