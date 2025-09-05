///////////PAGE DE LOGIN UTILISATEUR///////////

// récuperer les données du formulaire en reprenant chaque input (email et password)
const loginID = document.querySelector("#login-email");
const loginMP = document.querySelector("#login-password");
const loginForm = document.querySelector("#login-form"); // seul le form déclenche un submit
const errorMsg = document.querySelector(".login-error-msg");

//Fonction asynchrone pour gérer la connexion   
const loginUser = async (email, password) => {

        const response = await fetch("http://localhost:5678/api/users/login", {
            // requête API http de type POST /users/login 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // dans le body de la requête ajouter les données du formulaire
            body: JSON.stringify({ email, password })  // noms attendus par l'API
        });

        if (response.ok) {
            // requête http ok; message de type 200 ?
            const data = await response.json();
            // retour et stockage du token dans le navigateur
            localStorage.setItem("token", data.token);
            // Si ok, redirection vers accueuil
            window.location.href = "index.html"; 
        } else {
            //alert("Email ou mot de passe incorrect.");
            errorMsg.style.display = "block";
        }
};

// Ajouter au bouton submit un event listener
loginForm.addEventListener("submit", async function(event) {
    // Prevenir le rechargement par défaut de la page
    event.preventDefault(); 
    // Récupérer les valeurs rentrées
    //.trim pour supprimer s'il y a des espaces
    // Appeler la fonction de connexion
    await loginUser(loginID.value.trim(), loginMP.value.trim());
});


/////////// GESTION DE L'INTERFACE ADMIN ///////////

function loginAdminOk() {

    // chercher le token dans le localstorage 
    const token = localStorage.getItem("token");

    // récupérer dans le DOM les elements à modifier :
    // apparition bandeau d'en tete et bouton portfolio, 
    // modification de la mention login du menu en logout
    // disparition des filtres catégories
    const adminHeader = document.querySelector(".admin-header");
    const editButton = document.querySelector(".admin-portfolio-btn");
    const filtersSection = document.querySelector(".categories");
    const logInOutLink = document.querySelector(".logInOut a");

    // Verifier la validité du Token
    const isLoggedIn = !!token;

    // si le token existe (isLoggedIn) 
    // modifie le display none de l'en-tete en display flex 
    adminHeader.style.display = isLoggedIn ? "flex" : "none";
    // modifie le display none du bouton modifier du portfolio en display flex 
    editButton.style.display = isLoggedIn ? "flex" : "none";
    // fait disparaitre les filtres catégories
    filtersSection.style.display = isLoggedIn ? "none" : "flex";

    // Gestion du lien login/logout
    if (isLoggedIn) {
        // une fois connecté, modification du texte "login" en "logout"
        logInOutLink.textContent = "logout";
        // redirection avec lien vide car reload s'en charge
        logInOutLink.href = "#";
        // action au clic
        logInOutLink.onclick = (e) => {
            // empecher le rechargement
            e.preventDefault();
            // retirer le token
            localStorage.removeItem("token");
            // recharge la page dans son état initial
            location.reload();
        };
    }

} // fin de la fonction

// au clic, quand la page est chargé, execute la fonction
document.addEventListener("DOMContentLoaded", loginAdminOk);