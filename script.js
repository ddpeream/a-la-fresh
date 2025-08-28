// Variables globales
let currentSection = 'home';
const sections = ['home', 'products', 'contact'];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeParallax();
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
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
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
    const scrollY = window.scrollY + 150;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    updateActiveNavLink();
                }
            }
        }
    });
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

// Exportar funciones para uso global
window.scrollToSection = scrollToSection;
window.addRippleEffect = addRippleEffect;
