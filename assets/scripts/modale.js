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
            // console.log(element.id)
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
console.log("id " + id );
        fetch(`http://localhost:5678/api/works/${id}`, header).then(
          (response) => {
            console.log(response);
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
const boutonAjouter = document.querySelector(".button-add-work");
let fileRempli = false 
let titleRempli = false
let categoryRempli = false
// variable pour les changements de classe quand la photo se met
const fileVisibility = document.querySelector(".labelFile");
const pVisibility = document.querySelector(".containerAjouterPhoto p");

file.addEventListener("input" , () => {
    console.log("change" + file);
    if (file.value) {
        fileRempli = true 
        previewPicture(file);
        previewImage.style.display = "flex"
        fileVisibility.style.visibility = "hidden"
        pVisibility.style.visibility = "hidden"
    } else {
        fileRempli = false
    }
    console.log(fileRempli);
    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false
    } else {
        boutonAjouter.disabled = true
    }
})

title.addEventListener("input" , () => {
    console.log("change" + title);
    if (title.value) {
        titleRempli = true 
    } else {
        titleRempli = false
    }
    console.log(titleRempli);
    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false
    } else {
        boutonAjouter.disabled = true
    }
})

category.addEventListener("change" , () => {
    console.log("change" + category);
    if (category.value) {
        categoryRempli = true 
    } else {
        categoryRempli = false
    }
    console.log(categoryRempli);
    if (fileRempli && titleRempli && categoryRempli) {
        boutonAjouter.disabled = false;
        boutonAjouter.classList.add("boutonVert")
    } else {
        boutonAjouter.disabled = true
        boutonAjouter.classList.remove("boutonVert")
    }
})

formAddWorks.addEventListener("submit" , (e) => {
    e.preventDefault();

    const valeurTitle = title.value;
    const valeurCategory = category.value;  
    const valeurImage = file.value;
    console.log(file);
    console.log(title);
    console.log(category);
    console.log(valeurTitle);
    console.log(valeurCategory);
    console.log(valeurImage);

    const donneesFormulaires = new FormData();

    donneesFormulaires.append("category" , valeurCategory);
    donneesFormulaires.append("image", file.files[0]); 
    donneesFormulaires.append("title" , valeurTitle)
    console.log(donneesFormulaires.get("category"));
    console.log(donneesFormulaires.get("image"));
    console.log(donneesFormulaires.get("title"));

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
        console.log(response);
        if (!response.ok) {
       
            const error = await response.json();
            throw new Error(`Erreur lors de la requête : ${error.message}`);
        }
        return response.json(); 
        
    })
    
    
    .then((data) => {
     
    console.log(data);
    containerModaleAjouter.remove();
    containerModale.remove();
    creationTableauPagePrincipale();
    
    })
    
    
    .catch((error) => {
        console.error("Une erreur s'est produite", error);
    });

})


////////////////////////// previsualisation image dans la modale


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