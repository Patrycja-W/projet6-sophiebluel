// affichage de la modale au click sur modifier

const containerModale = document.querySelector(".containerModale")

modifier.addEventListener("click",() =>{
    containerModale.style.display = "flex"
})

// fermer la modale au click sur la croix

const croix = document.querySelector(".containerModale .fa-xmark")

croix.addEventListener("click",() =>{
    containerModale.style.display = "none"
})

// fermer la modale au click sur les contours de la modale

containerModale.addEventListener("click",(e)=>{
    if (e.target.className == "containerModale") {
        containerModale.style.display = "none"
    }
})

/////////////////////////////////////////////////////////////////////////

// affichage de la modale Ajouter projet au click sur le bouton "ajouter une photo" 

const bouttonAjouter = document.querySelector(".addPhotoBtn")
const containerModaleAjouter = document.querySelector(".containerModaleAjouter")

bouttonAjouter.addEventListener("click",() =>{
    containerModaleAjouter.style.display = "flex"
})

// fermer la modale au click sur la croix

const croix2 = document.querySelector(".containerModaleAjouter .fa-xmark")

croix2.addEventListener("click",() =>{
    containerModaleAjouter.style.display = "none";
    containerModale.style.display = "none";
})

// fermer la modale au click sur les contours de la modale

containerModaleAjouter.addEventListener("click",(e)=>{
    if (e.target.className == "containerModaleAjouter") {
        containerModaleAjouter.style.display = "none"
        containerModale.style.display = "none";
    }
})

// revenir sur la page "galerie photo" au click

const fleche = document.querySelector(".icones .fa-arrow-left")

fleche.addEventListener("click",() =>{
    containerModaleAjouter.style.display = "none";
})


/////////////////////////////////////////////////

// affichage des projets dans la modale

const modalePhotos = document.querySelector(".modalePhoto");

// fonction pour obtenir les projets via l'api

async function toutLesProjetsModale () {
    const reponse = await fetch ("http://localhost:5678/api/works");
    return await reponse.json();

}
toutLesProjetsModale();

// affichage des projets dans le DOM,boucle forEach pour recuperer chaque element du tableau et exécute la fonction de rappel définie

async function creationTableauProjets () {
    const tableau = await toutLesProjetsModale()
    tableau.forEach(element => {
        creationImagesModale(element)
    });
}
creationTableauProjets();


async function creationImagesModale (element) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const poubelle = document.createElement("div");
        const iconePoubelle = document.createElement("i");
       
        img.src = element.imageUrl
        
        figure.classList.add("figure")
        figure.appendChild(img)
        poubelle.classList.add("poubelle")
        figure.appendChild(poubelle)

        iconePoubelle.classList.add("fa-solid")
        iconePoubelle.classList.add("fa-trash-can")
        poubelle.appendChild(iconePoubelle)
       
        modalePhotos.appendChild(figure)
}