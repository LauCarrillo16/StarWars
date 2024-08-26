function crearEstrellas() {
    const contenedorEstrellas = document.querySelector('.estrellas');
    const cantidadEstrellas = 500;

    for (let i = 0; i < cantidadEstrellas; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        
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

window.addEventListener('load', crearEstrellas);
window.addEventListener('resize', () => {
    document.querySelector('.estrellas').innerHTML = '';
    crearEstrellas();
});

const urlAPI ="https://swapi.dev/api/";

async function fetchAPI(endpoint) {
    try {
        const respuesta = await fetch(`${urlAPI}${endpoint}`);
        if (!respuesta.ok) {
            throw new Error(`HTTP error! Estado: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para renderizar el contenido del acordeón de películas
function acordeonPeliculas(pelis, criterio) {
    // Ordenar las películas según el criterio
    pelis.results.sort((a, b) => {
        if (criterio === 'episodio') {
            return a.episode_id - b.episode_id;
        } else if (criterio === 'fecha') {
            return new Date(a.release_date) - new Date(b.release_date);
        }
    });

    const accordionItems = document.querySelectorAll('#peliculas .accordion-item');

    pelis.results.forEach((peli, index) => {
        if (index < accordionItems.length) {
            const acordeonBody = accordionItems[index].querySelector('.accordion-body');
            acordeonBody.innerHTML = `
                <strong>Title:</strong> ${peli.title}<br>
                <strong>Opening:</strong> ${peli.opening_crawl}<br>
                <strong>Director:</strong> ${peli.director}<br>
                <strong>Producer:</strong> ${peli.producer}<br>
                <strong>Relase Date:</strong> ${peli.release_date}
            `;
        }
    });
}

// Función para obtener y renderizar los personajes filtrados y ordenados
async function contenedorPersonas(perso, criterio) {
    const container = document.querySelector('#personajes .row');
    container.innerHTML = '';

    let personajesFiltrados;

    if (criterio === 'female') {
        personajesFiltrados = perso.results.filter(personaje => personaje.gender === 'female');
    } else if (criterio === 'male') {
        personajesFiltrados = perso.results.filter(personaje => personaje.gender === 'male');
    } else if (criterio === 'noSpecies') {
        personajesFiltrados = perso.results.filter(personaje => personaje.species.length === 0);
    } else if (criterio === 'droid') {
        personajesFiltrados = perso.results.filter(personaje => personaje.species.includes("https://swapi.dev/api/species/2/"));
    } else {
        personajesFiltrados = perso.results;
    }

    // Ordenar los personajes por nombre
    personajesFiltrados.sort((a, b) => {
        const nameComparison = a.name.localeCompare(b.name);
        return nameComparison;
    });

    const primerosDiezPersonajes = personajesFiltrados.slice(0, 10);

    for (const personaje of primerosDiezPersonajes) {
        const card = document.createElement('div');
        card.classList.add('col');

        const speciesUrl = personaje.species[0];
        let species = 'Unknown';
        if (speciesUrl) {
            try {
                const speciesResponse = await fetch(speciesUrl);
                const speciesData = await speciesResponse.json();
                species = speciesData.name;
            } catch (error) {
                console.error('Error fetching species:', error);
            }
        }

        const planetUrl = personaje.homeworld;
        let planet = 'Unknown';
        if (planetUrl) {
            try {
                const planetResponse = await fetch(planetUrl);
                const planetData = await planetResponse.json();
                planet = planetData.name;
            } catch (error) {
                console.error('Error fetching planet:', error);
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





window.addEventListener('load', async () => {
    const pelis = await fetchAPI('films/');
    acordeonPeliculas(pelis);

    const perso = await fetchAPI('people/');
    contenedorPersonas(perso);
    
    const planeta = await fetchAPI('planets/');
    acordeonPeliculas(planeta);

    const especie = await fetchAPI('species/');
    contenedorPersonas(especie);

    const vehiculos = await fetchAPI('vehicles/');
    acordeonPeliculas(vehiculos);

    const naves = await fetchAPI('people/');
    contenedorPersonas(naves);
    
    

    // Asociar eventos de clic a los botones de filtro
    document.querySelector('#btnPelis a:nth-child(1)').addEventListener('click', () => {
        acordeonPeliculas(pelis, 'episodio');
    });

    document.querySelector('#btnPelis a:nth-child(2)').addEventListener('click', () => {
        acordeonPeliculas(pelis, 'fecha');
    });

    document.querySelector('#btnAllPeople').addEventListener('click', async () => {
    const perso = await fetchAPI('people/');
    contenedorPersonas(perso, 'noSpecies');
});
document.querySelector('#btnFemale').addEventListener('click', async () => {
    const perso = await fetchAPI('people/');
    contenedorPersonas(perso, 'female');
});
document.querySelector('#btnMale').addEventListener('click', async () => {
    const perso = await fetchAPI('people/');
    contenedorPersonas(perso, 'male');
});
document.querySelector('#btnName').addEventListener('click', async () => {
    const perso = await fetchAPI('people/');
    contenedorPersonas(perso, 'name');
});
document.querySelector('#btnDroid').addEventListener('click', async () => {
    const perso = await fetchAPI('people/');
    contenedorPersonas(perso, 'droid');
});

});