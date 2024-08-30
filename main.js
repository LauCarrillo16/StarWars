function crearEstrellas() {
    const contenedorEstrellas = document.querySelector(".estrellas");
    const cantidadEstrellas = 500;

    for (let i = 0; i < cantidadEstrellas; i++) {
        const estrella = document.createElement("div");
        estrella.classList.add("estrella");

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const tamaño = Math.random() * 3;

        estrella.style.left = `${x}px`;
        estrella.style.top = `${y}px`;
        estrella.style.width = `${tamaño}px`;
        estrella.style.height = `${tamaño}px`;

        contenedorEstrellas.appendChild(estrella);
    }
}

window.addEventListener("load", crearEstrellas);
window.addEventListener("resize", () => {
    document.querySelector(".estrellas").innerHTML = "";
    crearEstrellas();
});

const urlFilms = "https://swapi.dev/api/films/";
const urlPeople = "https://swapi.dev/api/people/?page=";
const urlPlanets = "https://swapi.dev/api/planets/?page=";
const urlSpecies = "https://swapi.dev/api/species/?page=";
const urlVehicles = "https://swapi.dev/api/vehicles/?page=";
const urlStarships = "https://swapi.dev/api/starships/?page=";

async function fetchAPI(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! Estado: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

function acordeonPeliculas(pelis, criterio) {
    pelis.results.sort((a, b) => {
        if (criterio === "episodio") {
            return a.episode_id - b.episode_id;
        } else if (criterio === "fecha") {
            return new Date(a.release_date) - new Date(b.release_date);
        }
    });

    const accordionItems = document.querySelectorAll(
        "#peliculas .accordion-item"
    );

    pelis.results.slice(0, accordionItems.length).forEach((peli, index) => {
        const acordeonBody = accordionItems[index].querySelector(".accordion-body");
        acordeonBody.innerHTML = `
            <strong>Title:</strong> ${peli.title}<br>
            <strong>Opening:</strong> ${peli.opening_crawl}<br>
            <strong>Director:</strong> ${peli.director}<br>
            <strong>Producer:</strong> ${peli.producer}<br>
            <strong>Release Date:</strong> ${peli.release_date}
        `;
    });
}

async function contenedorPersonas(perso, criterio) {
    const container = document.querySelector("#personajes .row");
    container.innerHTML = ""; // Limpiar tarjetas existentes

    let personajesFiltrados;

    if (criterio === "female") {
        personajesFiltrados = perso.results.filter(
            (personaje) => personaje.gender === "female"
        );
    } else if (criterio === "male") {
        personajesFiltrados = perso.results.filter(
            (personaje) => personaje.gender === "male"
        );
    } else if (criterio === "noSpecies") {
        personajesFiltrados = perso.results.filter(
            (personaje) => personaje.species.length === 0
        );
    } else if (criterio === "droid") {
        personajesFiltrados = perso.results.filter((personaje) =>
            personaje.species.includes("https://swapi.dev/api/species/2/")
        );
    } else {
        personajesFiltrados = perso.results;
    }

    // Ordenar los personajes por nombre
    personajesFiltrados.sort((a, b) => a.name.localeCompare(b.name));

    // Limitar a los primeros 10 personajes
    const primerosDiezPersonajes = personajesFiltrados.slice(0, 10);

    for (const personaje of primerosDiezPersonajes) {
        const card = document.createElement("div");
        card.classList.add("col");

        const speciesUrl = personaje.species[0];
        let species = "Unknown";
        if (speciesUrl) {
            try {
                const speciesResponse = await fetch(speciesUrl);
                const speciesData = await speciesResponse.json();
                species = speciesData.name;
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        }

        const planetUrl = personaje.homeworld;
        let planet = "Unknown";
        if (planetUrl) {
            try {
                const planetResponse = await fetch(planetUrl);
                const planetData = await planetResponse.json();
                planet = planetData.name;
            } catch (error) {
                console.error("Error fetching planet:", error);
            }
        }

        card.innerHTML = `
            <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                <div class="card-body">
                    <p class="card-text">
                        Name: ${personaje.name}<br>
                        Height: ${personaje.height} cm<br>
                        Mass: ${personaje.mass} kg<br>
                        Hair Color: ${personaje.hair_color}<br>
                        Skin Color: ${personaje.skin_color}<br>
                        Eye Color: ${personaje.eye_color}<br>
                        Birth Year: ${personaje.birth_year}<br>
                        Gender: ${personaje.gender}<br>
                        Species: ${species}<br>
                        Homeworld: ${planet}
                    </p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
}

async function contenedorPlanetas(planetes, criterio) {
    const container = document.querySelector("#planetas .row");
    container.innerHTML = "";

    let planetasFiltrados = planetes.results;
    if (criterio == "namePlanet") {
        planetasFiltrados.sort((a, b) => a.name.localeCompare(b.name));
    }


    // Obtener los primeros 10 planetas después de la ordenación
    const primerosDiezPlanetas = planetasFiltrados.slice(0, 10);

    // Crear las tarjetas para cada planeta basado en el criterio
    for (const planeta of primerosDiezPlanetas) {
        const card = document.createElement("div");
        card.classList.add("col");

        let contenido;
        switch (criterio) {
            case "rotation":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                Name: ${planeta.name}<br>
                                Rotation: ${planeta.rotation_period} hours
                            </p>
                        </div>
                    </div>
                `;
                break;
            case "orbital":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                Name: ${planeta.name}<br>
                                Orbital: ${planeta.orbital_period}
                            </p>
                        </div>
                    </div>
                `;
                break;
            case "diameter":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                Name: ${planeta.name}<br>
                                Diameter: ${planeta.diameter} km
                            </p>
                        </div>
                    </div>
                `;
                break;
            case "surfaceWater":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                Name: ${planeta.name}<br>
                                Surface Water: ${planeta.surface_water}%
                            </p>
                        </div>
                    </div>
                `;
                break;
            default:
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                Name: ${planeta.name}<br>
                                Rotation: ${planeta.rotation_period}<br>
                                Orbital: ${planeta.orbital_period}<br>
                                Diameter: ${planeta.diameter} km<br>
                                Surface Water: ${planeta.surface_water}<br>
                                Population: ${planeta.population}
                            </p>
                        </div>
                    </div>
                `;
                break;
        }

        card.innerHTML = contenido;
        container.appendChild(card);
    }
}



/*soata especies */
async function contenedorSpecies(species, criterio) {
    const container = document.querySelector("#species .row");
    container.innerHTML = "";

    let SpeciesFiltradas = species.results;
    if (criterio == "nameSpecie") {
        SpeciesFiltradas.sort((a, b) => a.name.localeCompare(b.name));
    }
    

    // Obtener las primeras 10 especies después de la ordenación
    const primerasDiezSpecies = SpeciesFiltradas.slice(0, 10);

    // Crear las tarjetas para cada especie basado en el criterio
    for (const especie of primerasDiezSpecies) {
        const card = document.createElement("div");
        card.classList.add("col");

        let contenido;
        switch (criterio) {
            case "classification":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${especie.name}<br>
                                <strong>Classification:</strong> ${especie.classification}<br>
                                <strong>Average Height:</strong> ${especie.average_height} cm
                            </p>
                        </div>
                    </div>
                `;
                break;
            case "designation":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${especie.name}<br>
                                <strong>Designation:</strong> ${especie.designation}<br>
                                <strong>Language:</strong> ${especie.language}
                            </p>
                        </div>
                    </div>
                `;
                break;
            default:
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${especie.name}<br>
                                <strong>Classification:</strong> ${especie.classification}<br>
                                <strong>Designation:</strong> ${especie.designation}<br>
                                <strong>Average Height:</strong> ${especie.average_height} cm<br>
                                <strong>Average Lifespan:</strong> ${especie.average_lifespan} years<br>
                                <strong>Language:</strong> ${especie.language}
                            </p>
                        </div>
                    </div>
                `;
                break;
            }

            card.innerHTML = contenido;
            container.appendChild(card);
    }
}

/* soata Starships */
async function contenedorStarships(starship, criterio) {
    const container = document.querySelector("#starships .row");
    container.innerHTML = "";

    let StarshipsFiltradas = starship?.results || [];
    if (criterio == "nameStarship") {
        StarshipsFiltradas.sort((a, b) => a.name.localeCompare(b.name));
    }

    const primerasDiezStarships = StarshipsFiltradas.slice(0, 10);

    for (const starship of primerasDiezStarships) {
        const card = document.createElement("div");
        card.classList.add("col");

        let contenido;
        switch (criterio) {
            case "Manufacturer":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${starship.name}<br>
                                <strong>Manufacturer:</strong> ${starship.manufacturer}<br>
                                <strong>Consumables:</strong> ${starship.consumables} years<br>
                                <strong>Hyperdrive Rating:</strong> ${starship.hyperdrive_rating}
                            </p>
                        </div>
                    </div>
                `;
                break;
            case "Passengers":
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${starship.name}<br>
                                <strong>Passengers:</strong> ${starship.passengers}<br>
                                <strong>Crew:</strong> ${starship.crew}
                            </p>
                        </div>
                    </div>
                `;
                break;
            default:
                contenido = `
                    <div class="card text-bg-warning mb-3" style="max-width: 18rem">
                        <div class="card-body">
                            <p class="card-text">
                                <strong>Name:</strong> ${starship.name}<br>
                                <strong>Model:</strong> ${starship.model}<br>
                                <strong>Cost in Credits:</strong> ${starship.cost_in_credits}<br>
                                <strong>Length:</strong> ${starship.length} <br>
                                <strong>Cargo Capacity:</strong> ${starship.cargo_capacity} years<br>
                                <strong>Hyperdrive Rating:</strong> ${starship.hyperdrive_rating}
                            </p>
                        </div>
                    </div>
                `;
                break;
        }

        card.innerHTML = contenido;
        container.appendChild(card);
    }
}



window.addEventListener("load", async () => {
    const pelis = await fetchAPI(urlFilms);
    acordeonPeliculas(pelis);

    const perso = await fetchAPI(urlPeople);
    contenedorPersonas(perso);

    const planetes = await fetchAPI(urlPlanets);
    contenedorPlanetas(planetes);
/* soata species*/
    const speciesData = await fetchAPI(urlSpecies);
    contenedorSpecies(speciesData, "nameSpecie");
/* soata starships*/
const starshipsdata = await fetchAPI(urlStarships); 
    contenedorStarships(starshipsdata, "nameStarship");


    // Asociar eventos de clic a los botones de filtro
    document.querySelector("#btnPelis a:nth-child(1)").addEventListener("click", () => {
        acordeonPeliculas(pelis, "episodio");
    });

    document.querySelector("#btnPelis a:nth-child(2)").addEventListener("click", () => {
        acordeonPeliculas(pelis, "fecha");
    });

    // Asociar eventos de clic a los botones de filtro para personas
    document.querySelector("#btnAllPeople").addEventListener("click", async () => {
        const perso = await fetchAPI(urlPeople);
        contenedorPersonas(perso, "noSpecies");
    });

    document.querySelector("#btnFemale").addEventListener("click", async () => {
        const perso = await fetchAPI(urlPeople);
        contenedorPersonas(perso, "female");
    });

    document.querySelector("#btnMale").addEventListener("click", async () => {
        const perso = await fetchAPI(urlPeople);
        contenedorPersonas(perso, "male");
    });

    document.querySelector("#btnName").addEventListener("click", async () => {
        const perso = await fetchAPI(urlPeople);
        contenedorPersonas(perso, "name");
    });

    document.querySelector("#btnDroid").addEventListener("click", async () => {
        const perso = await fetchAPI(urlPeople);
        contenedorPersonas(perso, "droid");
    });

    // Asociar eventos de clic a los botones de filtro para planetas
    document.querySelector("#btnRotation").addEventListener("click", () => {
        contenedorPlanetas(planetes, "rotation");
    });

    document.querySelector("#btnOrbital").addEventListener("click", () => {
        contenedorPlanetas(planetes, "orbital");
    });

    document.querySelector("#btnDiameter").addEventListener("click", () => {
        contenedorPlanetas(planetes, "diameter");
    });

    document.querySelector("#btnnamePlanet").addEventListener("click", () => {
        contenedorPlanetas(planetes, "namePlanet");
    });

    document.querySelector("#btnSurfaceWater").addEventListener("click", () => {
        contenedorPlanetas(planetes, "surfaceWater");
    });

    // Asociar eventos de clic a los botones de filtro para especies
    document.querySelector("#btnClassification").addEventListener("click", () => {
        contenedorSpecies(speciesData, "classification");
    });

    document.querySelector("#btnDesignation").addEventListener("click", () => {
        contenedorSpecies(speciesData, "designation");
    });

    // Asociar eventos de clic a los botones de filtro para starships
    document.querySelector("#btnManufacturer").addEventListener("click", () => {
        contenedorStarships(starshipsdata, "Manufacturer");
    });
    
    document.querySelector("#btnPassengers").addEventListener("click", () => {
        contenedorStarships(starshipsdata, "Passengers");  
    });
    
    
});
