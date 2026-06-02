// --- Preloader ---
const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-bar::after') || document.querySelector('.loader-bar'); // Targeting the bar for style update
    const percentText = document.querySelector('.loader-percent');
    
    if (!preloader) return;

    // Check if the preloader was already hidden by the inline script
    if (preloader.style.display === 'none') return;

    // Detect if this is an explicit page reload
    let isReload = false;
    try {
        const navEntries = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation');
        if (navEntries && navEntries.length > 0) {
            isReload = navEntries[0].type === 'reload';
        }
    } catch (e) {}

    // Check if loader already completed in this session
    const hasRun = sessionStorage.getItem('preloader-run') === 'true';

    if (hasRun && !isReload) {
        preloader.style.display = 'none';
        return;
    }

    // Set session flag indicating loader is running/has run
    sessionStorage.setItem('preloader-run', 'true');

    let progress = 0;
    const duration = 3000; // 3 seconds
    const interval = 30; // Update every 30ms
    const step = 100 / (duration / interval);

    const loadingInterval = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Wait a tiny bit at 100% before fading out
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, 200);
        }
        
        // Update percentage text
        if(percentText) percentText.innerText = `${Math.floor(progress)}%`;
        
        preloader.style.setProperty('--load-progress', `${progress}%`);
    }, interval);
};

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
});

// --- Scroll Reveal Animation Logic ---
const initScrollAnimations = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach((el) => observer.observe(el));

    // For grid items (staggered delay)
    const delayElements = document.querySelectorAll('.scroll-reveal-delay');
    delayElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        observer.observe(el);
    });
};

// --- Header Scroll Effect ---
const initHeaderScroll = () => {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load
};


// --- Form Functionality (Saving to LocalStorage for Admin Dashboard) ---
const initForms = () => {
    // 1. Quote Form on Home Page
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('q-name').value;
            const email = document.getElementById('q-email').value;
            const service = document.getElementById('q-service').value;
            
            saveToAdmin('quoteRequests', { name, email, service, date: new Date().toLocaleDateString() });
            
            document.getElementById('quote-msg').style.display = 'block';
            quoteForm.reset();
            setTimeout(() => { document.getElementById('quote-msg').style.display = 'none'; }, 4000);
        });
    }

    // 2. Compliance Form on Compliance Page
    const complianceForm = document.getElementById('compliance-form');
    if (complianceForm) {
        complianceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const company = document.getElementById('eval-name').value;
            const standard = document.getElementById('eval-standard').value;
            
            saveToAdmin('complianceRequests', { company, standard, status: 'New', date: new Date().toLocaleDateString() });
            
            document.getElementById('form-message').style.display = 'block';
            complianceForm.reset();
            setTimeout(() => { document.getElementById('form-message').style.display = 'none'; }, 4000);
        });
    }
};

const saveToAdmin = (key, dataObj) => {
    let existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.unshift(dataObj); // add to top
    localStorage.setItem(key, JSON.stringify(existing));
};

// --- Advanced Three.js Plexus Particle Canvas ---
const initCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create pentagon geometry (smaller size)
    const particleGeometry = new THREE.CircleGeometry(0.12, 5); 
    const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0da19c, 
        transparent: true, 
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const particles = [];
    const particleCount = 120;
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(particleGeometry, particleMaterial);
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 40;
        
        mesh.userData = {
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04),
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        particleGroup.add(mesh);
        particles.push(mesh);
    }
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00A896,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const positions = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    particleGroup.add(linesMesh);
    
    camera.position.z = 25;
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        // Optimization: Stop rendering if scrolled completely past the hero section
        if (window.scrollY > window.innerHeight + 100) {
            isScrolling = true;
        } else {
            isScrolling = false;
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);
        
        if (isScrolling) return; // Pause WebGL to save GPU
        
        // Slow, continuous random-feeling ambient rotation
        particleGroup.rotation.y += 0.001;
        particleGroup.rotation.x += 0.0005;
        
        let vertexIndex = 0;
        let linePositions = linesMesh.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const p1 = particles[i];
            
            p1.position.add(p1.userData.velocity);
            
            // Depth of field fake (scale based on Z)
            const scale = Math.max(0.1, 1 + p1.position.z * 0.02);
            p1.scale.set(scale, scale, scale);
            
            // Pulse glow effect
            p1.userData.pulsePhase += p1.userData.pulseSpeed;
            p1.material.opacity = 0.3 + Math.sin(p1.userData.pulsePhase) * 0.5;
            
            p1.rotation.x += 0.01;
            p1.rotation.y += 0.02;
            
            if (p1.position.x < -25 || p1.position.x > 25) p1.userData.velocity.x *= -1;
            if (p1.position.y < -25 || p1.position.y > 25) p1.userData.velocity.y *= -1;
            if (p1.position.z < -20 || p1.position.z > 20) p1.userData.velocity.z *= -1;
            
            for (let j = i + 1; j < particleCount; j++) {
                const p2 = particles[j];
                const dist = p1.position.distanceTo(p2.position);
                
                if (dist < 7) { // Connect only if close
                    linePositions[vertexIndex++] = p1.position.x;
                    linePositions[vertexIndex++] = p1.position.y;
                    linePositions[vertexIndex++] = p1.position.z;
                    
                    linePositions[vertexIndex++] = p2.position.x;
                    linePositions[vertexIndex++] = p2.position.y;
                    linePositions[vertexIndex++] = p2.position.z;
                }
            }
        }
        
        linesMesh.geometry.setDrawRange(0, vertexIndex / 3);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    };
    
    animate();
};

// --- Dark Mode Toggle ---
// Apply saved preference immediately to prevent flash
(function() {
    if (localStorage.getItem('metrix-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
})();

const initDarkMode = () => {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('metrix-dark-mode', isDark);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initScrollAnimations();
    initHeaderScroll();
    initForms();
    initCanvas();
    initCountUp();
});

// --- Count Up Animation ---
const initCountUp = () => {
    const counters = document.querySelectorAll('.count-up');
    
    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            const currentCount = Math.floor(easeProgress * target);
            counter.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };
        requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
};

// --- Image Services Carousel ---
const initImgCarousel = () => {
    const track   = document.getElementById('img-carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsEl  = document.getElementById('carousel-dots');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.querySelectorAll('.img-service-card'));
    const total = cards.length;
    let currentIndex = 0;

    // How many cards are visible at once (mirrors CSS breakpoints)
    const getVisible = () => {
        if (window.innerWidth <= 640)  return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };

    // Build dot buttons
    const buildDots = () => {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        const steps = total - getVisible() + 1;
        for (let i = 0; i < steps; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!dotsEl) return;
        dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const goTo = (index) => {
        const visible = getVisible();
        const maxIndex = Math.max(0, total - visible);
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        // Calculate card width including gap
        const cardWidth  = cards[0].getBoundingClientRect().width;
        const gap        = 24; // 1.5rem gap matches CSS
        const offset     = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // Arrow states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;

        updateDots();
    };

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
    });

    // Re-initialise on resize (responsive recalc)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildDots();
            goTo(currentIndex); // recalc offset for new card width
        }, 150);
    });

    // Check window hash on load/hashchange
    const checkHash = () => {
        const hash = window.location.hash;
        if (!hash) return;
        const targetId = hash.substring(1); // remove '#'
        
        // Find index of card that matches targetId
        const targetCardIndex = cards.findIndex(card => card.id === targetId);
        if (targetCardIndex !== -1) {
            // First slide/goTo the card index
            goTo(targetCardIndex);
            
            // Then scroll the container into view
            const section = document.getElementById('img-services');
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    };

    window.addEventListener('hashchange', checkHash);

    // Init
    buildDots();
    goTo(0);
    // Execute hash check on page load to handle initial deep links
    setTimeout(checkHash, 300);
};

document.addEventListener('DOMContentLoaded', () => {
    initImgCarousel();
});

