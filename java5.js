let slideIndex = 0;

function moverCarrusel(n) {
    const slides = document.querySelector('.carrusel-slide');
    const totalSlides = slides.children.length;

    slideIndex += n;

    // Si llega al final, vuelve al inicio
    if (slideIndex >= totalSlides) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
    }

    const offset = -slideIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;
}

// Opcional: Carrusel automático
setInterval(() => moverCarrusel(1), 5000); // Cambia de imagen cada 5 segundos
document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("menu").classList.toggle("active");
});
