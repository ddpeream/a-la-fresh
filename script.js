// Variables globales
let currentSection = 'home';
const sections = ['home', 'products', 'gallery', 'contact'];

// Cargar componentes reutilizables (header y footer)
async function loadComponents() {
    try {
        // Cargar header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('components/header.html');
            const headerHtml = await headerResponse.text();
            headerPlaceholder.innerHTML = headerHtml;
            console.log('Header cargado correctamente');
        }
        
        // Cargar footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerResponse = await fetch('components/footer.html');
            const footerHtml = await footerResponse.text();
            footerPlaceholder.innerHTML = footerHtml;
            console.log('Footer cargado correctamente');
        }
        
        // Cargar botón flotante de juego
        const floatingGameBtnPlaceholder = document.getElementById('floating-game-btn-placeholder');
        console.log('🍓 Buscando placeholder del botón:', floatingGameBtnPlaceholder);
        if (floatingGameBtnPlaceholder) {
            console.log('🍓 Placeholder encontrado, cargando botón...');
            const floatingGameBtnResponse = await fetch('components/floating-game-button.html');
            const floatingGameBtnHtml = await floatingGameBtnResponse.text();
            console.log('🍓 HTML del botón obtenido:', floatingGameBtnHtml.substring(0, 100));
            floatingGameBtnPlaceholder.innerHTML = floatingGameBtnHtml;
            console.log('🍓 Botón flotante de juego cargado correctamente');
        } else {
            console.warn('⚠️ No se encontró el placeholder del botón flotante');
        }
        
        // Marcar el nav-link activo según la página actual
        markActiveNavLink();
        
        // Inicializar funcionalidades después de cargar los componentes
        initializeNavigation();
        initializeMobileMenu();
        initializeLanguageDropdown();
        
    } catch (error) {
        console.error('Error cargando componentes:', error);
    }
}

// Marcar el nav-link activo según la página actual
function markActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('data-page');
        
        // Si es index.html o la raíz
        if ((currentPage === 'index.html' || currentPage === '') && linkPage === 'index') {
            link.classList.add('active');
        }
        // Para las demás páginas
        else if (currentPage.includes(linkPage)) {
            link.classList.add('active');
        }
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async function() {
    // Primero cargar los componentes
    await loadComponents();
    
    // Luego inicializar el resto
    initializeAnimations();
    initializeScrollEffects();
    initializeParallax();
    initializeSectionObserver(); // Nuevo observer para secciones
    initializeDynamicGallery(); // Inicializar galería dinámica
    
    // Ejecutar detección inicial de sección activa
    setTimeout(() => {
        updateActiveSection();
    }, 100);
});

// Navegación y menú
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo prevenir default y hacer scroll si es un enlace hash (#)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
                
                // Actualizar clase activa
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            // Si no es hash, dejar que navegue normalmente (inicio.html, productos.html)
        });
    });
}

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Ajuste para navbar fija
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        currentSection = sectionId;
        updateActiveNavLink();
    }
}

// Actualizar enlace activo en navegación
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Actualizando navegación para sección:', currentSection); // Debug
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
            console.log('Activando enlace:', href); // Debug
        }
    });
}

// Menú móvil
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Language dropdown functionality
function initializeLanguageDropdown() {
    const langCurrent = document.getElementById('currentLang');
    const langOptions = document.getElementById('langOptions');
    const langDropdown = document.querySelector('.lang-dropdown');

    if (langCurrent && langOptions && langDropdown) {
        langCurrent.addEventListener('click', function(e) {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            langDropdown.classList.remove('active');
        });

        // Prevent closing when clicking inside dropdown
        langOptions.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Update current language display
function updateCurrentLanguageDisplay(lang) {
    const currentLang = document.getElementById('currentLang');
    if (currentLang) {
        const flags = {
            'es': '🇪🇸',
            'en': '🇺🇸', 
            'zh': '🇨🇳',
            'fr': '🇫🇷'
        };
        
        const codes = {
            'es': 'ES',
            'en': 'EN',
            'zh': '中',
            'fr': 'FR'
        };
        
        currentLang.innerHTML = `
            <span class="flag">${flags[lang]}</span>
            <span>${codes[lang]}</span>
            <span class="chevron">▾</span>
        `;
    }
}

// Efectos de scroll
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        updateNavbarOnScroll();
        updateActiveSection();
        triggerAnimationsOnScroll();
    });
}

// Efecto de navbar al hacer scroll
function updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

// Detectar sección activa durante scroll
function updateActiveSection() {
    const scrollY = window.scrollY + 100; // Reducir offset para mejor detección
    let foundSection = null;
    
    // Buscar qué sección está actualmente visible
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Si el scroll está dentro de esta sección
            if (scrollY >= sectionTop - 50 && scrollY < sectionBottom - 50) {
                foundSection = sectionId;
            }
        }
    });
    
    // Si encontramos una sección y es diferente a la actual
    if (foundSection && currentSection !== foundSection) {
        currentSection = foundSection;
        updateActiveNavLink();
        console.log('Sección activa:', currentSection); // Debug
    }
}

// Animaciones al hacer scroll
function initializeAnimations() {
    // Observador de intersección para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animaciones específicas por elemento
                if (entry.target.classList.contains('product-card')) {
                    animateProductCard(entry.target);
                }
                
                if (entry.target.classList.contains('feature-item')) {
                    animateFeatureItem(entry.target);
                }
                
                if (entry.target.classList.contains('detail-item')) {
                    animateDetailItem(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.product-card, .feature-item, .detail-item, .section-header');
    animatedElements.forEach(el => observer.observe(el));
}

// Animaciones específicas
function animateProductCard(card) {
    card.style.transform = 'translateY(0)';
    card.style.opacity = '1';
    
    // Animación en cascada para los elementos internos
    const cardElements = card.querySelectorAll('.card-image, .card-content');
    cardElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, index * 200);
    });
}

function animateFeatureItem(item) {
    item.style.transform = 'translateY(0) scale(1)';
    item.style.opacity = '1';
    
    // Efecto de rebote
    setTimeout(() => {
        item.style.transform = 'translateY(-5px) scale(1.02)';
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
        }, 200);
    }, 300);
}

function animateDetailItem(item) {
    item.style.transform = 'translateX(0)';
    item.style.opacity = '1';
    
    // Animación del icono
    const icon = item.querySelector('.detail-icon');
    if (icon) {
        setTimeout(() => {
            icon.style.animation = 'iconPulse 0.6s ease-out';
        }, 300);
    }
}

// Efectos de parallax suaves
function initializeParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-elements, .floating-hearts');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Animaciones en scroll específicas
function triggerAnimationsOnScroll() {
    const scrollY = window.scrollY;
    
    // Animación del indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const opacity = Math.max(0, 1 - scrollY / 300);
        scrollIndicator.style.opacity = opacity;
    }
    
    // Parallax en elementos flotantes
    const floatingElements = document.querySelectorAll('.floating-leaf, .floating-paw, .heart');
    floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
    });
}

// Efectos de hover mejorados
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de hover en cards
    const cards = document.querySelectorAll('.product-card, .feature-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Añadir brillo sutil
            this.style.boxShadow = '0 20px 40px rgba(45, 143, 71, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efecto de hover en botones
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Efectos de cursor personalizado (opcional)
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Efectos especiales en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .feature-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Animaciones de carga de página
window.addEventListener('load', function() {
    // Animación de entrada para el hero
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animación de entrada para la imagen del hero
    setTimeout(() => {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }
    }, 800);
});

// Funciones utilitarias
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Optimización de rendimiento
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Aquí van las animaciones que se ejecutan en cada frame
    ticking = false;
}

// Event listeners optimizados
window.addEventListener('scroll', requestTick);
window.addEventListener('resize', function() {
    // Recalcular posiciones después de resize
    setTimeout(updateActiveSection, 100);
});

// Preloader (opcional)
function initializePreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="logo-animation">
                <i class="fas fa-leaf"></i>
                <span>A la Fresh</span>
            </div>
            <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Efectos especiales para fechas especiales
function checkSpecialDates() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Día del perro (21 de julio)
    if (month === 7 && day === 21) {
        addSpecialDogEffects();
    }
    
    // Navidad
    if (month === 12 && day >= 20 && day <= 25) {
        addChristmasEffects();
    }
}

function addSpecialDogEffects() {
    const specialElements = document.querySelectorAll('.floating-paw');
    specialElements.forEach(element => {
        element.style.animation = 'pawCelebration 1s ease-in-out infinite';
    });
}

// Función para manejar errores de imágenes
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = this.parentElement.querySelector('.placeholder-content');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        });
    });
}

// Inicializar efectos especiales
document.addEventListener('DOMContentLoaded', function() {
    checkSpecialDates();
    handleImageErrors();
    
    // Opcional: inicializar preloader
    // initializePreloader();
});

// Dynamic Gallery functionality
function loadEventImages() {
    // Array con todas las imágenes de la carpeta events/
    const eventImages = [
        {
            src: 'assets/events/fresh-fiest.jpg',
            title: 'gallery_event1_title',
            description: 'gallery_event1_desc',
            alt: 'gallery_img1_alt'
        },
        {
            src: 'assets/events/fresh-fiest1.jpg',
            title: 'gallery_event2_title', 
            description: 'gallery_event2_desc',
            alt: 'gallery_img2_alt'
        },
        {
            src: 'assets/events/fresh-fiest2.jpg',
            title: 'gallery_event3_title',
            description: 'gallery_event3_desc', 
            alt: 'gallery_img3_alt'
        },
        {
            src: 'assets/events/fresh-fiest3.jpg',
            title: 'gallery_event4_title',
            description: 'gallery_event4_desc',
            alt: 'gallery_img4_alt'
        },
        {
            src: 'assets/events/fresh-fiest4.jpg',
            title: 'gallery_event5_title',
            description: 'gallery_event5_desc',
            alt: 'gallery_img5_alt'
        },
        {
            src: 'assets/events/fresh-fiest5.jpg',
            title: 'gallery_event6_title',
            description: 'gallery_event6_desc',
            alt: 'gallery_img6_alt'
        },
        {
            src: 'assets/events/fresh-fiest6.jpg',
            title: 'gallery_event7_title',
            description: 'gallery_event7_desc',
            alt: 'gallery_img7_alt'
        },
        {
            src: 'assets/events/fresh-fiest7.jpg',
            title: 'gallery_event8_title',
            description: 'gallery_event8_desc',
            alt: 'gallery_img8_alt'
        }
    ];
    
    return eventImages;
}

function renderGallery(images) {
    const galleryTrack = document.getElementById('gallery-track');
    const indicatorsContainer = document.getElementById('gallery-indicators');
    
    if (!galleryTrack || !indicatorsContainer) {
        console.error('Gallery containers not found');
        return;
    }
    
    // Limpiar contenido existente
    galleryTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Generar slides dinámicamente
    images.forEach((image, index) => {
        // Crear slide
        const slide = document.createElement('div');
        slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${image.src}" alt="${t(image.alt)}" data-translate-alt="${image.alt}">
            <div class="slide-overlay">
                <h3 data-translate="${image.title}">${t(image.title)}</h3>
                <p data-translate="${image.description}">${t(image.description)}</p>
            </div>
        `;
        galleryTrack.appendChild(slide);
        
        // Crear indicador
        const indicator = document.createElement('button');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('data-slide', index);
        indicator.setAttribute('title', `Ver imagen ${index + 1}`);
        indicator.setAttribute('aria-label', `Imagen ${index + 1}`);
        indicatorsContainer.appendChild(indicator);
    });
    
    console.log(`Galería renderizada con ${images.length} imágenes`);
}

function initializeDynamicGallery() {
    const images = loadEventImages();
    renderGallery(images);
    
    // Pequeña pausa para asegurar que el DOM esté listo
    setTimeout(() => {
        initializeGallery();
    }, 100);
}

// Gallery functionality
function initializeGallery() {
    const galleryTrack = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    let isAnimating = false;
    
    // Auto-slide timer
    let autoSlideTimer;
    const autoSlideInterval = 5000; // 5 seconds
    
    function updateGallery() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update track position
        if (galleryTrack) {
            galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateGallery();
        resetAutoSlide();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateGallery();
        resetAutoSlide();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateGallery();
        resetAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    if (galleryTrack) {
        galleryTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });
        
        galleryTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const difference = startX - endX;
            
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            } else {
                resetAutoSlide();
            }
        });
    }
    
    // Pause auto-slide on hover
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', stopAutoSlide);
        galleryContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Initialize auto-slide
    if (slides.length > 1) {
        startAutoSlide();
    }
    
    // Initialize first slide
    updateGallery();
}

// Intersection Observer para mejor detección de secciones
function initializeSectionObserver() {
    const observerOptions = {
        threshold: 0.3, // La sección debe estar 30% visible
        rootMargin: '-80px 0px -20% 0px' // Ajuste para el navbar
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId && sections.includes(sectionId)) {
                    currentSection = sectionId;
                    updateActiveNavLink();
                    console.log('Intersection Observer detectó sección:', sectionId); // Debug
                }
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
}

// Función para actualizar traducciones de la galería
function updateGalleryTranslations() {
    const slides = document.querySelectorAll('.gallery-slide');
    slides.forEach(slide => {
        const img = slide.querySelector('img[data-translate-alt]');
        const title = slide.querySelector('h3[data-translate]');
        const desc = slide.querySelector('p[data-translate]');
        
        if (img && img.dataset.translateAlt) {
            img.alt = t(img.dataset.translateAlt);
        }
        if (title && title.dataset.translate) {
            title.textContent = t(title.dataset.translate);
        }
        if (desc && desc.dataset.translate) {
            desc.textContent = t(desc.dataset.translate);
        }
    });
}

// Exportar funciones para uso global
window.scrollToSection = scrollToSection;
window.addRippleEffect = addRippleEffect;
window.updateCurrentLanguageDisplay = updateCurrentLanguageDisplay;
window.updateGalleryTranslations = updateGalleryTranslations;

// ============================================
// 🍓 GSAP MAGIC: STRAWBERRY MAGNETIC PHYSICS
// ============================================
function initStrawberryMagicWithGSAP() {
    // Esperar a que GSAP esté cargado
    if (typeof gsap === 'undefined') {
        console.log('⏳ Esperando GSAP...');
        setTimeout(initStrawberryMagicWithGSAP, 100);
        return;
    }

    console.log('🍓 Iniciando GSAP Strawberry Magic!');
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const strawberries = document.querySelectorAll('.floating-strawberry, .cute-strawberry');
    const chocolates = document.querySelectorAll('.floating-chocolate');
    
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 🎯 ANIMACIÓN 1: Efecto magnético con física realista
    strawberries.forEach((strawberry, index) => {
        // Timeline principal con loop infinito
        const tl = gsap.timeline({ repeat: -1 });
        
        // Rotación 3D continua
        gsap.to(strawberry, {
            rotationY: 360,
            duration: 3 + index,
            repeat: -1,
            ease: "none"
        });

        // Flotación con bounce
        tl.to(strawberry, {
            y: "+=30",
            duration: 2 + (index * 0.5),
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true
        });

        // Efecto de escala pulsante (como si respirara)
        gsap.to(strawberry, {
            scale: 1.2,
            duration: 1.5 + (index * 0.3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // 🧲 EFECTO MAGNÉTICO al pasar el cursor
        gsap.ticker.add(() => {
            const rect = strawberry.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = mouseX - centerX;
            const distanceY = mouseY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Radio de atracción magnética
            const magnetRadius = 200;
            
            if (distance < magnetRadius) {
                const force = (magnetRadius - distance) / magnetRadius;
                const pullX = distanceX * force * 0.3;
                const pullY = distanceY * force * 0.3;
                
                gsap.to(strawberry, {
                    x: `+=${pullX}`,
                    y: `+=${pullY}`,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Efecto de brillo cuando está cerca
                gsap.to(strawberry, {
                    filter: `brightness(${1 + force}) drop-shadow(0 0 ${force * 20}px rgba(233, 30, 99, 0.8))`,
                    duration: 0.2
                });
            } else {
                // Volver a posición original
                gsap.to(strawberry, {
                    x: 0,
                    y: 0,
                    filter: 'brightness(1) drop-shadow(0 0 0px rgba(233, 30, 99, 0))',
                    duration: 1,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });

    // 🎯 ANIMACIÓN 2: Chocolates con path curvo
    chocolates.forEach((chocolate, index) => {
        gsap.to(chocolate, {
            motionPath: {
                path: [
                    { x: 0, y: 0 },
                    { x: 50, y: -30 },
                    { x: 0, y: -60 },
                    { x: -50, y: -30 },
                    { x: 0, y: 0 }
                ],
                curviness: 1.5
            },
            duration: 8 + (index * 2),
            repeat: -1,
            ease: "none",
            rotation: 360
        });
    });

    // 🎯 ANIMACIÓN 3: Hero title con efecto espectacular
    const heroTitle = document.querySelector('.title-main');
    if (heroTitle) {
        gsap.from(heroTitle, {
            scale: 0,
            rotation: 720,
            opacity: 0,
            duration: 2,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: heroTitle,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        // Efecto de letras individuales
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text.split('').map((char, i) => 
            `<span style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        gsap.from(heroTitle.querySelectorAll('span'), {
            y: -100,
            opacity: 0,
            rotation: 360,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.5
        });
    }

    // 🎯 ANIMACIÓN 4: Scroll indicator con bounce infinito
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            y: 20,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }

    // 🎯 ANIMACIÓN 5: Parallax en scroll
    gsap.utils.toArray('.floating-strawberry').forEach((strawberry, i) => {
        gsap.to(strawberry, {
            y: (i + 1) * 100,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    });

    console.log('✨ GSAP Strawberry Magic activado!');
}

// Iniciar la magia cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStrawberryMagicWithGSAP);
} else {
    initStrawberryMagicWithGSAP();
}

// ============================================
// 📸 GSAP GALLERY MAGIC: 3D CAROUSEL & EFFECTS
// ============================================
function initGalleryMagicWithGSAP() {
    // Esperar a que GSAP esté cargado
    if (typeof gsap === 'undefined') {
        console.log('⏳ Esperando GSAP para galería...');
        setTimeout(initGalleryMagicWithGSAP, 100);
        return;
    }

    console.log('📸 Iniciando GSAP Gallery Magic!');
    gsap.registerPlugin(ScrollTrigger, Flip);

    const gallerySection = document.querySelector('.gallery');
    const slides = document.querySelectorAll('.gallery-slide');
    
    if (!gallerySection || slides.length === 0) {
        console.log('Galería no encontrada, esperando...');
        setTimeout(initGalleryMagicWithGSAP, 500);
        return;
    }

    // 🎯 ANIMACIÓN 1: Entrada épica de la galería con 3D flip
    gsap.from('.section-title', {
        scrollTrigger: {
            trigger: '.gallery',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        rotationX: -90,
        opacity: 0,
        y: 100,
        transformOrigin: 'bottom center',
        duration: 1.5,
        ease: 'power4.out'
    });

    // 🎯 ANIMACIÓN 2: Efecto de partículas de fresa alrededor de las fotos
    function createStrawberryParticles() {
        const gallery = document.querySelector('.gallery-container');
        if (!gallery) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '🍓';
            particle.style.position = 'absolute';
            particle.style.fontSize = Math.random() * 20 + 10 + 'px';
            particle.style.opacity = '0';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10';
            gallery.style.position = 'relative';
            gallery.appendChild(particle);

            // Animación de partícula flotante
            gsap.to(particle, {
                x: `random(-300, 300)`,
                y: `random(-300, 300)`,
                opacity: 0.7,
                rotation: 'random(-360, 360)',
                scale: 'random(0.5, 1.5)',
                duration: 'random(3, 6)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2
            });
        }
    }

    createStrawberryParticles();

    // 🎯 ANIMACIÓN 3: Efecto de hover en las slides con 3D tilt
    slides.forEach((slide) => {
        const img = slide.querySelector('img');
        const overlay = slide.querySelector('.slide-overlay');
        
        if (!img || !overlay) return;

        // Efecto 3D tilt con el mouse
        slide.addEventListener('mousemove', (e) => {
            const rect = slide.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(img, {
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });

            gsap.to(overlay, {
                rotationX: rotateX * 0.5,
                rotationY: rotateY * 0.5,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        slide.addEventListener('mouseleave', () => {
            gsap.to(img, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });

            gsap.to(overlay, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        // Efecto de clic con ondas
        slide.addEventListener('click', () => {
            // Crear onda de expansión
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.background = 'rgba(233, 30, 99, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            slide.appendChild(ripple);

            gsap.to(ripple, {
                width: '800px',
                height: '800px',
                opacity: 0,
                duration: 1.5,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });

            // Efecto de shake
            gsap.to(slide, {
                x: -10,
                duration: 0.1,
                yoyo: true,
                repeat: 5,
                ease: 'power2.inOut'
            });
        });
    });

    // 🎯 ANIMACIÓN 4: Botones de navegación con efecto magnético
    const navButtons = document.querySelectorAll('.gallery-nav');
    navButtons.forEach(button => {
        gsap.set(button, { scale: 1 });

        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.3,
                rotation: 360,
                backgroundColor: '#e91e63',
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                rotation: 0,
                backgroundColor: 'rgba(233, 30, 99, 0.8)',
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        // Efecto de pulso continuo
        gsap.to(button, {
            boxShadow: '0 0 30px rgba(233, 30, 99, 0.8)',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });

    // 🎯 ANIMACIÓN 5: Indicadores con efecto de ondas
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        gsap.to(indicator, {
            scale: 1.2,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            delay: index * 0.1,
            ease: 'sine.inOut'
        });

        indicator.addEventListener('click', () => {
            gsap.fromTo(indicator, 
                { scale: 1 },
                { 
                    scale: 2, 
                    opacity: 0, 
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => gsap.set(indicator, { scale: 1, opacity: 1 })
                }
            );
        });
    });

    // 🎯 ANIMACIÓN 6: Parallax en scroll para toda la galería
    gsap.to('.gallery-container', {
        scrollTrigger: {
            trigger: '.gallery',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        },
        y: -50,
        ease: 'none'
    });

    // 🎯 ANIMACIÓN 7: Efecto de brillos aleatorios
    function createSparkles() {
        const container = document.querySelector('.gallery-container');
        if (!container) return;

        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '20px';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '100';
            container.appendChild(sparkle);

            gsap.to(sparkle, {
                y: -100,
                opacity: 0,
                rotation: 360,
                scale: 0,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => sparkle.remove()
            });
        }, 2000);
    }

    createSparkles();

    // 🎯 ANIMACIÓN 8: Transición de slides con FLIP
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    function animateSlideTransition() {
        const activeSlide = document.querySelector('.gallery-slide.active');
        if (!activeSlide) return;

        const state = Flip.getState(activeSlide);
        
        Flip.from(state, {
            duration: 1,
            ease: 'power2.inOut',
            scale: true,
            absolute: true,
            onEnter: elements => {
                gsap.fromTo(elements, 
                    { opacity: 0, scale: 0, rotation: -180 },
                    { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }
                );
            },
            onLeave: elements => {
                gsap.to(elements, 
                    { opacity: 0, scale: 0, rotation: 180, duration: 0.6, ease: 'back.in(1.7)' }
                );
            }
        });
    }

    // Interceptar clics en navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            setTimeout(animateSlideTransition, 50);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            setTimeout(animateSlideTransition, 50);
        });
    }

    console.log('✨ GSAP Gallery Magic activado!');
}

// Iniciar la magia de la galería
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initGalleryMagicWithGSAP, 1000);
    });
} else {
    setTimeout(initGalleryMagicWithGSAP, 1000);
}
