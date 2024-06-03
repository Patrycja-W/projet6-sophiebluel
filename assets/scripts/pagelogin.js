const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const loginForm = document.querySelector("form");
const messageError = document.querySelector("form #error-message");



/* Ajout un écouteur d'événement pour le formulaire de connexion */
loginForm.addEventListener("submit", (e) => {
    
    e.preventDefault();
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    if (!userEmail || !userPassword) {
        messageError.textContent = "Tout les champs doivent etre remplis";
        return;
    }

    /* Préparation des données à envoyer au serveur sous forme d'objet JSON */
    const login = {
        email: userEmail,
        password: userPassword,
    };

    /* Convertit l'objet login en une chaîne JSON */
    const user = JSON.stringify(login);



    fetch("http://localhost:5678/api/users/login", {
        method: "POST", 
        mode: "cors", 
        credentials: "same-origin", 
        headers: { "Content-Type": "application/json" }, 
        body: user, 
    })


    .then(async (response) => {
        if (!response.ok) {

            if (response.status == 401 || response.status == 404) {
                messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
            }
            const error = await response.json();
            throw new Error(`Erreur lors de la requête : ${error.message}`);
        }
        return response.json(); 
    })


    .then((data) => {
        const { userId, token: userToken } = data;
        
        /* Stockage du token et de l'ID de l'utilisateur dans la sessionStorage du navigateur */
        window.sessionStorage.setItem("token", userToken);
        window.sessionStorage.setItem("userId", userId);

        window.sessionStorage.setItem("loged", "true"); 
        
        window.location.href = "./index.html";
    })

    .catch((error) => {
        console.error("Une erreur s'est produite lors de la récupération des données", error);
    });
});

