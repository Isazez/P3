///////////PAGE DE LOGIN UTILISATEUR///////////
//RECUPERER LES DONNES POUR LA PAGE DE LOGIN

//on crée une fonction asynchrone pour gérer la connexion   
const loginUser = async (email, password) => {
    //on crée une variable response qui va contenir la réponse de la requête fetch
    const response = await fetch("http://localhost:5678/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });