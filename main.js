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

window.addEventListener('load', async () => {
    const pelis = await fetchAPI('films/');
    acordeonPeliculas(pelis);

    // Asociar eventos de clic a los botones de filtro
    document.querySelector('.btn-group a:nth-child(1)').addEventListener('click', () => {
        acordeonPeliculas(pelis, 'episodio');
    });

    document.querySelector('.btn-group a:nth-child(2)').addEventListener('click', () => {
        acordeonPeliculas(pelis, 'fecha');
    });
});