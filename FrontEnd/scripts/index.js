///////////GALERIE DES TRAVAUX AVEC FILTRES///////////

// PROMISES

    //2// on crée une fonction createGallery qui va créer la galerie
    // on place data (cf en dessous) en paramètre de la fonction
    const createGallery = data => {

        //1//on crée une variable data qui va contenir la galerie
        const gallery = document.querySelector(".gallery");
            //on vide le contenu initial de la section (on peut aussi le mettre en commentaire dans le html)
            gallery.innerHTML = "";
            //on parcourt chaque objet dans le tableau de la database works et
            data.forEach(work => {
            //pour chacun on va créer un élément figure pour chaque œuvre
            const figure = document.createElement("figure");

            /*
            Solution alernative en injectant du html (moins optimisée pour la performance) :
            figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption> `; 
            */

            //on crée un élément img qui va récupérer l'url de l'image et le titre de l'œuvre
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            //on crée un élément figcaption qui va récupérer le titre de l'œuvre
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = work.title;

            // on ajoute l'élément figure (et les sous elements) à la section gallery
            gallery.appendChild(figure);
            figure.appendChild(img);
            figure.appendChild(figcaption);
        });

    }

    /*fetch ("http://localhost:5678/api/works")
    //on fait une requête fetch pour récupérer les données de l'API
        .then(response => response.json())
        //on récupère les data et on les transforme en JSON
        .then(data => createGallery(data))
        //3//on passe les données à la fonction createGallery
    */

//METHODE AVEC LES ASYNC/AWAIT

    //on crée une fonction asynchrone fetchWorks pour récupérer les données de l'API
    // on utilise async/await pour simplifier la syntaxe des promesses
    const getWorks = async () => {
        //on crée un variable response qui va chercher les données
        // on utilise await pour attendre la réponse de la requête fetch
        // on utilise l'URL de l'API pour récupérer les œuvres
        const response = await fetch("http://localhost:5678/api/works");
        //on vérifie si la réponse est ok (statut 200)
        //une fois qu'on a la réponse, on veut récupérer les data en JSON
        const data = await response.json();
        // on retourne les données récupérées
        return data; 
        }
    
    /////////// FILTRES ///////////

    //retirer la classe active de tous les boutons et ajouter la classe active au bouton cliqué
    const removeActiveClass = (activeButton) => {
        document.querySelectorAll(".btn-categories").forEach(btn => btn.classList.remove("active"));
        activeButton.classList.add("active");
    }

    const createCategories = data => {
        // on cible le conteneur des catégories
        const categoriesContainer = document.querySelector(".categories");

        //bouton tous //btn-all-categories
        const buttonAll = document.getElementById("btn-all-categories");
        // on ajoute un écouteur d'événement au clic sur le bouton "Tous"
        buttonAll.addEventListener("click", () => {
            // on recrée la galerie avec tous les travaux
            createGallery(works);
            //on enlève la classe active de tous les boutons
            removeActiveClass(buttonAll);
        });

        // Boutons pour chaque object de la base catégorie 
        data.forEach(category => {
            // on crée un bouton auquel on ajoute la classe css et le nom dans la base
            const button = document.createElement("button");
            button.className = "btn-categories";
            button.textContent = category.name;
            //réaction au clic 
            button.addEventListener("click", () => {
                // on filtre les travaux en se servant de categoryId et id précisés dans l'objet de la base de données
                /* pourquoi faut-il utiliser un opérateur de comparaison strict (===) ? */
                const filteredWorks = works.filter(work => work.categoryId === category.id);
                // On recrée la galerie mais cette fois avec les travaux filtrés
                createGallery(filteredWorks);
                removeActiveClass(button);
            });
            //on ajoute le bouton dans le dom
            categoriesContainer.appendChild(button);
        });
    }

    const getCategories = async () => {
        const response = await fetch("http://localhost:5678/api/categories");
        const data = await response.json();
        return data; 
    }

    // Définir la variable works en dehors de la fonction init pour qu'elle soit accessible dans toute la portée du script
    let works;
    
    //initialise la galerie des travaux avec filtres
    const init = async () => {
        // appel à la fonction qui recupère les travaux
        works = await getWorks();
        // fonction create gallery qui prend en paramètre fonction works
        createGallery(works);
        // appel à la fonction qui recupère les filtres
        const categories = await getCategories();
        // fonction create gallery qui prend en paramètre fonction categories
        createCategories(categories);
    }
    



/////////// GESTION DE L'INTERFACE ADMIN ///////////

// A MODIFIER EN FONCTION FLECHEE
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

    // si le token existe (isLoggedIn) 
    // modifie le display none de l'en-tete en display flex 
    adminHeader.style.display = token ? "flex" : "none";
    // modifie le display none du bouton modifier du portfolio en display flex 
    editButton.style.display = token ? "flex" : "none";
    // fait disparaitre les filtres catégories
    filtersSection.style.display = token ? "none" : "flex";

    // Gestion du lien login/logout
    if (token) {
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

}


/////////// MODALE ///////////

////* recup elements dom *////

const modal = document.querySelector('.modal');
const modalGallery = document.querySelector('.modal-gallery');
const modalAddImg = document.querySelector('.modal-add-img');

const trigger = document.querySelector('.modal-link');
const closeBtns = document.querySelectorAll('.btn-modal-close');
const backBtn = document.querySelector('.btn-back-gallery');
const addImgBtn = document.querySelector('.btn-add-img');

////* Ouverture de la fenetre générale avec la méthode .showModal *////

// ouverture modale au click sur "modifier" dans l'interface admin
// le (e) event est l’objet événement que le navigateur crée automatiquement 
// lorsqu’une action utilisateur se produit (clic, touche clavier, scroll, etc.).
trigger.addEventListener("click", (e) => {
    //le lien "Mode édition" redirige normalement la page vers #modal.
    // on prévient donc le comportement par défaut du navigateur qui scrollerait jusqu'a #modal sinon
    e.preventDefault();
    modal.showModal(); // Ouvre la fenêtre globale
    modalGallery.classList.remove("hidden"); // Affiche la partie Galerie
    modalAddImg.classList.add("hidden"); // Cache la partie ajout d'image
        // injection des images directement depuis l'API
    renderAdminGallery();
});


////* gestion de la fermeture avec la méthode .close *////

// clic sur la croix
// pour fermer la modale, peu importe où ou comment on a cliqué
// --> pas besoin de définir de paramètre (e) dans la fonction.
closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modal.close();
    });
});
// clic sur overlay
modal.addEventListener("click", (e) => {
    //clic sur l’overlay → e.target est le <dialog> lui-même → fermeture.
    //clic sur le contenu → e.target est un <div> ou <button> → pas de fermeture.
    if (e.target === modal) { 
        modal.close();
    }
});
// bouton echap
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.open) {
        modal.close();
    }
});


////* Navigation entre les deux parties internes de la modale *////

// Afficher la modale ajout d'image au clic sur le bouton dans la premiere modale
addImgBtn.addEventListener("click", () => {
    modalGallery.classList.add("hidden"); // cache la partie gallery
    modalAddImg.classList.remove("hidden"); // affiche la partie ajout d'image
});

// Retour à la galerie depuis la seconde modale au clic sur le bouton back
backBtn.addEventListener("click", () => {
    modalAddImg.classList.add("hidden"); // cache la partie ajout d'image
    modalGallery.classList.remove("hidden"); // affiche la partie gallery
});


////* Rendu de la gallery dans la modale  *////


const adminGallery = document.querySelector('.admin-gallery');

const renderAdminGallery = async () => {
    adminGallery.innerHTML = "";

    // récupération des travaux depuis l'API
    const worksData = await getWorks();

    worksData.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // bouton suppression sur chaque image 
        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn");
        delBtn.setAttribute("aria-label", `Supprimer ${work.title}`);
        // à modifier par corbeille
        delBtn.innerHTML = "×";

        // au clic sur le bouton corbeille
        delBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (res.ok) {
                    // rafraîchir les galeries après suppression
                    await renderAdminGallery();
                    createGallery(await getWorks());
                } else alert("Erreur suppression");
            } catch (err) {
                console.error(err);
                alert("Impossible de supprimer l'image");
            }
        });

        figure.append(img, delBtn);
        adminGallery.appendChild(figure);
    });
};



    // Appel des fonctions
    init(); // travaux et filtres
    loginAdminOk(); // login