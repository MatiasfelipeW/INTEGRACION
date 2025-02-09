// JavaScript for Matrix Animation
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Insert canvas at the top of the body
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1'; // Send canvas behind other elements

let topArray = Array(Math.ceil(canvas.width / 10)).fill(0);

function matrixEffect() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00ff99";
    ctx.font = "15px monospace";

    topArray.forEach((y, index) => {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = index * 10;
        ctx.fillText(text, x, y);

        if (y > canvas.height + Math.random() * 10000) {
            topArray[index] = 0;
        } else {
            topArray[index] += 10;
        }
    });
}

setInterval(matrixEffect, 50);

// Handle resizing window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    topArray = Array(Math.ceil(canvas.width / 10)).fill(0);
});

let whatsappButton = document.querySelector('.whatsapp-button');

// Guardamos la posición anterior del cursor
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // El usuario está bajando, ocultamos el botón
        whatsappButton.classList.add('hidden');
    } else {
        // El usuario está subiendo, mostramos el botón
        whatsappButton.classList.remove('hidden');
    }
    // Actualizamos la posición actual del scroll
    lastScrollY = window.scrollY;
});

// Wait for the entire page to load before hiding the preloader
window.addEventListener('load', function () {
    // Add the 'loaded' class to the body to hide the preloader
    document.body.classList.add('loaded');
});

// JavaScript para controlar la duración del preloader
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");
  
    setTimeout(() => {
      preloader.classList.add("hide"); // Oculta el preloader
      content.style.display = "block"; // Muestra el contenido principal
    }, 5000); // Ajusta el tiempo aquí (en milisegundos)
  });

  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        let preloader = document.getElementById("preloader");
        preloader.classList.add("hidden");
        setTimeout(() => {
            preloader.style.display = "none"; // Ocultar completamente después de la animación
        }, 1000);
    }, 5000); // 5 segundos
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".teleport-button").forEach(button => {
        button.addEventListener("click", function (event) {
            let url = this.getAttribute("data-url");
            let smoke = document.createElement("div");

            smoke.classList.add("smoke");
            smoke.style.left = `${event.clientX - 75}px`;
            smoke.style.top = `${event.clientY - 75}px`;
            document.body.appendChild(smoke);

            setTimeout(() => {
                window.location.href = url;
            }, 600);
        });
    });
});

$(document).ready(function() {
    const serviceDescriptions = {
        fullstack: "Ofrecemos desarrollo fullstack con tecnologías modernas y escalables para crear aplicaciones web completas, desde el diseño de la interfaz hasta la implementación del backend. Nos especializamos en construir sitios web dinámicos, plataformas interactivas y sistemas personalizados, adaptándonos a las necesidades de tu negocio.",
        blockchain: "La tecnología Blockchain ha revolucionado la forma en que se gestionan los datos y las transacciones digitales, ofreciendo seguridad, transparencia y descentralización. Su estructura basada en bloques encadenados permite registrar información de manera inmutable, eliminando la necesidad de intermediarios y reduciendo el riesgo de fraudes. Desde criptomonedas y contratos inteligentes hasta identidad digital y logística, Blockchain se ha convertido en una herramienta clave para diversos sectores, brindando soluciones innovadoras y confiables en un mundo cada vez más digitalizado.",
        enterprise: "Desarrollo de software a la medida para grandes empresas, integración con sistemas ERP y CRM, asegurando escalabilidad y alta disponibilidad.",
        custom: "Programación personalizada adaptada a necesidades específicas, optimización de código, automatización de procesos y desarrollo de APIs avanzadas."
    };

    $(".services li").click(function() {
        let serviceKey = $(this).data("service");
        let description = serviceDescriptions[serviceKey];
        
        $("#service-info").hide().html(description).fadeIn(500);
    });

    // Función para cambiar el color de los botones cada 2.5 segundos
    function changeButtonColor() {
        $(".services li").each(function() {
            if ($(this).css("background-color") === "rgb(0, 255, 0)") { // #0f0 en RGB
                $(this).css("background-color", "#ccc"); // Cambiar a gris claro
            } else {
                $(this).css("background-color", "#0f0"); // Cambiar a verde
            }
        });
    }

    // Ejecutar la función cada 2.5 segundos
    setInterval(changeButtonColor, 2500);
});

