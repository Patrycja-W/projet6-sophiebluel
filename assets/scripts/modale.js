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

async function creationTableauModale () {
    modalePhotos.innerHTML = "";
    const tableau = await toutLesProjetsModale()
    tableau.forEach(element => {
        creationImagesModale(element)
    });
    
}
creationTableauModale();


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

        poubelle.addEventListener("click", () =>{
            deleteWork(element.id);
        })
}


////////////////////////// suppression des projets 
const token = window.sessionStorage.token;


const header = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "same-origin",
  };

function deleteWork(id) {
        fetch(`http://localhost:5678/api/works/${id}`, header).then(
          (response) => {
            creationTableauModale();
            creationTableauPagePrincipale();
          }
        );
  }

////////////////////////// ajout des projets dynamiquement

const formAddWorks = document.querySelector("#formAddWorks");
const file = document.querySelector("#file");
const title = document.querySelector("#title");
const category = document.querySelector("#categoryInput");
const boutonAjouter = document.querySelector(".bouton-valider-projet");
let fileRempli = false 
let titleRempli = false
let categoryRempli = false
// variable pour les changements de classe quand la photo se met
const fileVisibility = document.querySelector(".labelFile");
const pVisibility = document.querySelector(".containerAjouterPhoto p");

// ecouteur devenement pour limage
file.addEventListener("input" , () => {
    if (file.value) {
        fileRempli = true 
        previewPicture(file);
        previewImage.style.display = "flex"
        fileVisibility.style.visibility = "hidden"
        pVisibility.style.visibility = "hidden"
    } else {
        fileRempli = false
    }
    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false
    } else {
        boutonAjouter.disabled = true
    }
})

// ecouteur devenement pour le titre de limage
title.addEventListener("input" , () => {
    if (title.value) {
        titleRempli = true 
    } else {
        titleRempli = false
    }
    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false
    } else {
        boutonAjouter.disabled = true
    }
})

// ecouteur devenement pour les categories
category.addEventListener("change" , () => {
    if (category.value) {
        categoryRempli = true 
    } else {
        categoryRempli = false
    }

    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false;
        boutonAjouter.classList.add("boutonVert")
    } else {
        boutonAjouter.disabled = true
        boutonAjouter.classList.remove("boutonVert")
    }
})

// ecouteur devenement pour le formulaire / sousmission
formAddWorks.addEventListener("submit" , (e) => {
    e.preventDefault();

    const valeurTitle = title.value;
    const valeurCategory = category.value;  

    const donneesFormulaires = new FormData();

    donneesFormulaires.append("category" , valeurCategory);
    donneesFormulaires.append("image", file.files[0]); 
    donneesFormulaires.append("title" , valeurTitle)


    const headerPost = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "accept": "application/json"
        },
        body: donneesFormulaires,
      };

      fetch("http://localhost:5678/api/works", 
       headerPost 
    )
      .then(async (response) => {

        if (!response.ok) {
       
            const error = await response.json();
            throw new Error(`Erreur lors de la requête : ${error.message}`);
        }
        return response.json(); 
        
    })
    
    
    .then((data) => {
     
    containerModaleAjouter.style.display = "none";
    containerModale.style.display = "none";
    creationTableauPagePrincipale();
    creationTableauModale();
    
    })
    
    
    .catch((error) => {
        console.error("Une erreur s'est produite", error);
    });

})


////// previsualisation image dans la modale


const previewImage = document.getElementById("previewImage");
     
    // La fonction previewPicture
    var previewPicture  = function (e) {

        // e.files contient un objet FileList
        const [picture] = e.files

        // "picture" est un objet File
        if (picture) {
            // On change l'URL de l'image
            previewImage.src = URL.createObjectURL(picture)
        }
    }