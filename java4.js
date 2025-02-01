// Tasas de cambio personalizadas
const tasaCambioUSDToCOP = 4100; // 1 USD = 4200 COP
const tasaCambioUSDToARS = 1150; // 1 USD = 1150 ARS

// Función para convertir los precios
function convertirPrecio(precioUSD) {
    const precioNumerico = parseFloat(precioUSD); // Convertir el precio de string a número
    const precioCOP = (precioNumerico * tasaCambioUSDToCOP).toFixed(2); // Convertir a COP
    const precioARS = (precioNumerico * tasaCambioUSDToARS).toFixed(2); // Convertir a ARS
    return { precioCOP, precioARS };
}

// Lista de cuentas con sus precios en USD
const cuentas = [
    {nombre: "HBO Max 1 pantalla", precio: "1.8 USD", imagen: "media/1.jpeg"},
    {nombre: "Crunchyroll 1 pantalla", precio: "1.8 USD", imagen: "media/crunchy.jpg"},
    {nombre: "Plex 1 pantalla", precio: "2.0 USD", imagen: "media/Plex-1.jpg.webp"},
    {nombre: "YouTube 1 mes", precio: "2.0 USD", imagen: "media/youtube.webp"},
    {nombre: "Prime Video 1 pantalla", precio: "1.8 USD", imagen: "media/6.jpeg"},
    {nombre: "Paramount 1 pantalla", precio: "1.8 USD", imagen: "media/paramount.webp"},
    {nombre: "Netflix 1 pantalla", precio: "2.0 USD", imagen: "media/3.jpeg"},
    {nombre: "Netflix 5 pantallas", precio: "8.8 USD", imagen: "media/netflix.jpg"},
    {nombre: "Paramount Plus 5 pantallas", precio: "3 USD", imagen: "media/paramount.webp"},
    {nombre: "HBO Max 5 pantallas", precio: "3.5 USD", imagen: "media/1.jpeg"},
    {nombre: "Crunchyroll cuenta completa", precio: "2.8 USD", imagen: "media/crunchy.jpg"},
    {nombre: "Prime Video 5 pantallas", precio: "3.8 USD", imagen: "media/6.jpeg"},
    {nombre: "Plex 5 pantallas", precio: "3.8 USD", imagen: "media/Plex-1.jpg.webp"},
    {nombre: "Vix Premium 1 pantalla", precio: "2 USD", imagen: "media/vix.webp"},
    {nombre: "Vix 5 pantallas", precio: "3.0 USD", imagen: "media/vix.webp"},
    {nombre: "Disney Plus 1 pantalla", precio: "1.8 USD", imagen: "media/disney.jpg"},
    {nombre: "IPTV Multicanales 1 pantalla", precio: "2 USD", imagen: "media/iptv.webp"},
    {nombre: "Spotify 1 mes", precio: "2.30 USD", imagen: "media/spotify.webp"}
];

// Mostrar las tarjetas con el precio actualizado según la moneda seleccionada
const tarjetasContainer = document.getElementById("tarjetas-container");
cuentas.forEach(cuenta => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-4 mb-3";
    const { precioCOP, precioARS } = convertirPrecio(cuenta.precio.split(' ')[0]); // Convertir el precio de USD
    tarjeta.innerHTML = `
        <div class="card">
            <img src="${cuenta.imagen}" class="card-img-top" alt="${cuenta.nombre}">
            <div class="card-body">
                <h5 class="card-title">${cuenta.nombre}</h5>
                <p class="card-text">Precio: <span class="precio">${cuenta.precio}</span></p>
                <label for="moneda">Seleccionar moneda:</label>
                <select class="form-select moneda" aria-label="Moneda">
                    <option value="USD">USD</option>
                    <option value="COP">COP</option>
                    <option value="ARS">ARS</option>
                </select>
            </div>
        </div>
    `;
    tarjetasContainer.appendChild(tarjeta);

    // Agregar un evento para cambiar la moneda al seleccionar
    const selectMoneda = tarjeta.querySelector('.moneda');
    selectMoneda.addEventListener('change', function() {
        const precioUSD = cuenta.precio.split(' ')[0]; // Obtener solo el valor numérico de USD
        const { precioCOP, precioARS } = convertirPrecio(precioUSD);
        const precioElemento = tarjeta.querySelector('.precio');
        
        switch (this.value) {
            case 'COP':
                precioElemento.textContent = `${precioCOP} COP`;
                break;
            case 'ARS':
                precioElemento.textContent = `${precioARS} ARS`;
                break;
            case 'USD':
            default:
                precioElemento.textContent = `${cuenta.precio}`;
                break;
        }
    });
});

document.getElementById("btnPagos").addEventListener("click", function() {
    var infoPagos = document.getElementById("infoPagos");
    if (infoPagos.style.display === "none" || infoPagos.style.display === "") {
      infoPagos.style.display = "block";
    } else {
      infoPagos.style.display = "none";
    }
  });
  