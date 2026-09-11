/* =============================================================
   WHIAT COMPANY — Script principal
   Preloader · i18n · Pyodide IDE · Partículas · Luz errante
   ============================================================= */

// =====================================================================
// 1. PRELOADER — 4 segundos exactos
// =====================================================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const progressFill = document.getElementById('preloaderProgress');
    const percentEl    = document.getElementById('preloaderPercent');
    const statusEl     = document.getElementById('preloaderStatus');

    const BUILD_TIME = 3200; // ms de construcción
    const FADE_TIME  = 800;  // ms de desvanecimiento (total ≈ 4s)

    const statuses = [
        { at: 0,   text: 'INITIALIZING' },
        { at: 22,  text: 'CALIBRATING' },
        { at: 45,  text: 'LOADING ASSETS' },
        { at: 68,  text: 'ALMOST READY' },
        { at: 90,  text: 'ENTERING' },
        { at: 100, text: 'WELCOME' }
    ];

    const start = performance.now();
    let lastStatus = '';

    function tick(now) {
        const elapsed = now - start;
        const pct = Math.min(100, (elapsed / BUILD_TIME) * 100);

        if (progressFill) progressFill.style.width = pct + '%';
        if (percentEl)    percentEl.textContent = Math.floor(pct) + '%';

        let currentStatus = statuses[0].text;
        for (const s of statuses) {
            if (pct >= s.at) currentStatus = s.text;
        }
        if (statusEl && statusEl.textContent !== currentStatus) {
            statusEl.textContent = currentStatus;
        }
        lastStatus = currentStatus;

        if (elapsed < BUILD_TIME) {
            requestAnimationFrame(tick);
        } else {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
<<<<<<< HEAD
                document.body.classList.add('loaded');
            }, FADE_TIME);
=======
            }, 600);
        }, remaining);
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
});

// =====================================================================
// 1.5. PARTÍCULAS DINÁMICAS PARA PRELOADER
// =====================================================================
(function createDynamicParticles() {
    const container = document.querySelector('.particle-container');
    if (!container) return;
    
    // Limpiar partículas estáticas y crear dinámicas
    container.innerHTML = '';
    
    const colors = [
        'rgba(0, 212, 255, 0.15)',
        'rgba(100, 200, 255, 0.12)',
        'rgba(0, 180, 255, 0.18)',
        'rgba(50, 150, 255, 0.10)',
        'rgba(0, 212, 255, 0.20)',
        'rgba(150, 200, 255, 0.08)',
        'rgba(0, 220, 255, 0.14)',
        'rgba(255, 212, 59, 0.08)',
        'rgba(255, 107, 107, 0.06)',
    ];
    
    const count = 25;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = 4 + Math.random() * 20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 3;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = (Math.random() - 0.5) * 80;
        const moveY = (Math.random() - 0.5) * 80;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${startY}%;
            left: ${startX}%;
            background: ${color};
            animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
            --move-x: ${moveX}px;
            --move-y: ${moveY}px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .floating-particle:nth-child(${i + 1}) {
                animation: floatParticle${i} ${duration}s ease-in-out ${delay}s infinite;
            }
            @keyframes floatParticle${i} {
                0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
                20% { opacity: ${0.3 + Math.random() * 0.5}; }
                50% { transform: translate(${moveX}px, ${moveY}px) scale(${0.8 + Math.random() * 0.6}); }
                80% { opacity: ${0.3 + Math.random() * 0.5}; }
                100% { opacity: 0; transform: translate(${-moveX * 0.5}px, ${-moveY * 0.5}px) scale(0.3); }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(particle);
    }
})();

// =====================================================================
// 2. SISTEMA DE SEGURIDAD AVANZADO
// =====================================================================
(function detectDevTools() {
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtools = true;
            throw new Error('Consola detectada');
>>>>>>> 8165da83255781678a92668766650f6a9cfc0788
        }
    }
    requestAnimationFrame(tick);

    // Failsafe: si algo falla, quitar en 6s
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 900);
        }
    }, 6000);
})();

// =====================================================================
// 2. SEGURIDAD BÁSICA (bloqueo de teclas sensibles)
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

// Bloquear copia/recorte (dejar inputs libres)
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
// 3. SISTEMA DE IDIOMAS (i18n)
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
        ide_footer: "🧠 Powered by <strong>Pyodide</strong> (Python in WebAssembly) - 100% local execution in your browser.",
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

    // Textos
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!translations[lang][key]) return;
        const tag = el.tagName;
        if ((tag === 'INPUT' || tag === 'TEXTAREA') && el.hasAttribute('data-i18n-placeholder')) return;
        el.innerHTML = translations[lang][key];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    // Select servicio
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

    // Editor Python
    const codeEditor = document.getElementById('pythonCodeEditor');
    if (codeEditor) {
        const cur = codeEditor.value.trim();
        if (cur === DEFAULT_ES.trim() || cur === DEFAULT_EN.trim() || cur === '') {
            codeEditor.value = lang === 'es' ? DEFAULT_ES : DEFAULT_EN;
        }
    }

    // stdin
    const stdinArea = document.getElementById('pythonStdin');
    if (stdinArea) {
        if (stdinArea.value === "Juan\n25" || stdinArea.value === "John\n25") {
            stdinArea.value = lang === 'es' ? "Juan\n25" : "John\n25";
        }
        stdinArea.placeholder = translations[lang].ide_stdin_placeholder;
    }

    // Título
    document.title = translations[lang].titulo;

    // Marcar opción activa
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
// 4. POLVO FLOTANTE (Canvas)
// =====================================================================
(function initDust() {
    const canvas = document.getElementById('dustCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, dpr;
    const particles = [];

    function resize() {
        dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = window.innerWidth < 700 ? 35 : 70;
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            size: Math.random() * 1.8 + 0.4,
            alpha: Math.random() * 0.45 + 0.08,
            phase: Math.random() * Math.PI * 2
        });
    }

    let t = 0;
    function animate() {
        t += 0.008;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            p.x += p.vx + Math.sin(t + p.phase) * 0.08;
            p.y += p.vy + Math.cos(t + p.phase) * 0.08;

            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;

            const flicker = 0.6 + Math.sin(t * 2 + p.phase) * 0.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 228, 216, ${p.alpha * flicker})`;
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// =====================================================================
// 5. LUZ ERRANTE
// =====================================================================
(function initWanderingLight() {
    const light = document.getElementById('wanderingLight');
    if (!light) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    let speed = 0.006;

    function pickTarget() {
        tx = Math.random() * window.innerWidth;
        ty = Math.random() * window.innerHeight;
    }
    pickTarget();
    setInterval(pickTarget, 7000);

    function loop() {
        x += (tx - x) * speed;
        y += (ty - y) * speed;
        light.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
        requestAnimationFrame(loop);
    }
    loop();
})();

// =====================================================================
// 6. FIX AVATAR (intenta varias rutas)
// =====================================================================
(function fixProfileImage() {
    const img = document.getElementById('profileAvatar');
    if (!img) return;

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
        function next() {
            if (i >= paths.length) return;
            const test = new Image();
            test.onload = () => { img.src = paths[i]; img.onerror = null; };
            test.onerror = () => { i++; next(); };
            test.src = paths[i];
        }
        next();
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
            statusSpan.style.color = "var(--bone-bright)";
            statusSpan.style.borderColor = "var(--bone-bright)";
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
// 10. REVELADO AL SCROLL
// =====================================================================
(function initScrollReveal() {
    const els = document.querySelectorAll(
        '.model-card, .service-card, .allies-card, .profile-card, .fullstack-card, .python-test-card, .fullstack-tile, .cta-content, .contact-form, .python-ide-card'
    );
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('reveal-on-scroll', 'visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
})();

// =====================================================================
// 11. INIT
// =====================================================================
document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitcher();
});