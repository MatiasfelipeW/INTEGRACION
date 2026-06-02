// ==================== SISTEMA DE SEGURIDAD AVANZADO ====================
(function detectDevTools() {
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtools = true;
            throw new Error('Consola detectada');
        }
    });
    setInterval(() => {
        devtools = false;
        console.log('%c', element);
        console.clear();
        if (devtools) {
            document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#00d4ff;display:flex;align-items:center;justify-content:center;z-index:99999;flex-direction:column;"><h1>⚠️ Acceso Denegado</h1><p>Herramientas de desarrollo deshabilitadas por seguridad.</p></div>';
        }
    }, 1000);
})();

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S'))) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
            // Comentado para no saturar la consola
            // console.log('Protección activa: modificaciones no permitidas');
        }
    });
});
observer.observe(document.body, { attributes: true, childList: true, subtree: true });

document.body.addEventListener('copy', function(e) { e.preventDefault(); return false; });
document.body.addEventListener('cut', function(e) { e.preventDefault(); return false; });

let printAttempts = 0;
window.addEventListener('beforeprint', function() { printAttempts++; if(printAttempts > 0) alert('La impresión/captura de contenido está protegida.'); });

// ==================== TRADUCCIONES ====================
const translations = {
    es: {
        "nav-model": "Modelo", "nav-services": "Servicios", "nav-web": "Desarrollo Web", "nav-allies": "Aliados",
        "nav-profile": "Perfil", "nav-contact": "Contacto", "nav-login": "Iniciar Sesión",
        "hero-badge": "Soluciones Digitales Integrales | Aliados Estratégicos",
        "hero-title": "Impulsamos tu negocio con tecnología de vanguardia",
        "hero-desc": "Expertos en crear aplicaciones móviles, sitios web de alto rendimiento, ciberseguridad, blockchain y soluciones digitales a medida para pequeñas, medianas y grandes empresas.",
        "hero-btn": "Cuéntanos tu idea",
        "model-title": "Nuestro Modelo: Innovación Híbrida",
        "model-desc": "Combinamos un equipo interno de expertos con una red de freelancers especializados para ofrecerte el mejor talento, cuando lo necesites.",
        "model-team-title": "Equipo de Desarrollo Propio",
        "model-team-desc": "Contamos con un equipo central de profesionales en desarrollo de software, ciberseguridad y blockchain. Son nuestros expertos de confianza, listos para dar soporte continuo y garantizar la calidad en todos los proyectos.",
        "model-freelance-title": "Red de Freelancers Certificados",
        "model-freelance-desc": "Ampliamos nuestras capacidades con una red curada de freelancers especializados. A través de nuestro modelo de corretaje, conectamos tu proyecto con el talento perfecto, manejando toda la gestión y garantizando la entrega exitosa.",
        "services-title": "Nuestros Servicios Especializados",
        "services-desc": "Soluciones completas para cada necesidad digital de tu empresa.",
        "service-apps-title": "Apps Android & iOS",
        "service-apps-desc": "Aplicaciones nativas e híbridas de alto rendimiento para llevar tu negocio a todos los dispositivos.",
        "app-feat1": "Apps para comercios y restaurantes",
        "app-feat2": "Plataformas de pedidos a domicilio",
        "app-feat3": "Sistemas de fidelización",
        "app-feat4": "Publicación en App Store y Play Store",
        "btn-quote-app": "Cotizar App",
        "service-security-title": "Ciberseguridad & Protección de Datos",
        "service-security-desc": "Protegemos tu infraestructura digital contra amenazas y garantizamos el cumplimiento normativo.",
        "security-feat1": "Auditorías de seguridad y pentesting",
        "security-feat2": "Implementación de firewalls y sistemas IDS/IPS",
        "security-feat3": "Gestión de identidades y accesos (IAM)",
        "security-feat4": "Cumplimiento de normas (ISO 27001, GDPR)",
        "btn-protect": "Proteger mi Empresa",
        "service-blockchain-title": "Blockchain & Minería Crypto",
        "service-blockchain-desc": "Desarrollamos soluciones basadas en blockchain y te asesoramos en proyectos de minería de criptomonedas.",
        "blockchain-feat1": "Desarrollo de contratos inteligentes (Smart Contracts)",
        "blockchain-feat2": "Implementación de redes privadas blockchain",
        "blockchain-feat3": "Asesoría en inversión y montaje de granjas de minería",
        "blockchain-feat4": "Tokenización de activos (NFTs, STOs)",
        "btn-explore": "Explorar Blockchain",
        "service-outsourcing-title": "Outsourcing IT & Corretaje",
        "service-outsourcing-desc": "Amplía tu equipo con programadores expertos por proyecto. Nosotros gestionamos el talento, tú te enfocas en tu negocio.",
        "outsourcing-feat1": "Contratación por horas o proyecto",
        "outsourcing-feat2": "Desarrolladores full-stack, frontend, backend",
        "outsourcing-feat3": "Especialistas en bases de datos y DevOps",
        "outsourcing-feat4": "Gestión de pagos y seguimiento de KPIs",
        "btn-hire": "Contratar Talento",
        "service-sme-title": "Soporte para PYMES",
        "service-sme-desc": "Gestionamos y optimizamos tu infraestructura tecnológica para que puedas crecer sin preocupaciones.",
        "sme-feat1": "Administración de servidores y redes",
        "sme-feat2": "Soporte técnico remoto y presencial",
        "sme-feat3": "Mantenimiento de equipos y sistemas",
        "sme-feat4": "Estrategias de transformación digital",
        "btn-support": "Solicitar Soporte",
        "service-web-title": "Páginas Web & CMS",
        "service-web-desc": "Creamos sitios web impactantes, desde landing pages hasta complejos portales empresariales con fácil administración.",
        "web-feat1": "Diseño responsivo y enfocado en UX/UI",
        "web-feat2": "E-commerce (Tiendas online)",
        "web-feat3": "Gestión de contenido (WordPress, Strapi)",
        "web-feat4": "Optimización SEO y velocidad",
        "btn-create-web": "Crear mi Web",
        "service-maintenance-title": "Mantenimiento & Actualización",
        "service-maintenance-desc": "Aseguramos que tu sitio web y aplicaciones estén siempre actualizados, seguros y funcionando al máximo rendimiento.",
        "maintenance-feat1": "Actualizaciones de seguridad y parches",
        "maintenance-feat2": "Copias de seguridad automáticas",
        "maintenance-feat3": "Monitoreo 24/7 de disponibilidad",
        "maintenance-feat4": "Migraciones de servidores y bases de datos",
        "btn-maintain": "Mantener mi Proyecto",
        "fullstack-title": "Desarrollo Web Fullstack",
        "fullstack-desc": "Construimos aplicaciones web completas, desde el frontend más moderno hasta el backend más robusto y escalable.",
        "frontend-title": "Frontend Moderno",
        "backend-title": "Backend Robusto",
        "database-title": "Bases de Datos",
        "fullstack-btn": "Solicitar Desarrollo Personalizado",
        "allies-title": "Aliados del Nuevo Mundo Digital",
        "allies-desc": "Conectamos empresas emergentes y consolidadas con las oportunidades de la era digital.",
        "allies-emerging-title": "Para Empresas Emergentes",
        "allies-emerging-desc": "Acompañamos a startups y negocios en sus primeras etapas digitales, proporcionando soluciones escalables y asesoría estratégica para que su tecnología impulse su crecimiento desde el día uno.",
        "allies-established-title": "Para Empresas Acreditadas",
        "allies-established-desc": "Ayudamos a empresas consolidadas a modernizar su infraestructura, adoptar nuevas tecnologías como blockchain y ciberseguridad avanzada, y a optimizar sus procesos para mantenerse a la vanguardia.",
        "gov-badge": "De la mano con el desarrollo nacional",
        "gov-title": "Compromiso con Colombia",
        "gov-desc": "Estamos en constante actualización y alineados con los proyectos del gobierno colombiano, participando en iniciativas de transformación digital, educación tecnológica y apoyo a emprendedores. Nuestro objetivo es ser un puente que genere oportunidades y contribuya al avance del nuevo mundo digital en el país.",
        "profile-title": "Perfil Profesional",
        "profile-desc": "Conoce al fundador y líder detrás de Whiat Company",
        "profile-position": "CEO & Fundador de Whiat Company - Garantias Financieras y Juridicas S.A.S",
        "profile-website": "Mi Website Oficial",
        "profile-whatsapp": "Consulta Inmediata",
        "profile-email": "Correo Directo",
        "cta-title": "¿Listo para dar el salto digital?",
        "cta-desc": "Ya sea un desarrollo a medida, ampliar tu equipo con nuestros freelancers o asegurar tu infraestructura, estamos aquí para hacerlo realidad.",
        "cta-btn": "Solicitar una Consultoría Gratuita",
        "contact-title": "Contacto",
        "contact-desc": "Ponte en contacto con nosotros para discutir tu proyecto",
        "form-name": "Nombre Completo",
        "form-phone": "Teléfono (con indicativo)",
        "form-email": "Correo Electrónico",
        "form-company": "Empresa (opcional)",
        "form-service": "Servicio de Interés",
        "select-default": "Selecciona un servicio",
        "service-opt1": "Outsourcing / Corretaje de Programadores",
        "service-opt2": "App Móvil (Android/iOS)",
        "service-opt3": "Ciberseguridad",
        "service-opt4": "Blockchain & Minería",
        "service-opt5": "Soporte para PYMES",
        "service-opt6": "Desarrollo Web Fullstack",
        "service-opt7": "Desarrollo Web Básico",
        "service-opt8": "Mantenimiento Web y Datos",
        "service-opt9": "Consultoría con Matías Whiat",
        "service-opt10": "Otro",
        "form-message": "Mensaje",
        "form-submit": "Enviar Mensaje",
        "login-subtitle": "Accede a tu cuenta para gestionar tus proyectos",
        "login-email-label": "Correo Electrónico",
        "login-password-label": "Contraseña",
        "login-remember": "Recordarme",
        "login-forgot": "¿Olvidaste tu contraseña?",
        "login-btn": "Iniciar Sesión",
        "login-register": "¿No tienes una cuenta? Regístrate aquí",
        "footer-about": "Impulsamos la evolución de los negocios hacia un futuro más digital. Somos tu aliado estratégico en desarrollo de software, ciberseguridad y transformación digital.",
        "footer-services": "Servicios",
        "footer-link-outsourcing": "Outsourcing IT",
        "footer-link-security": "Ciberseguridad",
        "footer-link-blockchain": "Blockchain & Minería",
        "footer-link-apps": "Apps Móviles",
        "footer-link-fullstack": "Desarrollo Web Fullstack",
        "footer-links-title": "Enlaces",
        "footer-link-model": "Nuestro Modelo",
        "footer-link-allies": "Aliados",
        "footer-link-profile": "Perfil Profesional",
        "footer-link-contact": "Contacto",
        "footer-link-login": "Iniciar Sesión",
        "footer-legal": "Legal",
        "footer-privacy": "Política de Privacidad",
        "footer-terms": "Términos de Servicio",
        "footer-cookies": "Cookies",
        "footer-rights": "Todos los derechos reservados.",
        "python-title": "🔥 Pon a prueba tu dominio de Python",
        "python-desc": "¿Crees que dominas Python? Demuestra tus conocimientos con este test interactivo. En menos de 5 minutos descubrirás tu nivel real. ¡Atrévete!",
        "python-btn": "🎯 Probar mi nivel →"
    },
    en: {
        "nav-model": "Model", "nav-services": "Services", "nav-web": "Web Development", "nav-allies": "Allies",
        "nav-profile": "Profile", "nav-contact": "Contact", "nav-login": "Login",
        "hero-badge": "Comprehensive Digital Solutions | Strategic Allies",
        "hero-title": "Boost your business with cutting-edge technology",
        "hero-desc": "Experts in creating mobile apps, high-performance websites, cybersecurity, blockchain and custom digital solutions for small, medium and large companies.",
        "hero-btn": "Tell us your idea",
        "services-title": "Our Specialized Services",
        "services-desc": "Complete solutions for every digital need of your company.",
        "service-apps-title": "Android & iOS Apps",
        "service-apps-desc": "High-performance native and hybrid applications to bring your business to all devices.",
        "app-feat1": "Apps for shops and restaurants",
        "app-feat2": "Delivery platforms",
        "app-feat3": "Loyalty systems",
        "app-feat4": "Publication on App Store and Play Store",
        "btn-quote-app": "Quote App",
        "service-security-title": "Cybersecurity & Data Protection",
        "service-security-desc": "We protect your digital infrastructure against threats and ensure regulatory compliance.",
        "security-feat1": "Security audits and pentesting",
        "security-feat2": "Firewall and IDS/IPS implementation",
        "security-feat3": "Identity and Access Management (IAM)",
        "security-feat4": "Compliance with standards (ISO 27001, GDPR)",
        "btn-protect": "Protect my Company",
        "service-blockchain-title": "Blockchain & Crypto Mining",
        "service-blockchain-desc": "We develop blockchain-based solutions and advise you on cryptocurrency mining projects.",
        "blockchain-feat1": "Smart Contracts development",
        "blockchain-feat2": "Private blockchain network implementation",
        "blockchain-feat3": "Investment advice and mining farm setup",
        "blockchain-feat4": "Asset tokenization (NFTs, STOs)",
        "btn-explore": "Explore Blockchain",
        "service-outsourcing-title": "IT Outsourcing & Brokerage",
        "service-outsourcing-desc": "Expand your team with expert programmers per project. We manage the talent, you focus on your business.",
        "outsourcing-feat1": "Hourly or project hiring",
        "outsourcing-feat2": "Full-stack, frontend, backend developers",
        "outsourcing-feat3": "Database and DevOps specialists",
        "outsourcing-feat4": "Payment management and KPI tracking",
        "btn-hire": "Hire Talent",
        "service-sme-title": "SME Support",
        "service-sme-desc": "We manage and optimize your technological infrastructure so you can grow worry-free.",
        "sme-feat1": "Server and network administration",
        "sme-feat2": "Remote and on-site technical support",
        "sme-feat3": "Equipment and systems maintenance",
        "sme-feat4": "Digital transformation strategies",
        "btn-support": "Request Support",
        "service-web-title": "Websites & CMS",
        "service-web-desc": "We create stunning websites, from landing pages to complex business portals with easy management.",
        "web-feat1": "Responsive design focused on UX/UI",
        "web-feat2": "E-commerce (Online stores)",
        "web-feat3": "Content management (WordPress, Strapi)",
        "web-feat4": "SEO and speed optimization",
        "btn-create-web": "Create my Website",
        "service-maintenance-title": "Maintenance & Updates",
        "service-maintenance-desc": "We ensure your website and applications are always up-to-date, secure and performing at their best.",
        "maintenance-feat1": "Security updates and patches",
        "maintenance-feat2": "Automatic backups",
        "maintenance-feat3": "24/7 availability monitoring",
        "maintenance-feat4": "Server and database migrations",
        "btn-maintain": "Maintain my Project",
        "fullstack-title": "Fullstack Web Development",
        "fullstack-desc": "We build complete web applications, from the most modern frontend to the most robust and scalable backend.",
        "frontend-title": "Modern Frontend",
        "backend-title": "Robust Backend",
        "database-title": "Databases",
        "fullstack-btn": "Request Custom Development",
        "allies-title": "Allies of the New Digital World",
        "allies-desc": "We connect emerging and established companies with the opportunities of the digital age.",
        "allies-emerging-title": "For Emerging Companies",
        "allies-emerging-desc": "We accompany startups and businesses in their early digital stages, providing scalable solutions and strategic advice so their technology drives growth from day one.",
        "allies-established-title": "For Established Companies",
        "allies-established-desc": "We help established companies modernize their infrastructure, adopt new technologies like blockchain and advanced cybersecurity, and optimize their processes to stay ahead.",
        "gov-badge": "Hand in hand with national development",
        "gov-title": "Commitment to Colombia",
        "gov-desc": "We are constantly updated and aligned with the projects of the Colombian government, participating in digital transformation initiatives, technological education and support for entrepreneurs. Our goal is to be a bridge that generates opportunities and contributes to the advancement of the new digital world in the country.",
        "profile-title": "Professional Profile",
        "profile-desc": "Meet the founder and leader behind Whiat Company",
        "profile-position": "CEO & Founder of Whiat Company - Garantias Financieras y Juridicas S.A.S",
        "profile-website": "My Official Website",
        "profile-whatsapp": "Immediate Consultation",
        "profile-email": "Direct Email",
        "cta-title": "Ready to make the digital leap?",
        "cta-desc": "Whether it's a custom development, expanding your team with our freelancers or securing your infrastructure, we are here to make it happen.",
        "cta-btn": "Request a Free Consultation",
        "contact-title": "Contact",
        "contact-desc": "Get in touch with us to discuss your project",
        "form-name": "Full Name",
        "form-phone": "Phone (with country code)",
        "form-email": "Email",
        "form-company": "Company (optional)",
        "form-service": "Service of Interest",
        "select-default": "Select a service",
        "service-opt1": "Outsourcing / Programmer Brokerage",
        "service-opt2": "Mobile App (Android/iOS)",
        "service-opt3": "Cybersecurity",
        "service-opt4": "Blockchain & Mining",
        "service-opt5": "SME Support",
        "service-opt6": "Fullstack Web Development",
        "service-opt7": "Basic Web Development",
        "service-opt8": "Web and Data Maintenance",
        "service-opt9": "Consulting with Matías Whiat",
        "service-opt10": "Other",
        "form-message": "Message",
        "form-submit": "Send Message",
        "login-subtitle": "Access your account to manage your projects",
        "login-email-label": "Email",
        "login-password-label": "Password",
        "login-remember": "Remember me",
        "login-forgot": "Forgot your password?",
        "login-btn": "Login",
        "login-register": "Don't have an account? Sign up here",
        "footer-about": "We drive the evolution of businesses towards a more digital future. We are your strategic ally in software development, cybersecurity and digital transformation.",
        "footer-services": "Services",
        "footer-link-outsourcing": "IT Outsourcing",
        "footer-link-security": "Cybersecurity",
        "footer-link-blockchain": "Blockchain & Mining",
        "footer-link-apps": "Mobile Apps",
        "footer-link-fullstack": "Fullstack Web Development",
        "footer-links-title": "Links",
        "footer-link-model": "Our Model",
        "footer-link-allies": "Allies",
        "footer-link-profile": "Professional Profile",
        "footer-link-contact": "Contact",
        "footer-link-login": "Login",
        "footer-legal": "Legal",
        "footer-privacy": "Privacy Policy",
        "footer-terms": "Terms of Service",
        "footer-cookies": "Cookies",
        "footer-rights": "All rights reserved.",
        "python-title": "🔥 Test your Python skills",
        "python-desc": "Think you master Python? Take this interactive test and discover your real level in less than 5 minutes. Dare to try!",
        "python-btn": "🎯 Test my level →"
    }
};

// Copiar el español a los demás idiomas (fallback a español en lugar de inglés)
const otherLangs = ['de', 'ru', 'zh', 'fr', 'it', 'pt'];
otherLangs.forEach(lang => {
    translations[lang] = { ...translations.es };  // AHORA USA ESPAÑOL
});

// Sistema de fallback: si falta una clave, usa español (sin advertencias)
function getTranslation(key, lang) {
    if (translations[lang] && translations[lang][key] !== undefined) {
        return translations[lang][key];
    }
    // Si no está en el idioma elegido, usar español (sin mensajes de consola)
    if (translations.es && translations.es[key] !== undefined) {
        return translations.es[key];
    }
    // Último recurso: devolver null (mantiene el texto original del HTML)
    return null;
}

let currentLang = 'es';

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key, currentLang);
        
        if (translation !== null) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    const langNames = {
        es: "🌐 Español",
        en: "🇬🇧 English",
        de: "🇩🇪 Deutsch",
        ru: "🇷🇺 Русский",
        zh: "🇨🇳 中文",
        fr: "🇫🇷 Français",
        it: "🇮🇹 Italiano",
        pt: "🇵🇹 Português"
    };
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        currentLangText.textContent = langNames[currentLang] || "🌐 Español";
    }
    
    document.querySelectorAll('.floating-lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === currentLang) opt.classList.add('active');
    });
    
    localStorage.setItem('preferredLanguage', currentLang);
}

function changeLanguage(lang) {
    if (translations.hasOwnProperty(lang)) {
        currentLang = lang;
        translatePage();
        showLanguageMessage(lang);
    } else {
        console.error(`Idioma "${lang}" no soportado.`);
    }
}

function showLanguageMessage(lang) {
    const messages = {
        es: '🌐 Idioma cambiado a Español',
        en: '🌐 Language changed to English',
        de: '🌐 Sprache zu Deutsch geändert',
        ru: '🌐 Язык изменен на Русский',
        zh: '🌐 语言已更改为中文',
        fr: '🌐 Langue changée en Français',
        it: '🌐 Lingua cambiata in Italiano',
        pt: '🌐 Idioma alterado para Português'
    };
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.bottom = '180px';
    message.style.right = '30px';
    message.style.background = 'var(--dark-gray, #0f172a)';
    message.style.color = 'var(--primary, #00d4ff)';
    message.style.padding = '12px 20px';
    message.style.borderRadius = '8px';
    message.style.border = '1px solid var(--primary, #00d4ff)';
    message.style.zIndex = '1000';
    message.style.fontSize = '0.85rem';
    message.style.backgroundColor = '#0f172a';
    message.textContent = messages[lang] || `🌐 Language changed to ${lang}`;
    document.body.appendChild(message);
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.5s ease';
        setTimeout(() => message.remove(), 500);
    }, 2500);
}

// ==================== PRELOADER Y CONFIGURACIÓN INICIAL ====================
window.addEventListener('load', function() {
    let progress = 0;
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const preloader = document.getElementById('preloader');
    const interval = setInterval(function() {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;
        if (loadingBar) loadingBar.style.width = progress + '%';
        if (loadingText) {
            if (progress < 30) loadingText.textContent = "Cargando recursos...";
            else if (progress < 70) loadingText.textContent = "Inicializando componentes...";
            else loadingText.textContent = "¡Listo!";
        }
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (preloader) {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.style.display = 'none', 500);
                }
            }, 300);
        }
    }, 40);
    
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations.hasOwnProperty(savedLang)) changeLanguage(savedLang);
    else changeLanguage('es');
});

// ==================== PARTÍCULAS ====================
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00d4ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00d4ff", opacity: 0.25, width: 1 },
            move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.6 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// ==================== NAVEGACIÓN SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ==================== LOGIN DEMO ====================
window.handleLogin = function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    alert(`¡Bienvenido a WHIAT COMPANY!\n\nEmail: ${email}\n\nEsta es una demostración. La funcionalidad de login real estará disponible próximamente.`);
};

// ==================== BOTÓN FLOTANTE DE IDIOMA ====================
const floatingToggle = document.getElementById('floatingLanguageToggle');
const floatingDropdown = document.getElementById('floatingLanguageDropdown');
if (floatingToggle) {
    floatingToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingDropdown.classList.toggle('show');
    });
}
document.querySelectorAll('.floating-lang-option').forEach(option => {
    option.addEventListener('click', () => {
        changeLanguage(option.getAttribute('data-lang'));
        floatingDropdown.classList.remove('show');
    });
});
document.addEventListener('click', (e) => {
    if (floatingDropdown && floatingToggle && !floatingToggle.contains(e.target) && !floatingDropdown.contains(e.target)) {
        floatingDropdown.classList.remove('show');
    }
});

// ==================== ANIMACIONES AL HACER SCROLL ====================
const elementsToAnimate = document.querySelectorAll('.model-card, .service-card, .allies-card, .profile-card, .fullstack-card, .python-test-card');
const observerScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observerScroll.observe(el);
});

// ==================== BLOQUEO DE SCRIPTS EXTERNOS NO AUTORIZADOS ====================
const scriptBlocker = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.tagName === 'SCRIPT' && node.src && 
                !node.src.includes('cdn.jsdelivr.net') && 
                !node.src.includes('cdnjs.cloudflare.com')) {
                node.remove();
                console.warn('Script no autorizado eliminado:', node.src);
            }
        });
    });
});
scriptBlocker.observe(document.head, { childList: true, subtree: true });
scriptBlocker.observe(document.body, { childList: true, subtree: true });