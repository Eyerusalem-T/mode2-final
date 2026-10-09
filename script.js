const state = {
  recipes: [],
  favorites: [],
  search: "",
};

const formEl = document.querySelector("#search-form");
const searchEl = document.querySelector("#search-input");
const recipesEl = document.querySelector("#recipes");
const favoritesEl = document.querySelector("#favorites");
const messageEl = document.querySelector("#message");

function render() {
  const term = state.search.toLowerCase().trim();

  const shown = state.recipes.filter((item) =>
    item.name.toLowerCase().includes(term),
  );

  recipesEl.innerHTML = shown.map((recipe) => createCard(recipe)).join("");
  favoritesEl.innerHTML = state.favorites
    .map((recipe) => createCard(recipe))
    .join("");
}

function createCard(recipe) {
  const image = recipe.image;
  const saved = state.favorites.some((fav) => fav.id === recipe.id);

  return `
    <article class="card">
      <img src="${image}" alt="${recipe.name}">
      <div class="card-content">
        <h3>${recipe.name}</h3>
        <button onclick="addOrRemove(${recipe.id})">
          ${saved ? "Remove" : "Favorite"}
        </button>
      </div>
    </article>
  `;
}

async function LoadRecipes() {
  messageEl.textContent = "Loading...";

  try {
    const response = await fetch("https://dummyjson.com/recipes");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    state.recipes = data.recipes || [];

    messageEl.textContent =
      state.recipes.length === 0 ? "No recipes found." : "";
    render();
  } catch (error) {
    messageEl.textContent = "Error loading recipes";
    console.error("Error loading recipes:", error);
  }
}

function addOrRemove(id) {
  const exists = state.favorites.some((fav) => fav.id === id);

  if (exists) {
    state.favorites = state.favorites.filter((fav) => fav.id !== id);
  } else {
    const recipe = state.recipes.find((item) => item.id === id);
    if (recipe) {
      state.favorites.push(recipe);
    }
  }

  saveFavorites();
  render();
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(state.favorites));
}

function loadFavorites() {
  state.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();

  state.search = searchEl.value.trim();
  render();
});

searchEl.addEventListener("input", function () {
  state.search = searchEl.value.trim();
  render();
});

function init() {
  loadFavorites();
  LoadRecipes();
}

init();
