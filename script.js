const container = document.getElementById("poke-container");
const searchInput = document.getElementById("search");
const pagination = document.getElementById("pagination");
const infoPanel = document.getElementById("poke-info");

let allPokemon = [];
const perPage = 15;
let currentPage = 1;
let totalPages = 0;

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await res.json();
}

function createCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  card.innerHTML = `
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    <p>#${pokemon.id}</p>
  `;

  card.addEventListener("click", () => showPokemonInfo(pokemon));

  container.appendChild(card);
}

function showPokemonInfo(pokemon) {
  infoPanel.innerHTML = `
    <h2>${pokemon.name} (#${pokemon.id})</h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Height:</strong> ${pokemon.height}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
  `;
}

async function loadPokemon() {
  for (let i = 1; i <= 1025; i++) {
    const p = await fetchPokemon(i);
    allPokemon.push(p);
    createCard(p);
  }

  totalPages = Math.ceil(allPokemon.length / perPage);
  renderPage(currentPage);
  createPagination();
}

function renderPage(page) {
  container.innerHTML = "";
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = allPokemon.slice(start, end);
  paginated.forEach(p => createCard(p));
}

function createPagination() {
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage(currentPage);
      createPagination();
    });
    pagination.appendChild(btn);
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allPokemon.filter(p => p.name.includes(value));
  container.innerHTML = "";
  filtered.forEach(p => createCard(p));
  pagination.style.display = value ? "none" : "flex";
  infoPanel.innerHTML = `<h2>Pokémon Info</h2><p>Click on a Pokémon card to see details here</p>`;
});

loadPokemon();