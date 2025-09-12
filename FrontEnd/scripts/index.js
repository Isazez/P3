/////////// GALERIE D'IMAGES AVEC LES TRAVAUX DE L'API ///////////

    // recup de la div qui va contenir la galerie et création avec le paramètre data seul (cf plus bas)
    const galleryPortfolio = document.querySelector(".gallery");

    // PROMISES on crée une fonction createGallery qui va créer la galerie
    const createGallery = (data, gallery = galleryPortfolio, isHomePage = true) => {

        // on vide le contenu initial de la section (on peut aussi le mettre en commentaire dans le html)
        gallery.innerHTML = "";
        // on parcourt chaque objet dans le tableau de la database works et
        data.forEach(work => {
            // pour chacun des travaux on crée un élément figure
            // (Solution alernative moins optimale : .innerHTML)
            const figure = document.createElement("figure");
            // on crée un element image qui récupère l'url de l'image et le titre
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            // on ajoute l'élément image à figure
            figure.appendChild(img);

            if(isHomePage) {
                // Pour la galerie porfolio (pas sur la modale), 
                const figcaption = document.createElement("figcaption");
                figcaption.textContent = work.title;
                figure.appendChild(figcaption);
            } else {
                // Si on n'est pas sur le portfolio, on est dans la modale et dans ce cas :
                // Bouton de suppression (icône poubelle)
                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-btn");
                deleteBtn.setAttribute("aria-label", `Supprimer ${work.title}`);
                deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
                
                // Action au clic : supprimer le travail
                deleteBtn.addEventListener("click", async () => {
                    try {
                        const response = await deleteWorkById(work.id);

                        if (response.ok) {
                            // si suppression ok, on recharge les galeries
                            works = await getWorks ();
                            // on recrée la galerie pour le portfolio de la Home Page
                            createGallery (await getWorks());
                            // on recrée la galerie pour la modale 
                            createGallery (works, adminGallery, false);
                        } else {
                            alert('Erreur lors de la suppression');
                        }

                    } catch (error) {
                        console.error(error);
                        alert("Impossible de supprimer l'image")
                    }
                }); 
            // On ajoute l’image + le bouton poubelle dans le figure
            figure.append(img, deleteBtn);
            }
        // on ajoute dans tous les cas l'élément figure aux gallery
        gallery.appendChild(figure);
        });
    };



// RECUPERER LES DONNEES DE L'API avec fonction asynchrone ASYNC AWAIT (ancienne syntaxe .then)

    const getWorks = async () => {
        // variable response qui va chercher les données
        // await pour attendre la réponse de la requête fetch
        // URL de l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");
        //on vérifie si la réponse est ok (statut 200)
        //une fois qu'on a la réponse, on veut récupérer les data en JSON
        const data = await response.json();
        // on retourne les données récupérées
        return data; 
        }
    
        // ???? pourquoi id n'est pas entre ()
    // fonction dédiée à supprimer les images
    const deleteWorkById = async id => {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
            }        
        })
        //celle ci ne retourne pas de data contrairement à la précédente
        return response; // analysée par le booléen
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

    const loginAdminOk = () => {

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

    // Affiche soit la galerie en mode admin, soit le formulaire d’ajout d'image
    const showModalSection = (showAddImage) => {
        // si on est sur add image
        if (showAddImage) { 
            modalGallery.classList.add("hidden"); // cache la gallery admin
            modalAddImg.classList.remove("hidden"); // affiche le formulaire d'ajout d'image
        } else {
            modalAddImg.classList.add("hidden");
            modalGallery.classList.remove("hidden");
        }
    }

    ////* Ouverture de la modale *////
    const openModal = (event) => {
        event.preventDefault();     // évite le scroll vers #modal
        modal.showModal();          // méthode propre à JS pour ouvrir la fenêtre <dialog>
        showModalSection(false);    // par défaut, on affiche la galerie
        createGallery (works, adminGallery, false);  // charge les images dans la galerie admin
    }
    // Écouteur sur le bouton "modifier"
    trigger.addEventListener("click", openModal);

    ////* Fermeture de la modale *////

    // Méthode .close de JS
    const closeModal = () => {
        modal.close(); // méthode propre à JS pour fermer la fenêtre <dialog>
    }
    // Fermeture avec les croix
    closeBtns.forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });
    // Fermeture avec clic sur l’overlay noir
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    // Fermeture avec la touche Echap
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.open || event.key === "Esc" && modal.open) {
            closeModal();
        }
    });


    ////* Modules internes galerie et ajout photo *////

    // Navigation vers la section "ajout photo"
    const goToAddImageSection = () => {
        showModalSection(true);
        loadCategories();  // charge les catégories dans le <select>
    }
    addImgBtn.addEventListener("click", goToAddImageSection);

    // Retour à la galerie
    const goBackToGallery = () => {
        showModalSection(false);
    }
    backBtn.addEventListener("click", goBackToGallery);
    

    ////* Chargement des catégories dans le formulaire d’ajout *////
    const loadCategories = async () => {
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
            categories.forEach((cat) => {
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

// recupère l'emplacement à remplir d'un message de validation ou d'echec
const errorAddImg = document.querySelector(".add-img-error-msg");
const msgAddImgOK = document.querySelector(".add-img-ok-msg");

// Récupère les éléments pour la préview interne de add-img
const photoInput = document.getElementById("photoInput");
const uploadArea = document.querySelector(".upload-area");
const preview = document.querySelector(".preview");
const previewImage = document.getElementById("previewImage");

// Clic sur la zone -> déclenche input file
uploadArea.addEventListener("click", () => {
  photoInput.click();
});

// Affiche un aperçu de l'image choisie
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      preview.classList.remove("hidden");  // montre l’aperçu
      uploadArea.classList.add("hidden");  // cache la zone d’upload
    };
    reader.readAsDataURL(file);
  }
});

// gestion du formulaire d'ajout d'image à la database et à la galerie portfolio
addPhotoForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // empêche le rechargement de la page

    // Réinitialiser les messages avant chaque tentative
        errorAddImg.style.display = "none";
        msgAddImgOK.style.display = "none";

      // Vérifie que l’image a bien été choisie
        if (!photoInput.files[0]) {
            errorAddImg.textContent = "Veuillez sélectionner une image.";
            errorAddImg.style.display = "block";
            return;
        }

// Récupère les données du formulaire (image, titre, catégorie)
    const formData = new FormData(addPhotoForm);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
                // ⚠️ Ne pas mettre Content-Type, FormData le gère automatiquement
            },
            body: formData
        });

        if (response.ok) {
            // On recharge la liste des travaux depuis l’API
            works = await getWorks();

            // Mise à jour de la galerie sur la page principale
            createGallery(works);
            // Mise à jour de la galerie dans la modale admin
            createGallery(works, adminGallery, false);

            // Réinitialise le formulaire
            addPhotoForm.reset();

            // Réinitialiser la preview et la zone upload
            previewImage.src = "";
            preview.classList.add("hidden");
            uploadArea.classList.remove("hidden");    

            // Retour automatique à la galerie de la modale
            showModalSection(false);

            //message de validation à afficher sur la modale partie gallery;
            msgAddImgOK.style.display = "block";
        } else {
            //message d'erreur à afficher sous le formulaire
            errorAddImg.style.display = "block";
        }
    } catch (error) {
        console.error(error);
        alert("❌ Impossible d’ajouter l’image (problème serveur ou réseau)");
    }
});


// Appel des fonctions
init(); // travaux et filtres
loginAdminOk(); // login