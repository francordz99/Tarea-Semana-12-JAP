
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const suggestionsList = document.getElementById("suggestions-list");
const pokemonSearchDiv = document.querySelector(".pokemon-search");

searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    } else {
        showSuggestions(searchInput.value);
    }
});

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}/`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayPokemonDetails(data);
        })
        .catch(error => {
            console.error("Error fetching Pokemon data:", error);
            displayErrorMessage("Pokemon no encontrado");
        });
});

function showSuggestions(prefix) {
    if (!prefix || prefix.length < 2) {
        suggestionsList.innerHTML = "";
        return;
    }

    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const matchingPokemons = data.results.filter(pokemon =>
                pokemon.name.startsWith(prefix) ||
                pokemon.name.includes(prefix)
            ).slice(0, 10);
            displaySuggestions(matchingPokemons);
        })
        .catch(error => {
            console.error("Error fetching Pokemon suggestions:", error);
        });
}

function displaySuggestions(pokemons) {
    suggestionsList.innerHTML = pokemons
        .map(pokemon => `<li>${capitalizeWords(pokemon.name)}</li>`)
        .join("");
}

suggestionsList.addEventListener("click", (event) => {
    const selectedPokemon = event.target.textContent;
    searchInput.value = selectedPokemon;
    suggestionsList.innerHTML = "";
});

function capitalizeAbilityName(name) {
    return name
        .split('-')
        .map(part => capitalizeWords(part))
        .join(' ');
}

function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function displayPokemonDetails(pokemon) {
    const abilitiesHTML = pokemon.abilities
        .map(
            ability =>
                `<li>${capitalizeAbilityName(ability.ability.name)} (Slot: ${ability.slot}, ${ability.is_hidden ? "Oculta" : "No oculta"
                })</li>`
        )
        .join("");

    const formsHTML = pokemon.forms
        .map(form => `<li>${capitalizeWords(form.name)}</li>`)
        .join("");

    const detailsHTML = `
        <h2>${capitalizeWords(pokemon.name)}</h2>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
        <div class="card-columns">
            <div class="card-column">
                <h3>Habilidades:</h3>
                <ul>${abilitiesHTML}</ul>
            </div>
            <div class="card-column">
                <h3>Experiencia Base:</h3>
                <p>${pokemon.base_experience}</p>
            </div>
            <div class="card-column">
                <h3>Formas:</h3>
                <ul>${formsHTML}</ul>
            </div>
        </div>
    `;

    pokemonSearchDiv.innerHTML = detailsHTML;
}

function displayErrorMessage(message) {
    pokemonSearchDiv.innerHTML = `<p>${message}</p>`;
}
