///////////GALERIE DES TRAVAUX AVEC FILTRES///////////

//METHODE AVEC LES PROMISES

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
            <figcaption>${work.title}</figcaption>
            `; 
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

    /* Ne fonctionne pas button undefined*/ 
    //fonction pour retirer la classe active de tous les boutons et ajouter la classe active au bouton cliqué
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

    /* besoin d'explications ici! cf video enregistrée à 45mn*/

    // Définir la variable works en dehors de la fonction init pour qu'elle soit accessible dans toute la portée du script
    let works;

    const init = async () => {
        //initialise la galerie avec les travaux 
        works = await getWorks();
        // on appelle la fonction
        createGallery(works);
        //changement de data à works ... pourquoi? 
        const categories = await getCategories();
        // on appelle la fonction 
        createCategories(categories);
    }
    // on appelle la fonction init pour lancer l'application
    init();