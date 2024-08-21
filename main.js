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