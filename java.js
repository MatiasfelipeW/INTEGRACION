/* =============================================================
   WHIAT COMPANY — Script principal
   Preloader · Meteoros (canvas) · i18n · Pyodide IDE · Fix Imágenes
   ============================================================= */

// =====================================================================
// 0. FIX CENTRALIZADO DE IMÁGENES (evita el triángulo ⚠️ en móvil)
// =====================================================================
(function globalImageFallback() {
    const SVG_LOGO   = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%2300d4ff'/><text x='50' y='70' font-size='50' text-anchor='middle' fill='white'>W</text></svg>";
    const SVG_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%2300d4ff'/><text x='50' y='70' font-size='40' text-anchor='middle' fill='white'>MW</text></svg>";

    function applyFallback(img) {
        if (!img || img.dataset.fbApplied === 'true') return;
        img.dataset.fbApplied = 'true';
        const kind = img.getAttribute('data-fallback') || 'logo';
        img.onerror = null; // ✅ evita bucle
        img.src = kind === 'avatar' ? SVG_AVATAR : SVG_LOGO;
    }

    // Ejecuta inmediatamente sobre todas las imágenes existentes
    function scanAll() {
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            // Si ya falló antes de que cargara el JS
            if (img.complete && img.naturalWidth === 0) {
                applyFallback(img);
            }
            // Listener de seguridad
            img.addEventListener('error', () => applyFallback(img));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAll);
    } else {
        scanAll();
    }

    // MutationObserver por si añades imágenes después
    if ('MutationObserver' in window) {
        new MutationObserver(scanAll).observe(document.body, { childList: true, subtree: true });
    }
})();

// =====================================================================
// 1. FACTORY DE METEOROS (reutilizable)
// =====================================================================
function createMeteorField(canvasId, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const config = Object.assign({
        countDesktop: 8,
        countMobile: 4,
        speedMin: 2.5,
        speedMax: 4.5,
        lengthMin: 90,
        lengthMax: 220,
        widthMin: 1,
        widthMax: 2.6
    }, opts || {});

    let w, h, dpr;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth || window.innerWidth;
        h = canvas.clientHeight || window.innerHeight;
        canvas.width  = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
        meteors.forEach(m => m.spawn(true));
    });

    const COLORS = [
        { head: '#ffffff', mid: 'rgba(0, 234, 255, 0.75)', tail: 'rgba(0, 212, 255, 0)' },
        { head: '#aef3ff', mid: 'rgba(0, 212, 255, 0.7)', tail: 'rgba(0, 212, 255, 0)' },
        { head: '#ffffff', mid: 'rgba(150, 230, 255, 0.7)', tail: 'rgba(0, 212, 255, 0)' }
    ];

    class Meteor {
        constructor(initial = false) {
            this.spawn(initial);
        }

        spawn(initial = false) {
            this.angle = Math.PI * 0.75;
            this.speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);

            this.x = w * 0.5 + Math.random() * w * 1.2;
            this.y = -100 - Math.random() * h * 0.6;

            this.length = config.lengthMin + Math.random() * (config.lengthMax - config.lengthMin);
            this.width = config.widthMin + Math.random() * (config.widthMax - config.widthMin);
            this.opacity = 0.5 + Math.random() * 0.5;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

            if (initial) {
                this.x = Math.random() * w * 1.4;
                this.y = Math.random() * h - h * 0.4;
            }
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.y > h + 200 || this.x < -300) {
                this.spawn();
            }
        }

        draw() {
            const dx = Math.cos(this.angle) * this.length;
            const dy = Math.sin(this.angle) * this.length;
            const tailX = this.x - dx;
            const tailY = this.y - dy;

            const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            grad.addColorStop(0, this.color.head);
            grad.addColorStop(0.35, this.color.mid);
            grad.addColorStop(1, this.color.tail);

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = this.width;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            const headGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 6);
            headGlow.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            headGlow.addColorStop(0.4, `rgba(0, 234, 255, ${this.opacity * 0.8})`);
            headGlow.addColorStop(1, 'rgba(0, 212, 255, 0)');

            ctx.beginPath();
            ctx.fillStyle = headGlow;
            ctx.arc(this.x, this.y, this.width * 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.width * 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const count = window.innerWidth < 700 ? config.countMobile : config.countDesktop;
    const meteors = [];
    for (let i = 0; i < count; i++) {
        meteors.push(new Meteor(true));
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        for (const m of meteors) {
            m.update();
            m.draw();
        }
        requestAnimationFrame(loop);
    }
    loop();
}

// =====================================================================
// 2. PRELOADER — 4 segundos
// =====================================================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const BUILD_TIME = 3200;
    const FADE_TIME  = 800;

    createMeteorField('preloaderMeteors', {
        countDesktop: 6,
        countMobile: 4,
        speedMin: 1.2,
        speedMax: 2.2,
        lengthMin: 100,
        lengthMax: 240,
        widthMin: 1,
        widthMax: 2.4
    });

    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;

        if (elapsed < BUILD_TIME) {
            requestAnimationFrame(tick);
        } else {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                startPageMeteors();
            }, FADE_TIME);
        }
    }
    requestAnimationFrame(tick);

    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                startPageMeteors();
            }, 900);
        }
    }, 6000);
})();

let pageMeteorsStarted = false;
function startPageMeteors() {
    if (pageMeteorsStarted) return;
    pageMeteorsStarted = true;

    createMeteorField('meteorCanvas', {
        countDesktop: 8,
        countMobile: 4,
        speedMin: 2.5,
        speedMax: 4.5,
        lengthMin: 90,
        lengthMax: 220,
        widthMin: 1,
        widthMax: 2.6
    });
}

// =====================================================================
// 3. SEGURIDAD BÁSICA
// =====================================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key))) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

document.body.addEventListener('copy', function (e) {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    return false;
});

document.body.addEventListener('cut', function (e) {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    return false;
});

// =====================================================================
// 4. SISTEMA DE IDIOMAS (i18n)
// =====================================================================
const translations = {
    es: {
        titulo: "Whiat Company - Soluciones Digitales Integrales",
        whiat_company: "WHIAT COMPANY",
        nav_modelo: "Modelo",
        nav_servicios: "Servicios",
        nav_desarrollo_web: "Desarrollo Web",
        nav_aliados: "Aliados",
        nav_perfil: "Perfil",
        nav_contacto: "Contacto",
        nav_python_ide: "Python IDE",
        nav_iniciar_sesion: "Iniciar Sesión",
        hero_badge: "Soluciones Digitales Integrales | Aliados Estratégicos",
        hero_titulo: "Impulsamos tu negocio con tecnología de vanguardia",
        hero_descripcion: "Expertos en crear aplicaciones móviles, sitios web de alto rendimiento, ciberseguridad, blockchain y soluciones digitales a medida para pequeñas, medianas y grandes empresas.",
        hero_boton: "Cuéntanos tu idea",
        servicios_titulo: "Nuestros Servicios Especializados",
        servicios_subtitulo: "Soluciones completas para cada necesidad digital de tu empresa.",
        servicio1_titulo: "Apps Android & iOS",
        servicio1_desc: "Aplicaciones nativas e híbridas de alto rendimiento.",
        servicio1_item1: "Apps para comercios y restaurantes",
        servicio1_item2: "Plataformas de pedidos a domicilio",
        servicio1_item3: "Sistemas de fidelización",
        servicio1_item4: "Publicación en App Store y Play Store",
        servicio1_boton: "Cotizar App",
        servicio2_titulo: "Ciberseguridad & Protección de Datos",
        servicio2_desc: "Protegemos tu infraestructura digital contra amenazas.",
        servicio2_item1: "Auditorías de seguridad y pentesting",
        servicio2_item2: "Implementación de firewalls",
        servicio2_item3: "Gestión de identidades y accesos",
        servicio2_item4: "Cumplimiento de normas (ISO 27001, GDPR)",
        servicio2_boton: "Proteger mi Empresa",
        servicio3_titulo: "Blockchain & Minería Crypto",
        servicio3_desc: "Desarrollamos soluciones basadas en blockchain y asesoría en minería.",
        servicio3_item1: "Desarrollo de contratos inteligentes",
        servicio3_item2: "Implementación de redes privadas",
        servicio3_item3: "Asesoría en granjas de minería",
        servicio3_item4: "Tokenización de activos (NFTs, STOs)",
        servicio3_boton: "Explorar Blockchain",
        servicio4_titulo: "Outsourcing IT & Corretaje",
        servicio4_desc: "Amplía tu equipo con programadores expertos por proyecto.",
        servicio4_item1: "Contratación por horas o proyecto",
        servicio4_item2: "Desarrolladores full-stack",
        servicio4_item3: "Especialistas en bases de datos",
        servicio4_item4: "Gestión de pagos y KPIs",
        servicio4_boton: "Contratar Talento",
        servicio5_titulo: "Soporte para PYMES",
        servicio5_desc: "Gestionamos y optimizamos tu infraestructura tecnológica.",
        servicio5_item1: "Administración de servidores y redes",
        servicio5_item2: "Soporte técnico remoto",
        servicio5_item3: "Mantenimiento de equipos",
        servicio5_item4: "Estrategias de transformación digital",
        servicio5_boton: "Solicitar Soporte",
        servicio6_titulo: "Páginas Web & CMS",
        servicio6_desc: "Creamos sitios web impactantes y fáciles de administrar.",
        servicio6_item1: "Diseño responsivo UX/UI",
        servicio6_item2: "E-commerce (Tiendas online)",
        servicio6_item3: "Gestión de contenido (WordPress, Strapi)",
        servicio6_item4: "Optimización SEO y velocidad",
        servicio6_boton: "Crear mi Web",
        servicio7_titulo: "Mantenimiento & Actualización",
        servicio7_desc: "Aseguramos que tu sitio esté siempre actualizado y seguro.",
        servicio7_item1: "Actualizaciones de seguridad",
        servicio7_item2: "Copias de seguridad automáticas",
        servicio7_item3: "Monitoreo 24/7",
        servicio7_item4: "Migraciones de servidores",
        servicio7_boton: "Mantener mi Proyecto",
        fullstack_titulo: "Desarrollo Web Fullstack",
        fullstack_subtitulo: "Construimos aplicaciones web completas.",
        fullstack_frontend: "Frontend Moderno",
        fullstack_backend: "Backend Robusto",
        fullstack_db: "Bases de Datos",
        fullstack_boton: "Solicitar Desarrollo Personalizado",
        aliados_titulo: "Aliados del Nuevo Mundo Digital",
        aliados_subtitulo: "Conectamos empresas con la era digital.",
        aliados_emergentes: "Para Empresas Emergentes",
        aliados_emergentes_desc: "Acompañamos a startups y negocios en sus primeras etapas digitales.",
        aliados_acreditadas: "Para Empresas Acreditadas",
        aliados_acreditadas_desc: "Modernizamos infraestructura y adoptamos nuevas tecnologías.",
        perfil_titulo: "Perfil Profesional",
        perfil_subtitulo: "Conoce al fundador",
        perfil_ceo: "CEO & Fundador",
        perfil_tag_fullstack: "Desarrollador Full-Stack",
        perfil_tag_blockchain: "Especialista Blockchain",
        perfil_boton_web: "Mi Website Oficial",
        perfil_boton_whatsapp: "Consulta Inmediata",
        perfil_boton_email: "Correo Directo",
        cta_titulo: "¿Listo para dar el salto digital?",
        cta_descripcion: "Ya sea un desarrollo a medida, ampliar tu equipo con nuestros freelancers o asegurar tu infraestructura, estamos aquí para hacerlo realidad.",
        cta_boton: "Solicitar una Consultoría Gratuita",
        test_titulo: "🔥 Pon a prueba tu dominio de Python",
        test_descripcion: "¿Crees que dominas Python? Demuestra tus conocimientos con este test interactivo.",
        test_tag1: "🐍 Sintaxis básica",
        test_tag2: "📝 Strings",
        test_tag3: "🧠 Lógica",
        test_tag4: "⚡ Rápido y divertido",
        test_boton: "🎯 Probar mi nivel →",
        test_tag_tiempo: "⏱️ Menos de 5 min",
        test_tag_python: "🐍 Python Challenge",
        ide_titulo: "Python IDE Interactivo (Local)",
        ide_descripcion: "Escribe, ejecuta y prueba código Python directamente en tu navegador. <strong>Compatible con input()</strong> y toda la biblioteca estándar.",
        ide_boton_ejecutar: "Ejecutar código",
        ide_boton_limpiar: "Limpiar editor",
        ide_boton_restaurar: "Restaurar ejemplo",
        ide_cargando: "Cargando Pyodide...",
        ide_stdin_label: "📥 Entrada estándar (stdin) - simula input()",
        ide_stdin_placeholder: "Escribe aquí los valores que tomará input() en orden\nEjemplo:\nJuan\n25",
        ide_stdin_ayuda: "Cada línea será una respuesta para cada input() en el orden en que aparecen.",
        ide_output_header: "🖥️ Salida / Error",
        ide_inicializando: "⏳ Inicializando entorno Python (Pyodide)...",
        ide_espera: "Esto tomará unos segundos la primera vez.",
        ide_footer: "🧠 Powered by <strong>Pyodide</strong> (Python en WebAssembly) - Ejecución 100% local en tu navegador. Soporta input(), print(), listas, loops, funciones, etc.",
        contacto_titulo: "Contacto",
        contacto_subtitulo: "Ponte en contacto con nosotros",
        contacto_nombre: "Nombre Completo",
        contacto_nombre_placeholder: "Tu nombre",
        contacto_telefono: "Teléfono (con indicativo)",
        contacto_telefono_placeholder: "+57",
        contacto_email: "Correo Electrónico",
        contacto_email_placeholder: "tu@email.com",
        contacto_empresa: "Empresa (opcional)",
        contacto_empresa_placeholder: "Tu empresa",
        contacto_servicio: "Servicio de Interés",
        contacto_servicio_default: "Selecciona un servicio",
        contacto_consultoria: "Consultoría con Matías Whiat",
        contacto_otro: "Otro",
        contacto_mensaje: "Mensaje",
        contacto_mensaje_placeholder: "Escribe tu mensaje...",
        contacto_enviar: "Enviar Mensaje",
        login_subtitulo: "Accede a tu cuenta",
        login_password: "Contraseña",
        login_password_placeholder: "••••••••",
        login_recordarme: "Recordarme",
        login_olvidaste: "¿Olvidaste tu contraseña?",
        login_iniciar: "Iniciar Sesión",
        login_no_cuenta: "¿No tienes una cuenta?",
        login_registrate: "Regístrate aquí",
        footer_descripcion: "Impulsamos la evolución de los negocios hacia un futuro más digital.",
        footer_servicios: "Servicios",
        footer_enlaces: "Enlaces",
        footer_legal: "Legal",
        footer_privacidad: "Política de Privacidad",
        footer_terminos: "Términos de Servicio",
        footer_cookies: "Cookies",
        footer_copyright: "© 2024 Whiat Company - Todos los derechos reservados."
    },
    en: {
        titulo: "Whiat Company - Comprehensive Digital Solutions",
        whiat_company: "WHIAT COMPANY",
        nav_modelo: "Model",
        nav_servicios: "Services",
        nav_desarrollo_web: "Web Development",
        nav_aliados: "Partners",
        nav_perfil: "Profile",
        nav_contacto: "Contact",
        nav_python_ide: "Python IDE",
        nav_iniciar_sesion: "Login",
        hero_badge: "Comprehensive Digital Solutions | Strategic Partners",
        hero_titulo: "Boost your business with cutting-edge technology",
        hero_descripcion: "Experts in creating mobile apps, high-performance websites, cybersecurity, blockchain and custom digital solutions for small, medium and large companies.",
        hero_boton: "Tell us your idea",
        servicios_titulo: "Our Specialized Services",
        servicios_subtitulo: "Complete solutions for every digital need of your company.",
        servicio1_titulo: "Android & iOS Apps",
        servicio1_desc: "High-performance native and hybrid applications.",
        servicio1_item1: "Apps for shops and restaurants",
        servicio1_item2: "Delivery platforms",
        servicio1_item3: "Loyalty systems",
        servicio1_item4: "App Store & Play Store publication",
        servicio1_boton: "Quote App",
        servicio2_titulo: "Cybersecurity & Data Protection",
        servicio2_desc: "We protect your digital infrastructure against threats.",
        servicio2_item1: "Security audits and pentesting",
        servicio2_item2: "Firewall implementation",
        servicio2_item3: "Identity and access management",
        servicio2_item4: "Compliance (ISO 27001, GDPR)",
        servicio2_boton: "Protect my Company",
        servicio3_titulo: "Blockchain & Crypto Mining",
        servicio3_desc: "We develop blockchain solutions and mining advisory.",
        servicio3_item1: "Smart contract development",
        servicio3_item2: "Private network implementation",
        servicio3_item3: "Mining farm advisory",
        servicio3_item4: "Asset tokenization (NFTs, STOs)",
        servicio3_boton: "Explore Blockchain",
        servicio4_titulo: "IT Outsourcing & Brokerage",
        servicio4_desc: "Expand your team with expert programmers per project.",
        servicio4_item1: "Hourly or project-based hiring",
        servicio4_item2: "Full-stack developers",
        servicio4_item3: "Database specialists",
        servicio4_item4: "Payment management and KPIs",
        servicio4_boton: "Hire Talent",
        servicio5_titulo: "SME Support",
        servicio5_desc: "We manage and optimize your technological infrastructure.",
        servicio5_item1: "Server and network administration",
        servicio5_item2: "Remote technical support",
        servicio5_item3: "Equipment maintenance",
        servicio5_item4: "Digital transformation strategies",
        servicio5_boton: "Request Support",
        servicio6_titulo: "Websites & CMS",
        servicio6_desc: "We create stunning and easy-to-manage websites.",
        servicio6_item1: "Responsive UX/UI design",
        servicio6_item2: "E-commerce (online stores)",
        servicio6_item3: "Content management (WordPress, Strapi)",
        servicio6_item4: "SEO and speed optimization",
        servicio6_boton: "Create my Website",
        servicio7_titulo: "Maintenance & Updates",
        servicio7_desc: "We ensure your site is always updated and secure.",
        servicio7_item1: "Security updates",
        servicio7_item2: "Automatic backups",
        servicio7_item3: "24/7 monitoring",
        servicio7_item4: "Server migrations",
        servicio7_boton: "Maintain my Project",
        fullstack_titulo: "Fullstack Web Development",
        fullstack_subtitulo: "We build complete web applications.",
        fullstack_frontend: "Modern Frontend",
        fullstack_backend: "Robust Backend",
        fullstack_db: "Databases",
        fullstack_boton: "Request Custom Development",
        aliados_titulo: "Partners of the New Digital World",
        aliados_subtitulo: "We connect companies with the digital era.",
        aliados_emergentes: "For Emerging Companies",
        aliados_emergentes_desc: "We accompany startups and businesses in their early digital stages.",
        aliados_acreditadas: "For Established Companies",
        aliados_acreditadas_desc: "We modernize infrastructure and adopt new technologies.",
        perfil_titulo: "Professional Profile",
        perfil_subtitulo: "Meet the founder",
        perfil_ceo: "CEO & Founder",
        perfil_tag_fullstack: "Full-Stack Developer",
        perfil_tag_blockchain: "Blockchain Specialist",
        perfil_boton_web: "My Official Website",
        perfil_boton_whatsapp: "Immediate Inquiry",
        perfil_boton_email: "Direct Email",
        cta_titulo: "Ready to make the digital leap?",
        cta_descripcion: "Whether it's custom development, expanding your team with our freelancers, or securing your infrastructure, we're here to make it happen.",
        cta_boton: "Request a Free Consultation",
        test_titulo: "🔥 Test your Python skills",
        test_descripcion: "Think you master Python? Prove your knowledge with this interactive test.",
        test_tag1: "🐍 Basic syntax",
        test_tag2: "📝 Strings",
        test_tag3: "🧠 Logic",
        test_tag4: "⚡ Fast and fun",
        test_boton: "🎯 Test my level →",
        test_tag_tiempo: "⏱️ Less than 5 min",
        test_tag_python: "🐍 Python Challenge",
        ide_titulo: "Interactive Python IDE (Local)",
        ide_descripcion: "Write, run and test Python code directly in your browser. <strong>Compatible with input()</strong> and the entire standard library.",
        ide_boton_ejecutar: "Run code",
        ide_boton_limpiar: "Clear editor",
        ide_boton_restaurar: "Restore example",
        ide_cargando: "Loading Pyodide...",
        ide_stdin_label: "📥 Standard input (stdin) - simulates input()",
        ide_stdin_placeholder: "Write here the values that input() will take in order\nExample:\nJohn\n25",
        ide_stdin_ayuda: "Each line will be an answer for each input() in the order they appear.",
        ide_output_header: "🖥️ Output / Error",
        ide_inicializando: "⏳ Initializing Python environment (Pyodide)...",
        ide_espera: "This will take a few seconds the first time.",
        ide_footer: "🧠 Powered by <strong>Pyodide</strong> (Python in WebAssembly) - 100% local execution in your browser. Supports input(), print(), lists, loops, functions, etc.",
        contacto_titulo: "Contact",
        contacto_subtitulo: "Get in touch with us",
        contacto_nombre: "Full Name",
        contacto_nombre_placeholder: "Your name",
        contacto_telefono: "Phone (with country code)",
        contacto_telefono_placeholder: "+57",
        contacto_email: "Email",
        contacto_email_placeholder: "your@email.com",
        contacto_empresa: "Company (optional)",
        contacto_empresa_placeholder: "Your company",
        contacto_servicio: "Service of Interest",
        contacto_servicio_default: "Select a service",
        contacto_consultoria: "Consulting with Matías Whiat",
        contacto_otro: "Other",
        contacto_mensaje: "Message",
        contacto_mensaje_placeholder: "Write your message...",
        contacto_enviar: "Send Message",
        login_subtitulo: "Access your account",
        login_password: "Password",
        login_password_placeholder: "••••••••",
        login_recordarme: "Remember me",
        login_olvidaste: "Forgot your password?",
        login_iniciar: "Login",
        login_no_cuenta: "Don't have an account?",
        login_registrate: "Sign up here",
        footer_descripcion: "We drive business evolution towards a more digital future.",
        footer_servicios: "Services",
        footer_enlaces: "Links",
        footer_legal: "Legal",
        footer_privacidad: "Privacy Policy",
        footer_terminos: "Terms of Service",
        footer_cookies: "Cookies",
        footer_copyright: "© 2024 Whiat Company - All rights reserved."
    }
};

let currentLang = localStorage.getItem('whiat_lang') ||
    (navigator.language.startsWith('es') ? 'es' : 'en');

const DEFAULT_ES = `# 🔥 IDE Python con soporte para input()
# Escribe cualquier código Python estándar

nombre = input("¿Cómo te llamas? ")
edad = input("¿Cuántos años tienes? ")

print(f"\\n✨ Hola {nombre}, tienes {edad} años.")
print("Suma de 10 + 20 =", 10+20)

numeros = [1,2,3,4,5]
cuadrados = [n**2 for n in numeros]
print(f"\\nLista: {numeros}")
print(f"Cuadrados: {cuadrados}")

print("\\n✅ ¡Todo funciona perfectamente!")`;

const DEFAULT_EN = `# 🔥 Python IDE with input() support
# Write any standard Python code

name = input("What is your name? ")
age = input("How old are you? ")

print(f"\\n✨ Hello {name}, you are {age} years old.")
print("Sum of 10 + 20 =", 10+20)

numbers = [1,2,3,4,5]
squares = [n**2 for n in numbers]
print(f"\\nList: {numbers}")
print(f"Squares: {squares}")

print("\\n✅ Everything works perfectly!")`;

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('whiat_lang', lang);
    document.documentElement.lang = lang;

    const langText = document.getElementById('currentLangText');
    if (langText) langText.innerHTML = lang === 'es' ? '🌐 Español' : '🌐 English';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!translations[lang][key]) return;
        const tag = el.tagName;
        if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.hasAttribute('data-i18n-placeholder')) return;
        el.innerHTML = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    const serviceSelect = document.getElementById('serviceSelect');
    if (serviceSelect) {
        const map = {
            '': 'contacto_servicio_default',
            'outsourcing': 'servicio4_titulo',
            'app-movil': 'servicio1_titulo',
            'ciberseguridad': 'servicio2_titulo',
            'blockchain': 'servicio3_titulo',
            'soporte-pyme': 'servicio5_titulo',
            'fullstack': 'fullstack_titulo',
            'web-basico': 'servicio6_titulo',
            'mantenimiento': 'servicio7_titulo',
            'consulting': 'contacto_consultoria',
            'other': 'contacto_otro'
        };
        Array.from(serviceSelect.options).forEach(opt => {
            const key = map[opt.value];
            if (key && translations[lang][key]) opt.textContent = translations[lang][key];
        });
    }

    const codeEditor = document.getElementById('pythonCodeEditor');
    if (codeEditor) {
        const cur = codeEditor.value.trim();
        if (cur === DEFAULT_ES.trim() || cur === DEFAULT_EN.trim() || cur === '') {
            codeEditor.value = lang === 'es' ? DEFAULT_ES : DEFAULT_EN;
        }
    }

    const stdinArea = document.getElementById('pythonStdin');
    if (stdinArea) {
        if (stdinArea.value === "Juan\n25" || stdinArea.value === "John\n25") {
            stdinArea.value = lang === 'es' ? "Juan\n25" : "John\n25";
        }
        stdinArea.placeholder = translations[lang].ide_stdin_placeholder;
    }

    document.title = translations[lang].titulo;

    document.querySelectorAll('.floating-lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
}

function initLanguageSwitcher() {
    const toggleBtn = document.getElementById('floatingLanguageToggle');
    const dropdown  = document.getElementById('floatingLanguageDropdown');
    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => dropdown.classList.remove('show'));

    document.querySelectorAll('.floating-lang-option').forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang');
            if (lang) setLanguage(lang);
            dropdown.classList.remove('show');
        });
    });

    setLanguage(currentLang);
}

// =====================================================================
// 5. PARTÍCULAS
// =====================================================================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00d4ff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#00d4ff', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            }
        }
    });
}

// =====================================================================
// 6. FIX AVATAR (con fallback SVG garantizado)
// =====================================================================
(function fixProfileImage() {
    const img = document.getElementById('profileAvatar');
    if (!img) return;

    const fallbackSVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%2300d4ff'/><text x='50' y='70' font-size='40' text-anchor='middle' fill='white'>MW</text></svg>";

    const paths = [
        "MEDIA/BCHINO.jpeg",
        "MEDIA/BCHINO.jpg",
        "MEDIA/bchino.jpeg",
        "MEDIA/bchino.jpg",
        "./MEDIA/BCHINO.jpeg",
        "./MEDIA/BCHINO.jpg"
    ];
    let i = 0;

    img.onerror = function () {
        if (img.dataset.fixing === 'true') return;
        img.dataset.fixing = 'true';

        function tryNext() {
            if (i >= paths.length) {
                // ✅ ÚLTIMO RECURSO garantizado
                img.onerror = null;
                img.src = fallbackSVG;
                return;
            }
            const test = new Image();
            test.onload = () => {
                img.onerror = null;
                img.src = paths[i];
            };
            test.onerror = () => { i++; tryNext(); };
            test.src = paths[i];
        }
        tryNext();
    };
})();

// =====================================================================
// 7. PYTHON IDE (Pyodide)
// =====================================================================
(function initPythonIDE() {
    let pyodideReady = false;
    let pyodide = null;

    const runBtn     = document.getElementById('runPythonBtn');
    const clearBtn   = document.getElementById('clearEditorBtn');
    const resetBtn   = document.getElementById('resetExampleBtn');
    const codeEditor = document.getElementById('pythonCodeEditor');
    const stdinArea  = document.getElementById('pythonStdin');
    const outputPre  = document.getElementById('pythonOutput');
    const statusSpan = document.getElementById('pyodideStatus');

    if (!runBtn || !codeEditor) return;

    let outputBuffer = "";

    function escapeHtml(str) {
        return String(str).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
    }
    function setOutput(text, isError = false) {
        outputPre.innerHTML = isError
            ? `<span style="color:#ff9a9a;">${escapeHtml(text)}</span>`
            : escapeHtml(text);
        outputPre.scrollTop = outputPre.scrollHeight;
    }
    function appendOutput(text) {
        outputBuffer += text;
        setOutput(outputBuffer);
    }
    function clearOutput() {
        outputBuffer = "";
        setOutput("");
    }
    window.appendOutput = appendOutput;

    function setupPythonEnvironment() {
        pyodide.runPython(`
import sys
from io import StringIO

class TeeOutput:
    def __init__(self, original, is_error=False):
        self.original = original
        self.is_error = is_error
        self.buffer = StringIO()
    def write(self, data):
        self.buffer.write(data)
        if self.original:
            self.original.write(data)
    def flush(self):
        if self.original:
            self.original.flush()
        content = self.buffer.getvalue()
        if content:
            import js
            js.appendOutput(content)
            self.buffer.truncate(0)
            self.buffer.seek(0)

sys.stdout = TeeOutput(sys.stdout, False)
sys.stderr = TeeOutput(sys.stderr, True)
        `);

        pyodide.runPython(`
import builtins, sys, js
_input_lines = []
_input_idx = 0

def get_stdin_line():
    global _input_lines, _input_idx
    if _input_idx >= len(_input_lines):
        raw = js.document.getElementById('pythonStdin').value
        _input_lines = raw.split('\\n')
        _input_idx = 0
    if _input_idx < len(_input_lines):
        line = _input_lines[_input_idx]
        _input_idx += 1
        return line
    return ""

def custom_input(prompt=''):
    if prompt:
        sys.stdout.write(prompt)
        sys.stdout.flush()
    line = get_stdin_line()
    if line is None:
        raise EOFError("No more input")
    return line

builtins.input = custom_input
        `);
    }

    function resetInputIndex() {
        if (!pyodideReady) return;
        pyodide.runPython(`
import js
_input_lines = []
_input_idx = 0
raw = js.document.getElementById('pythonStdin').value
_input_lines = raw.split('\\n')
_input_idx = 0
        `);
    }

    async function runPythonCode() {
        if (!pyodideReady) {
            setOutput("⏳ Python environment not ready yet.", true);
            return;
        }
        const code = codeEditor.value;
        if (code.trim() === "") {
            setOutput("⚠️ No code to run.", false);
            return;
        }
        clearOutput();
        resetInputIndex();
        setOutput("▶️ Running...\n", false);
        try {
            await pyodide.runPythonAsync(code);
            if (outputBuffer === "") {
                setOutput("✅ Code executed successfully (no printed output).");
            }
        } catch (err) {
            appendOutput(`\n❌ Error: ${err.message || err}\n`);
        }
    }

    function clearEditor() {
        codeEditor.value = "";
        clearOutput();
        setOutput("🧹 Editor cleared. Write your code and press 'Run'.", false);
    }

    function resetExample() {
        codeEditor.value = currentLang === 'es' ? DEFAULT_ES : DEFAULT_EN;
        stdinArea.value = currentLang === 'es' ? "Juan\n25" : "John\n25";
        clearOutput();
        setOutput(currentLang === 'es'
            ? "📘 Ejemplo restaurado. Presiona 'Ejecutar' para probarlo."
            : "📘 Example restored. Press 'Run' to test it.", false);
        resetInputIndex();
    }

    async function loadPyodideAndInit() {
        setOutput(currentLang === 'es'
            ? "📦 Cargando Pyodide (Python en WebAssembly). Esto puede tardar unos segundos la primera vez..."
            : "📦 Loading Pyodide (Python in WebAssembly). This may take a few seconds the first time...", false);
        statusSpan.innerHTML = `<span>${currentLang === 'es' ? '⏳ Cargando Pyodide...' : '⏳ Loading Pyodide...'}</span>`;

        try {
            pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
            });
            pyodideReady = true;
            setupPythonEnvironment();
            runBtn.disabled = false;
            statusSpan.innerHTML = currentLang === 'es' ? "✅ Python listo" : "✅ Python ready";
            setOutput(currentLang === 'es'
                ? "✅ Entorno Python listo. Escribe tu código y presiona 'Ejecutar código' o Ctrl+Enter.\n\n💡 Tip: Puedes usar input() y los valores se tomarán del área 'Entrada estándar'."
                : "✅ Python environment ready. Write your code and press 'Run code' or Ctrl+Enter.\n\n💡 Tip: You can use input() and values will be taken from the 'Standard input' area.", false);
        } catch (err) {
            console.error(err);
            setOutput(`❌ Error cargando Pyodide: ${err.message}\nVerifica tu conexión.`, true);
            statusSpan.innerHTML = currentLang === 'es' ? "❌ Error de carga" : "❌ Load error";
            runBtn.disabled = true;
        }
    }

    runBtn.addEventListener('click', runPythonCode);
    clearBtn.addEventListener('click', clearEditor);
    resetBtn.addEventListener('click', resetExample);
    codeEditor.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runPythonCode();
        }
    });

    loadPyodideAndInit();
})();

// =====================================================================
// 8. LOGIN
// =====================================================================
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    if (email && password) {
        alert(currentLang === 'es'
            ? "Funcionalidad de login en desarrollo. Por favor contacta al administrador."
            : "Login functionality under development. Please contact the administrator.");
    } else {
        alert(currentLang === 'es'
            ? "Por favor ingresa correo y contraseña."
            : "Please enter email and password.");
    }
}
window.handleLogin = handleLogin;

// =====================================================================
// 9. NAVEGACIÓN SUAVE
// =====================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================================
// 10. ANIMACIONES AL SCROLL
// =====================================================================
(function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.model-card, .service-card, .allies-card, .profile-card, .fullstack-card, .python-test-card'
    );
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
})();

// =====================================================================
// 11. INICIALIZACIÓN FINAL
// =====================================================================
document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitcher();
});