const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const loginForm = document.querySelector("form");
const messageError = document.querySelector("form #error-message");



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


    /* Envoi d'une requête POST au serveur pour l'authentification de l'utilisateur */
    fetch("http://localhost:5678/api/users/login", {
        method: "POST", 
        mode: "cors", 
        credentials: "same-origin", 
        headers: { "Content-Type": "application/json" }, 
        body: user, 
    })

    /* Traitement de la réponse de la requête */
    .then(async (response) => {
        if (!response.ok) {
            if (response.status == 401 || response.status == 404) {
                messageError.textContent = "Erreur email ou mot de passe";
            }
            const error = await response.json();
            throw new Error(`Erreur lors de la requête : ${error.message}`);
        }
        return response.json(); /* Passe la réponse HTTP en JSON en cas de succès */
    })

    /* Traitement des données retournées par le serveur après authentification réussie */
    .then((data) => {

        const { userId, token: userToken } = data;
        
        window.sessionStorage.setItem("token", userToken, "userId", userId);
        window.sessionStorage.setItem("loged", "true"); 

        window.location.href = "./index.html";
    })

    /* Gestion des erreurs lors de la requête ou du traitement des données */
    .catch((error) => {
        console.error("Une erreur s'est produite lors de la récupération des données", error);
    });
});

