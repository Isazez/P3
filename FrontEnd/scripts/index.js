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


    ////* Récupération des éléments du DOM *////
    const modal = document.querySelector('.modal');
    const modalGallery = document.querySelector('.modal-gallery');
    const modalAddImg = document.querySelector('.modal-add-img');

    const trigger = document.querySelector('.modal-link');
    const closeBtns = document.querySelectorAll('.btn-modal-close');
    const backBtn = document.querySelector('.btn-back-gallery');
    const addImgBtn = document.querySelector('.btn-add-img');
    const adminGallery = document.querySelector('.admin-gallery');
    const addPhotoForm = document.getElementById("add-photo-form");

    // Affiche soit la galerie admin, soit le formulaire d’ajout
    function showModalSection(showAddImage) {
        if (showAddImage) {
            modalGallery.classList.add("hidden");
            modalAddImg.classList.remove("hidden");
        } else {
            modalAddImg.classList.add("hidden");
            modalGallery.classList.remove("hidden");
        }
    }

    ////* Ouverture de la modale *////
    // Écouteur sur le bouton "modifier"
    trigger.addEventListener("click", openModal);
    function openModal(event) {
        event.preventDefault();     // évite le scroll vers #modal
        modal.showModal();          // ouvre la fenêtre <dialog>
        showModalSection(false);    // par défaut, on affiche la galerie
        renderAdminGallery();       // charge les images dans la galerie admin
    }

    ////* Fermeture de la modale *////

    // Méthode .close de JS
    function closeModal() {
        modal.close(); 
    }
    // Fermeture avec les croix
    closeBtns.forEach(function (btn) {
        btn.addEventListener("click", closeModal);
    });
    // Fermeture avec clic sur l’overlay noir
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    // Fermeture avec la touche Echap
    window.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.open || event.key === "Esc" && modal.open) {
            closeModal();
        }
    });


    ////* Modules internes galerie et ajout photo *////

    // Navigation vers la section "ajout photo"
    addImgBtn.addEventListener("click", goToAddImageSection);
    function goToAddImageSection() {
        showModalSection(true);
        loadCategories();  // charge les catégories dans le <select>
    }
    // Retour à la galerie
    backBtn.addEventListener("click", goBackToGallery);
    function goBackToGallery() {
        showModalSection(false);
    }
    

    ////* Rendu de la galerie admin dans la modale *////
    async function renderAdminGallery() {
        // On vide d’abord la galerie admin
        adminGallery.innerHTML = "";

        // On récupère les travaux depuis l’API
        const worksData = await getWorks();

        // On parcourt chaque travail et on crée l’affichage
        worksData.forEach(function (work) {
            // Conteneur figure
            const figure = document.createElement("figure");

            // Image de l’œuvre
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            // Bouton de suppression (icône poubelle)
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.setAttribute("aria-label", `Supprimer ${work.title}`);
            deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';

            // Action au clic : supprimer le travail
            deleteBtn.addEventListener("click", async function () {
                try {
                    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (response.ok) {
                        // Si suppression OK : on recharge les galeries
                        await renderAdminGallery();
                        createGallery(await getWorks());
                    } else {
                        alert("Erreur lors de la suppression");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Impossible de supprimer l'image");
                }
            });

            // On ajoute l’image + le bouton poubelle dans le figure
            figure.append(img, deleteBtn);

            // On ajoute le figure dans la galerie admin
            adminGallery.appendChild(figure);
        });
    }

    ////* Chargement des catégories dans le formulaire d’ajout *////
    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des catégories");
            }

            const categories = await response.json();

            // Sélecteur <select> des catégories
            const select = document.querySelector("#category");

            // On réinitialise le contenu
            select.innerHTML = '<option value="">-- Choisir --</option>';

            // On ajoute chaque catégorie comme <option>
            categories.forEach(function (cat) {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    }

    ////* Gestion du formulaire d’ajout de photo *////
    async function handleAddPhoto(event) {
        event.preventDefault(); // évite rechargement de la page

        // Récupère les données saisies
        const formData = new FormData(addPhotoForm);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (response.ok) {
                // Mise à jour des deux galeries
                await renderAdminGallery();
                createGallery(await getWorks());

                // Réinitialise le formulaire
                addPhotoForm.reset();

                // Retour automatique à la galerie
                showModalSection(false);
            } else {
                alert("Erreur lors de l’ajout de l’image");
            }
        } catch (error) {
            console.error(error);
            alert("Impossible d’ajouter l’image");
        }
    }

    // Écouteur sur la soumission du formulaire
    addPhotoForm.addEventListener("submit", handleAddPhoto);



    // Appel des fonctions
    init(); // travaux et filtres
    loginAdminOk(); // login