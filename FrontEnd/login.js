///////////PAGE DE LOGIN UTILISATEUR///////////

// récuperer les données du formulaire en reprenant chaque input (email et password)
const loginID = document.querySelector("#email");
const loginMP = document.querySelector("#password");
const loginForm = document.querySelector("#login-form") // seul le form déclenche un submit
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
    const email = loginID.value.trim();
    const password = loginMP.value.trim();
    // Appeler la fonction de connexion
    await loginUser(email, password);
});

