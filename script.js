document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
        });
    }

    // 2. Active Link Highlight based on current page
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });

    // 4. Parallax Background Scroll
    const parallaxElements = document.querySelectorAll('.hero-bg-img, .page-header-bg');
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) return; // Disable on mobile to prevent lag
        if (!parallaxTicking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                parallaxElements.forEach(el => {
                    el.style.transform = `translateY(${scrolled * 0.4}px)`;
                });
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });

    // 5. Button Ripple Effect
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 6. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.card-3d');
    tiltCards.forEach(card => {
        let tiltTicking = false;
        card.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768) return; // Disable on mobile to prevent lag
            if (!tiltTicking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left; 
                    const y = e.clientY - rect.top; 
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -10; 
                    const rotateY = ((x - centerX) / centerX) * 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 7. Scroll Animations (Fade Up & Slide In)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up-element, .slide-in-left, .slide-in-right, .word-reveal');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // 8. Form Submit Simulation (Contact Page)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            setTimeout(() => {
                btn.innerText = 'Message Sent ✓';
                btn.style.background = 'var(--bg-aqua-blue)';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // 9. Mobile Autoplay Video Fallback
    const heroVid = document.getElementById('heroVideo');
    if (heroVid) {
        // Force play immediately
        const playPromise = heroVid.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by mobile browser - usually requires user interaction
                // Try playing once user scrolls/touches anywhere
                document.body.addEventListener('touchstart', () => {
                    heroVid.play();
                }, { once: true });
                document.body.addEventListener('click', () => {
                    heroVid.play();
                }, { once: true });
            });
        }
    }
    // 10. Activity Flip Cards (Mobile Tap Toggle)
    const flipCards = document.querySelectorAll('.activity-flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // If already focused, unfocus all, else focus this one
                const wasFocused = card.classList.contains('focused');
                flipCards.forEach(c => c.classList.remove('focused'));
                if (!wasFocused) {
                    card.classList.add('focused');
                }
            }
        });
    });

    // 11. Luxury Night Background (Stars & Glow)
    class CelestialBackground {
        constructor() {
            this.canvas = document.getElementById('celestial-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };
            this.mouseGlow = document.querySelector('.mouse-glow');
            this.colors = ['#8FD3FF', '#CFE8FF', '#FFFFFF'];
            
            this.resize();
            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.tx = e.clientX;
                this.mouse.ty = e.clientY;
            });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        }

        init() {
            this.stars = [];
            const isMobile = window.innerWidth < 768;
            const starCount = isMobile ? 80 : 250;

            for (let i = 0; i < starCount; i++) {
                const depth = Math.random();
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.05, 
                    vy: (Math.random() - 0.5) * 0.05,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.01 + 0.005,
                    size: Math.random() * 1.5 * depth + 0.2,
                    depth: depth 
                });
            }
        }

        updateMouseGlow() {
            if (!this.mouseGlow) return;
            // Smoothly move the glow to mouse position
            this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.1;
            this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.1;
            this.mouseGlow.style.left = `${this.mouse.x}px`;
            this.mouseGlow.style.top = `${this.mouse.y}px`;
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.stars.forEach(star => {
                // Drift
                star.x += star.vx;
                star.y += star.vy;

                // Wrap
                if (star.x < 0) star.x = this.canvas.width;
                if (star.x > this.canvas.width) star.x = 0;
                if (star.y < 0) star.y = this.canvas.height;
                if (star.y > this.canvas.height) star.y = 0;

                // Twinkle
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed *= -1;

                // Parallax
                const px = (this.mouse.x - window.innerWidth / 2) * (star.depth * 0.015);
                const py = (this.mouse.y - window.innerHeight / 2) * (star.depth * 0.015);

                this.ctx.globalAlpha = star.opacity;
                this.ctx.fillStyle = star.color;
                this.ctx.beginPath();
                this.ctx.arc(star.x + px, star.y + py, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }

        animate() {
            this.updateMouseGlow();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    new CelestialBackground();
});
