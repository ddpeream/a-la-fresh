// Variables globales
let currentSection = 'home';
const sections = ['home', 'products', 'gallery', 'contact'];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeParallax();
    initializeLanguageDropdown();
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
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Actualizar clase activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
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
    
    // Asegurar que los colores de los enlaces se mantengan
    const navLinks = document.querySelectorAll('.nav-link:not(.active)');
    navLinks.forEach(link => {
        link.style.color = '#666';
    });
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
