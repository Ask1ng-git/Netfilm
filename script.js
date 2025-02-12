const apiKey = "6fc55234";
const resultsContainer = document.getElementById("resultsContainer");
const noResultsMessage = document.getElementById("noResultsMessage");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageInfo = document.getElementById("pageInfo");
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

let currentPage = 1;
let totalPages = 1;
let searchQuery = "movie"; // Par défaut, recherche des films
let isSearchActive = false; // Vérifie si une recherche est en cours

// Fonction pour récupérer et afficher les films
async function fetchAndDisplayMovies(page = 1, query = searchQuery) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    resultsContainer.innerHTML = "";
    noResultsMessage.style.display = "none";

    if (data.Response === "True") {
      totalPages = Math.ceil(data.totalResults / 10);
      pageInfo.textContent = `Page ${page} sur ${totalPages}`;

      // Trier les films par année (du plus récent au plus ancien)
      const sortedMovies = data.Search.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

      sortedMovies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        resultsContainer.appendChild(movieCard);
      });

      // Désactiver les boutons de navigation si nécessaire
      prevButton.disabled = page === 1;
      nextButton.disabled = page === totalPages;
    } else {
      noResultsMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    alert("Une erreur est survenue lors de la récupération des données.");
  }
}

// Fonction pour créer une carte de film (avec flip animation)
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  const cardInner = document.createElement("div");
  cardInner.className = "card-inner";

  // Face avant
  const cardFront = document.createElement("div");
  cardFront.className = "card-front";

  const poster = document.createElement("img");
  poster.src = movie.Poster !== "N/A" ? movie.Poster : "placeholder.png";
  poster.alt = `Affiche de ${movie.Title}`;
  poster.style.height = "100%";

  cardFront.appendChild(poster);

  // Face arrière
  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  const title = document.createElement("h3");
  title.textContent = movie.Title;

  const year = document.createElement("p");
  year.textContent = `Année : ${movie.Year}`;

  const type = document.createElement("p");
  type.textContent = `Type : ${movie.Type === "movie" ? "Film" : "Série"}`;

  // Bouton de redirection vers IMDb
  const linkButton = document.createElement("a");
  linkButton.href = `https://www.imdb.com/title/${movie.imdbID}/`;
  linkButton.target = "_blank";
  linkButton.className = "redirect-button";
  linkButton.textContent = "Voir sur IMDb";

  cardBack.appendChild(title);
  cardBack.appendChild(year);
  cardBack.appendChild(type);
  cardBack.appendChild(linkButton);

  // Ajout des faces à la carte
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

// Gestion du clic sur les cartes pour l'animation de flip
resultsContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".card-inner");
  if (card) {
    card.classList.toggle("flipped");
  }
});

// Gestion des clics sur les boutons de pagination
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    if (isSearchActive) {
      fetchAndDisplayMovies(currentPage, searchInput.value.trim());
    } else {
      fetchAndDisplayMovies(currentPage);
    }
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    if (isSearchActive) {
      fetchAndDisplayMovies(currentPage, searchInput.value.trim());
    } else {
      fetchAndDisplayMovies(currentPage);
    }
  }
});

// Gestion du clic sur le bouton de recherche
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchQuery = query;
    isSearchActive = true; // Recherche active
    currentPage = 1; // Réinitialiser la page à 1 lors d'une nouvelle recherche
    fetchAndDisplayMovies(currentPage, query);
  } else {
    alert("Veuillez entrer un titre de film à rechercher.");
  }
});

// Gérer le clic sur le bouton "Films"
document.getElementById("moviesButton").addEventListener("click", () => {
  searchQuery = "movie";
  isSearchActive = false; // Recherche désactivée
  searchInput.value = ""; // Effacer le champ de recherche
  currentPage = 1; // Réinitialiser la page
  fetchAndDisplayMovies(currentPage);
});

// Gérer le clic sur le bouton "Séries"
document.getElementById("seriesButton").addEventListener("click", () => {
  searchQuery = "series";
  isSearchActive = false; // Recherche désactivée
  searchInput.value = ""; // Effacer le champ de recherche
  currentPage = 1; // Réinitialiser la page
  fetchAndDisplayMovies(currentPage);
});

// Écouteur d'événements sur le champ de recherche pour déclencher la recherche en temps réel
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query) {
    isSearchActive = true; // Recherche active
    currentPage = 1; // Réinitialiser la page à 1 lors d'une nouvelle recherche
    fetchAndDisplayMovies(currentPage, query);
  } else {
    resultsContainer.innerHTML = ""; // Effacer les résultats quand le champ est vide
    noResultsMessage.style.display = "none";
    // Revenir à l'affichage par défaut quand la barre de recherche est vide
    isSearchActive = false; // Recherche désactivée
    fetchAndDisplayMovies(currentPage); // Recharge la page principale
  }
});

// Charger les films dès le chargement de la page
window.onload = () => {
  fetchAndDisplayMovies(currentPage);
};
