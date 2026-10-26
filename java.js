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
        img.onerror = null;
        img.src = kind === 'avatar' ? SVG_AVATAR : SVG_LOGO;
    }

    function scanAll() {
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            if (img.complete && img.naturalWidth === 0) applyFallback(img);
            img.addEventListener('error', () => applyFallback(img));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAll);
    } else {
        scanAll();
    }

    if ('MutationObserver' in window) {
        new MutationObserver(scanAll).observe(document.body, { childList: true, subtree: true });
    }
})();

// =====================================================================
// 1. FACTORY DE METEOROS (reutilizable — usada en la página)
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
// 2. PRELOADER — 4 segundos (SIN meteoros)
// =====================================================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const BUILD_TIME = 3200;
    const FADE_TIME  = 800;

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
// 4. SISTEMA DE IDIOMAS (i18n) — GLOBAL
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
    },
    de: {
        titulo: "Whiat Company - Umfassende digitale Lösungen",
        whiat_company: "WHIAT COMPANY",
        nav_modelo: "Modell",
        nav_servicios: "Dienstleistungen",
        nav_desarrollo_web: "Webentwicklung",
        nav_aliados: "Partner",
        nav_perfil: "Profil",
        nav_contacto: "Kontakt",
        nav_python_ide: "Python IDE",
        nav_iniciar_sesion: "Anmelden",
        hero_badge: "Umfassende digitale Lösungen | Strategische Partner",
        hero_titulo: "Steigern Sie Ihr Geschäft mit Spitzentechnologie",
        hero_descripcion: "Experten für die Erstellung von mobilen Apps, Hochleistungs-Websites, Cybersicherheit, Blockchain und maßgeschneiderten digitalen Lösungen für kleine, mittlere und große Unternehmen.",
        hero_boton: "Erzählen Sie uns Ihre Idee",
        servicios_titulo: "Unsere spezialisierten Dienstleistungen",
        servicios_subtitulo: "Komplettlösungen für jede digitale Anforderung Ihres Unternehmens.",
        servicio1_titulo: "Android & iOS Apps",
        servicio1_desc: "Leistungsstarke native und hybride Anwendungen.",
        servicio1_item1: "Apps für Geschäfte und Restaurants",
        servicio1_item2: "Lieferplattformen",
        servicio1_item3: "Treuesysteme",
        servicio1_item4: "Veröffentlichung im App Store und Play Store",
        servicio1_boton: "App anfragen",
        servicio2_titulo: "Cybersicherheit & Datenschutz",
        servicio2_desc: "Wir schützen Ihre digitale Infrastruktur vor Bedrohungen.",
        servicio2_item1: "Sicherheitsaudits und Pentesting",
        servicio2_item2: "Firewall-Implementierung",
        servicio2_item3: "Identitäts- und Zugriffsverwaltung",
        servicio2_item4: "Compliance (ISO 27001, DSGVO)",
        servicio2_boton: "Mein Unternehmen schützen",
        servicio3_titulo: "Blockchain & Krypto-Mining",
        servicio3_desc: "Wir entwickeln Blockchain-Lösungen und Mining-Beratung.",
        servicio3_item1: "Entwicklung von Smart Contracts",
        servicio3_item2: "Implementierung privater Netzwerke",
        servicio3_item3: "Beratung zu Mining-Farmen",
        servicio3_item4: "Tokenisierung von Vermögenswerten (NFTs, STOs)",
        servicio3_boton: "Blockchain erkunden",
        servicio4_titulo: "IT-Outsourcing & Vermittlung",
        servicio4_desc: "Erweitern Sie Ihr Team mit erfahrenen Programmierern pro Projekt.",
        servicio4_item1: "Stunden- oder projektbasierte Einstellung",
        servicio4_item2: "Full-Stack-Entwickler",
        servicio4_item3: "Datenbank-Spezialisten",
        servicio4_item4: "Zahlungsverwaltung und KPIs",
        servicio4_boton: "Talente einstellen",
        servicio5_titulo: "KMU-Unterstützung",
        servicio5_desc: "Wir verwalten und optimieren Ihre technologische Infrastruktur.",
        servicio5_item1: "Server- und Netzwerkverwaltung",
        servicio5_item2: "Remote-Techniksupport",
        servicio5_item3: "Gerätewartung",
        servicio5_item4: "Strategien zur digitalen Transformation",
        servicio5_boton: "Support anfordern",
        servicio6_titulo: "Websites & CMS",
        servicio6_desc: "Wir erstellen beeindruckende und einfach zu verwaltende Websites.",
        servicio6_item1: "Responsives UX/UI-Design",
        servicio6_item2: "E-Commerce (Online-Shops)",
        servicio6_item3: "Content-Management (WordPress, Strapi)",
        servicio6_item4: "SEO- und Geschwindigkeitsoptimierung",
        servicio6_boton: "Meine Website erstellen",
        servicio7_titulo: "Wartung & Updates",
        servicio7_desc: "Wir sorgen dafür, dass Ihre Website immer aktuell und sicher ist.",
        servicio7_item1: "Sicherheitsupdates",
        servicio7_item2: "Automatische Backups",
        servicio7_item3: "24/7-Überwachung",
        servicio7_item4: "Servermigrationen",
        servicio7_boton: "Mein Projekt warten",
        fullstack_titulo: "Fullstack-Webentwicklung",
        fullstack_subtitulo: "Wir erstellen komplette Webanwendungen.",
        fullstack_frontend: "Modernes Frontend",
        fullstack_backend: "Robustes Backend",
        fullstack_db: "Datenbanken",
        fullstack_boton: "Individuelle Entwicklung anfragen",
        aliados_titulo: "Partner der neuen digitalen Welt",
        aliados_subtitulo: "Wir verbinden Unternehmen mit dem digitalen Zeitalter.",
        aliados_emergentes: "Für aufstrebende Unternehmen",
        aliados_emergentes_desc: "Wir begleiten Start-ups und Unternehmen in ihren frühen digitalen Phasen.",
        aliados_acreditadas: "Für etablierte Unternehmen",
        aliados_acreditadas_desc: "Wir modernisieren die Infrastruktur und führen neue Technologien ein.",
        perfil_titulo: "Professionelles Profil",
        perfil_subtitulo: "Lernen Sie den Gründer kennen",
        perfil_ceo: "CEO & Gründer",
        perfil_tag_fullstack: "Full-Stack-Entwickler",
        perfil_tag_blockchain: "Blockchain-Spezialist",
        perfil_boton_web: "Meine offizielle Website",
        perfil_boton_whatsapp: "Sofortige Anfrage",
        perfil_boton_email: "Direkte E-Mail",
        cta_titulo: "Bereit für den digitalen Sprung?",
        cta_descripcion: "Ob maßgeschneiderte Entwicklung, Erweiterung Ihres Teams mit unseren Freelancern oder Sicherung Ihrer Infrastruktur – wir sind hier, um es möglich zu machen.",
        cta_boton: "Kostenlose Beratung anfordern",
        test_titulo: "🔥 Testen Sie Ihre Python-Kenntnisse",
        test_descripcion: "Glauben Sie, Sie beherrschen Python? Beweisen Sie Ihr Wissen mit diesem interaktiven Test.",
        test_tag1: "🐍 Grundlegende Syntax",
        test_tag2: "📝 Strings",
        test_tag3: "🧠 Logik",
        test_tag4: "⚡ Schnell und unterhaltsam",
        test_boton: "🎯 Mein Niveau testen →",
        test_tag_tiempo: "⏱️ Weniger als 5 Min",
        test_tag_python: "🐍 Python Challenge",
        ide_titulo: "Interaktive Python IDE (Lokal)",
        ide_descripcion: "Schreiben, ausführen und testen Sie Python-Code direkt in Ihrem Browser. <strong>Kompatibel mit input()</strong> und der gesamten Standardbibliothek.",
        ide_boton_ejecutar: "Code ausführen",
        ide_boton_limpiar: "Editor leeren",
        ide_boton_restaurar: "Beispiel wiederherstellen",
        ide_cargando: "Pyodide wird geladen...",
        ide_stdin_label: "📥 Standardeingabe (stdin) - simuliert input()",
        ide_stdin_placeholder: "Schreiben Sie hier die Werte, die input() der Reihe nach annimmt\nBeispiel:\nJohn\n25",
        ide_stdin_ayuda: "Jede Zeile ist eine Antwort für jedes input() in der Reihenfolge ihres Auftretens.",
        ide_output_header: "🖥️ Ausgabe / Fehler",
        ide_inicializando: "⏳ Python-Umgebung wird initialisiert (Pyodide)...",
        ide_espera: "Dies dauert beim ersten Mal einige Sekunden.",
        ide_footer: "🧠 Powered by <strong>Pyodide</strong> (Python in WebAssembly) - 100% lokale Ausführung in Ihrem Browser. Unterstützt input(), print(), Listen, Schleifen, Funktionen usw.",
        contacto_titulo: "Kontakt",
        contacto_subtitulo: "Nehmen Sie Kontakt mit uns auf",
        contacto_nombre: "Vollständiger Name",
        contacto_nombre_placeholder: "Ihr Name",
        contacto_telefono: "Telefon (mit Ländercode)",
        contacto_telefono_placeholder: "+49",
        contacto_email: "E-Mail",
        contacto_email_placeholder: "ihre@email.com",
        contacto_empresa: "Unternehmen (optional)",
        contacto_empresa_placeholder: "Ihr Unternehmen",
        contacto_servicio: "Dienstleistung von Interesse",
        contacto_servicio_default: "Wählen Sie eine Dienstleistung",
        contacto_consultoria: "Beratung mit Matías Whiat",
        contacto_otro: "Andere",
        contacto_mensaje: "Nachricht",
        contacto_mensaje_placeholder: "Schreiben Sie Ihre Nachricht...",
        contacto_enviar: "Nachricht senden",
        login_subtitulo: "Greifen Sie auf Ihr Konto zu",
        login_password: "Passwort",
        login_password_placeholder: "••••••••",
        login_recordarme: "Angemeldet bleiben",
        login_olvidaste: "Passwort vergessen?",
        login_iniciar: "Anmelden",
        login_no_cuenta: "Sie haben noch kein Konto?",
        login_registrate: "Hier registrieren",
        footer_descripcion: "Wir treiben die Evolution der Unternehmen zu einer digitaleren Zukunft voran.",
        footer_servicios: "Dienstleistungen",
        footer_enlaces: "Links",
        footer_legal: "Rechtliches",
        footer_privacidad: "Datenschutzrichtlinie",
        footer_terminos: "Nutzungsbedingungen",
        footer_cookies: "Cookies",
        footer_copyright: "© 2024 Whiat Company - Alle Rechte vorbehalten."
    },
    zh: {
        titulo: "Whiat Company - 综合数字解决方案",
        whiat_company: "WHIAT COMPANY",
        nav_modelo: "模型",
        nav_servicios: "服务",
        nav_desarrollo_web: "网站开发",
        nav_aliados: "合作伙伴",
        nav_perfil: "个人资料",
        nav_contacto: "联系方式",
        nav_python_ide: "Python IDE",
        nav_iniciar_sesion: "登录",
        hero_badge: "综合数字解决方案 | 战略合作伙伴",
        hero_titulo: "用尖端技术推动您的业务发展",
        hero_descripcion: "专注于为中小型和大型企业创建移动应用、高性能网站、网络安全、区块链和定制数字解决方案的专家。",
        hero_boton: "告诉我们您的想法",
        servicios_titulo: "我们的专业服务",
        servicios_subtitulo: "为您的企业的每个数字需求提供完整的解决方案。",
        servicio1_titulo: "Android 和 iOS 应用",
        servicio1_desc: "高性能的原生和混合应用程序。",
        servicio1_item1: "商店和餐厅应用",
        servicio1_item2: "配送平台",
        servicio1_item3: "忠诚度系统",
        servicio1_item4: "在 App Store 和 Play Store 发布",
        servicio1_boton: "获取应用报价",
        servicio2_titulo: "网络安全与数据保护",
        servicio2_desc: "我们保护您的数字基础设施免受威胁。",
        servicio2_item1: "安全审计和渗透测试",
        servicio2_item2: "防火墙实施",
        servicio2_item3: "身份和访问管理",
        servicio2_item4: "合规性 (ISO 27001, GDPR)",
        servicio2_boton: "保护我的公司",
        servicio3_titulo: "区块链与加密挖矿",
        servicio3_desc: "我们开发基于区块链的解决方案并提供挖矿咨询。",
        servicio3_item1: "智能合约开发",
        servicio3_item2: "私有网络实施",
        servicio3_item3: "矿场咨询",
        servicio3_item4: "资产代币化 (NFTs, STOs)",
        servicio3_boton: "探索区块链",
        servicio4_titulo: "IT 外包与经纪",
        servicio4_desc: "按项目为您的团队增加专家程序员。",
        servicio4_item1: "按小时或项目聘用",
        servicio4_item2: "全栈开发人员",
        servicio4_item3: "数据库专家",
        servicio4_item4: "支付管理和 KPI",
        servicio4_boton: "雇佣人才",
        servicio5_titulo: "中小企业支持",
        servicio5_desc: "我们管理和优化您的技术基础设施。",
        servicio5_item1: "服务器和网络管理",
        servicio5_item2: "远程技术支持",
        servicio5_item3: "设备维护",
        servicio5_item4: "数字化转型战略",
        servicio5_boton: "请求支持",
        servicio6_titulo: "网站与 CMS",
        servicio6_desc: "我们创建令人印象深刻且易于管理的网站。",
        servicio6_item1: "响应式 UX/UI 设计",
        servicio6_item2: "电子商务 (在线商店)",
        servicio6_item3: "内容管理 (WordPress, Strapi)",
        servicio6_item4: "SEO 和速度优化",
        servicio6_boton: "创建我的网站",
        servicio7_titulo: "维护与更新",
        servicio7_desc: "我们确保您的网站始终是最新且安全的。",
        servicio7_item1: "安全更新",
        servicio7_item2: "自动备份",
        servicio7_item3: "24/7 监控",
        servicio7_item4: "服务器迁移",
        servicio7_boton: "维护我的项目",
        fullstack_titulo: "全栈 Web 开发",
        fullstack_subtitulo: "我们构建完整的 Web 应用程序。",
        fullstack_frontend: "现代前端",
        fullstack_backend: "强大的后端",
        fullstack_db: "数据库",
        fullstack_boton: "请求定制开发",
        aliados_titulo: "新数字世界的合作伙伴",
        aliados_subtitulo: "我们将企业与数字时代连接起来。",
        aliados_emergentes: "对于新兴公司",
        aliados_emergentes_desc: "我们在初创企业和企业的早期数字阶段陪伴他们。",
        aliados_acreditadas: "对于老牌公司",
        aliados_acreditadas_desc: "我们现代化基础设施并采用新技术。",
        perfil_titulo: "专业简介",
        perfil_subtitulo: "认识创始人",
        perfil_ceo: "CEO 兼创始人",
        perfil_tag_fullstack: "全栈开发人员",
        perfil_tag_blockchain: "区块链专家",
        perfil_boton_web: "我的官方网站",
        perfil_boton_whatsapp: "立即咨询",
        perfil_boton_email: "直接电邮",
        cta_titulo: "准备好实现数字飞跃了吗？",
        cta_descripcion: "无论是定制开发、用我们的自由职业者扩展您的团队，还是保护您的基础设施，我们都随时为您实现。",
        cta_boton: "请求免费咨询",
        test_titulo: "🔥 测试你的 Python 技能",
        test_descripcion: "认为你精通 Python？用这个互动测试来证明你的知识。",
        test_tag1: "🐍 基础语法",
        test_tag2: "📝 字符串",
        test_tag3: "🧠 逻辑",
        test_tag4: "⚡ 快速有趣",
        test_boton: "🎯 测试我的水平 →",
        test_tag_tiempo: "⏱️ 少于 5 分钟",
        test_tag_python: "🐍 Python 挑战",
        ide_titulo: "交互式 Python IDE (本地)",
        ide_descripcion: "直接在浏览器中编写、运行和测试 Python 代码。<strong>兼容 input()</strong> 和整个标准库。",
        ide_boton_ejecutar: "运行代码",
        ide_boton_limpiar: "清空编辑器",
        ide_boton_restaurar: "恢复示例",
        ide_cargando: "正在加载 Pyodide...",
        ide_stdin_label: "📥 标准输入 (stdin) - 模拟 input()",
        ide_stdin_placeholder: "在此处按顺序输入 input() 将接收的值\n示例：\nJohn\n25",
        ide_stdin_ayuda: "每行将按出现的顺序作为每个 input() 的答案。",
        ide_output_header: "🖥️ 输出 / 错误",
        ide_inicializando: "⏳ 正在初始化 Python 环境 (Pyodide)...",
        ide_espera: "第一次可能需要几秒钟。",
        ide_footer: "🧠 由 <strong>Pyodide</strong> (WebAssembly 中的 Python) 提供支持 - 在您的浏览器中 100% 本地执行。支持 input()、print()、列表、循环、函数等。",
        contacto_titulo: "联系方式",
        contacto_subtitulo: "与我们联系",
        contacto_nombre: "全名",
        contacto_nombre_placeholder: "您的名字",
        contacto_telefono: "电话 (含国家代码)",
        contacto_telefono_placeholder: "+86",
        contacto_email: "电子邮件",
        contacto_email_placeholder: "your@email.com",
        contacto_empresa: "公司 (可选)",
        contacto_empresa_placeholder: "您的公司",
        contacto_servicio: "感兴趣的服务",
        contacto_servicio_default: "选择一项服务",
        contacto_consultoria: "与 Matías Whiat 咨询",
        contacto_otro: "其他",
        contacto_mensaje: "留言",
        contacto_mensaje_placeholder: "写下您的留言...",
        contacto_enviar: "发送留言",
        login_subtitulo: "访问您的帐户",
        login_password: "密码",
        login_password_placeholder: "••••••••",
        login_recordarme: "记住我",
        login_olvidaste: "忘记密码？",
        login_iniciar: "登录",
        login_no_cuenta: "还没有帐户？",
        login_registrate: "在此注册",
        footer_descripcion: "我们推动企业向更加数字化的未来发展。",
        footer_servicios: "服务",
        footer_enlaces: "链接",
        footer_legal: "法律",
        footer_privacidad: "隐私政策",
        footer_terminos: "服务条款",
        footer_cookies: "Cookies",
        footer_copyright: "© 2024 Whiat Company - 版权所有。"
    },
    ru: {
        titulo: "Whiat Company - Комплексные цифровые решения",
        whiat_company: "WHIAT COMPANY",
        nav_modelo: "Модель",
        nav_servicios: "Услуги",
        nav_desarrollo_web: "Веб-разработка",
        nav_aliados: "Партнеры",
        nav_perfil: "Профиль",
        nav_contacto: "Контакты",
        nav_python_ide: "Python IDE",
        nav_iniciar_sesion: "Войти",
        hero_badge: "Комплексные цифровые решения | Стратегические партнеры",
        hero_titulo: "Развивайте свой бизнес с помощью передовых технологий",
        hero_descripcion: "Эксперты по созданию мобильных приложений, высокопроизводительных веб-сайтов, кибербезопасности, блокчейна и индивидуальных цифровых решений для малых, средних и крупных компаний.",
        hero_boton: "Расскажите нам свою идею",
        servicios_titulo: "Наши специализированные услуги",
        servicios_subtitulo: "Комплексные решения для любых цифровых потребностей вашей компании.",
        servicio1_titulo: "Приложения для Android и iOS",
        servicio1_desc: "Высокопроизводительные нативные и гибридные приложения.",
        servicio1_item1: "Приложения для магазинов и ресторанов",
        servicio1_item2: "Платформы доставки",
        servicio1_item3: "Системы лояльности",
        servicio1_item4: "Публикация в App Store и Play Store",
        servicio1_boton: "Заказать приложение",
        servicio2_titulo: "Кибербезопасность и защита данных",
        servicio2_desc: "Мы защищаем вашу цифровую инфраструктуру от угроз.",
        servicio2_item1: "Аудит безопасности и пентестинг",
        servicio2_item2: "Внедрение межсетевых экранов",
        servicio2_item3: "Управление идентификацией и доступом",
        servicio2_item4: "Соответствие требованиям (ISO 27001, GDPR)",
        servicio2_boton: "Защитить мою компанию",
        servicio3_titulo: "Блокчейн и майнинг криптовалют",
        servicio3_desc: "Мы разрабатываем блокчейн-решения и консультируем по майнингу.",
        servicio3_item1: "Разработка смарт-контрактов",
        servicio3_item2: "Внедрение частных сетей",
        servicio3_item3: "Консультации по майнинг-фермам",
        servicio3_item4: "Токенизация активов (NFT, STO)",
        servicio3_boton: "Исследовать блокчейн",
        servicio4_titulo: "ИТ-аутсорсинг и брокерство",
        servicio4_desc: "Расширьте свою команду опытными программистами на проект.",
        servicio4_item1: "Почасовая или проектная занятость",
        servicio4_item2: "Full-stack разработчики",
        servicio4_item3: "Специалисты по базам данных",
        servicio4_item4: "Управление платежами и KPI",
        servicio4_boton: "Нанять таланты",
        servicio5_titulo: "Поддержка МСП",
        servicio5_desc: "Мы управляем и оптимизируем вашу технологическую инфраструктуру.",
        servicio5_item1: "Администрирование серверов и сетей",
        servicio5_item2: "Удаленная техническая поддержка",
        servicio5_item3: "Обслуживание оборудования",
        servicio5_item4: "Стратегии цифровой трансформации",
        servicio5_boton: "Запросить поддержку",
        servicio6_titulo: "Веб-сайты и CMS",
        servicio6_desc: "Мы создаем потрясающие и простые в управлении веб-сайты.",
        servicio6_item1: "Адаптивный UX/UI дизайн",
        servicio6_item2: "Электронная коммерция (интернет-магазины)",
        servicio6_item3: "Управление контентом (WordPress, Strapi)",
        servicio6_item4: "SEO и оптимизация скорости",
        servicio6_boton: "Создать мой сайт",
        servicio7_titulo: "Обслуживание и обновления",
        servicio7_desc: "Мы гарантируем, что ваш сайт всегда будет актуальным и безопасным.",
        servicio7_item1: "Обновления безопасности",
        servicio7_item2: "Автоматическое резервное копирование",
        servicio7_item3: "Мониторинг 24/7",
        servicio7_item4: "Миграция серверов",
        servicio7_boton: "Обслуживать мой проект",
        fullstack_titulo: "Fullstack веб-разработка",
        fullstack_subtitulo: "Мы создаем полноценные веб-приложения.",
        fullstack_frontend: "Современный фронтенд",
        fullstack_backend: "Надежный бэкенд",
        fullstack_db: "Базы данных",
        fullstack_boton: "Запросить индивидуальную разработку",
        aliados_titulo: "Партнеры нового цифрового мира",
        aliados_subtitulo: "Мы соединяем компании с цифровой эрой.",
        aliados_emergentes: "Для новых компаний",
        aliados_emergentes_desc: "Мы сопровождаем стартапы и бизнесы на ранних цифровых этапах.",
        aliados_acreditadas: "Для проверенных компаний",
        aliados_acreditadas_desc: "Мы модернизируем инфраструктуру и внедряем новые технологии.",
        perfil_titulo: "Профессиональный профиль",
        perfil_subtitulo: "Познакомьтесь с основателем",
        perfil_ceo: "Генеральный директор и основатель",
        perfil_tag_fullstack: "Full-Stack разработчик",
        perfil_tag_blockchain: "Специалист по блокчейну",
        perfil_boton_web: "Мой официальный сайт",
        perfil_boton_whatsapp: "Немедленный запрос",
        perfil_boton_email: "Прямая почта",
        cta_titulo: "Готовы к цифровому прыжку?",
        cta_descripcion: "Будь то индивидуальная разработка, расширение вашей команды нашими фрилансерами или обеспечение безопасности вашей инфраструктуры, мы здесь, чтобы это произошло.",
        cta_boton: "Запросить бесплатную консультацию",
        test_titulo: "🔥 Проверьте свои навыки Python",
        test_descripcion: "Думаете, вы владеете Python? Докажите свои знания с помощью этого интерактивного теста.",
        test_tag1: "🐍 Базовый синтаксис",
        test_tag2: "📝 Строки",
        test_tag3: "🧠 Логика",
        test_tag4: "⚡ Быстро и весело",
        test_boton: "🎯 Проверить мой уровень →",
        test_tag_tiempo: "⏱️ Менее 5 минут",
        test_tag_python: "🐍 Python Challenge",
        ide_titulo: "Интерактивная Python IDE (локальная)",
        ide_descripcion: "Пишите, запускайте и тестируйте код Python прямо в браузере. <strong>Совместимо с input()</strong> и всей стандартной библиотекой.",
        ide_boton_ejecutar: "Запустить код",
        ide_boton_limpiar: "Очистить редактор",
        ide_boton_restaurar: "Восстановить пример",
        ide_cargando: "Загрузка Pyodide...",
        ide_stdin_label: "📥 Стандартный ввод (stdin) - имитирует input()",
        ide_stdin_placeholder: "Введите здесь значения, которые будет принимать input() по порядку\nПример:\nJohn\n25",
        ide_stdin_ayuda: "Каждая строка будет ответом для каждого input() в порядке их появления.",
        ide_output_header: "🖥️ Вывод / Ошибка",
        ide_inicializando: "⏳ Инициализация среды Python (Pyodide)...",
        ide_espera: "Это займет несколько секунд в первый раз.",
        ide_footer: "🧠 Работает на <strong>Pyodide</strong> (Python в WebAssembly) - 100% локальное выполнение в вашем браузере. Поддерживает input(), print(), списки, циклы, функции и т.д.",
        contacto_titulo: "Контакты",
        contacto_subtitulo: "Свяжитесь с нами",
        contacto_nombre: "Полное имя",
        contacto_nombre_placeholder: "Ваше имя",
        contacto_telefono: "Телефон (с кодом страны)",
        contacto_telefono_placeholder: "+7",
        contacto_email: "Электронная почта",
        contacto_email_placeholder: "your@email.com",
        contacto_empresa: "Компания (необязательно)",
        contacto_empresa_placeholder: "Ваша компания",
        contacto_servicio: "Интересующая услуга",
        contacto_servicio_default: "Выберите услугу",
        contacto_consultoria: "Консультация с Matías Whiat",
        contacto_otro: "Другое",
        contacto_mensaje: "Сообщение",
        contacto_mensaje_placeholder: "Напишите ваше сообщение...",
        contacto_enviar: "Отправить сообщение",
        login_subtitulo: "Доступ к вашему аккаунту",
        login_password: "Пароль",
        login_password_placeholder: "••••••••",
        login_recordarme: "Запомнить меня",
        login_olvidaste: "Забыли пароль?",
        login_iniciar: "Войти",
        login_no_cuenta: "Нет аккаунта?",
        login_registrate: "Зарегистрируйтесь здесь",
        footer_descripcion: "Мы стимулируем развитие бизнеса к более цифровому будущему.",
        footer_servicios: "Услуги",
        footer_enlaces: "Ссылки",
        footer_legal: "Правовая информация",
        footer_privacidad: "Политика конфиденциальности",
        footer_terminos: "Условия обслуживания",
        footer_cookies: "Cookies",
        footer_copyright: "© 2024 Whiat Company - Все права защищены."
    }
};

let currentLang = localStorage.getItem('whiat_lang') || 'es';

function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Idioma "${lang}" no encontrado. Usando español.`);
        lang = 'es';
    }
    currentLang = lang;
    localStorage.setItem('whiat_lang', lang);
    document.documentElement.lang = lang;

    // Actualizar el texto del botón de idioma (si existe en la página)
    const langText = document.getElementById('currentLangText');
    if (langText) {
        const flags = { es: '🇪🇸', en: '🇬🇧', de: '🇩🇪', zh: '🇨🇳', ru: '🇷🇺' };
        const names = { es: 'Español', en: 'English', de: 'Deutsch', zh: '中文', ru: 'Русский' };
        langText.innerHTML = `${flags[lang]} ${names[lang]}`;
    }

    // Traducir todos los elementos con [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Usar innerHTML si la traducción contiene HTML (ej. <strong>)
            el.innerHTML = translations[lang][key];
        }
    });

    // Traducir placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Actualizar el título de la página
    if (translations[lang].titulo) {
        document.title = translations[lang].titulo;
    }

    // Actualizar el estado activo en el dropdown
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

    // Aplicar el idioma guardado al cargar la página
    setLanguage(currentLang);
}

// --- INICIALIZACIÓN GLOBAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar el selector de idioma si existe en la página.
    if (document.getElementById('floatingLanguageToggle')) {
        initLanguageSwitcher();
    } else {
        // Si no hay selector de idioma (ej. login-sandbox.html), igual aplicamos el idioma guardado.
        setLanguage(currentLang);
    }
});


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
// Nota: initLanguageSwitcher() ya se llama dentro de DOMContentLoaded en la sección 4.